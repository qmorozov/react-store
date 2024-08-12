import { useCallback, useEffect, useState } from 'react';
import OrderTableToolbar from './order-table-toolbar';
import TableContainer from '@mui/material/TableContainer';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from '../../components/table';
import { Card, IconButton, LinearProgress, TableBody, TableRow, Tooltip } from '@mui/material';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import OrderTableRow from './order-table-row';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { useBoolean } from '../../hooks/use-boolean';
import { IOrderTableFilters, IOrderTableFilterValue } from '../../types/order';
import { AdminApi } from '../../admin.api.client';

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order', width: 20 },
  { id: 'customerName', label: 'Customer', width: 100 },
  { id: 'createdAt', label: 'Date', width: 100 },
  { id: 'sellerName', label: 'Seller', width: 100 },
  { id: 'totalQuantity', label: 'Items', width: 20, align: 'center' },
  { id: 'totalAmount', label: 'Price', width: 140 },
  { id: 'status', label: 'Status', width: 60 },
  { id: '', width: 25 },
];

const defaultFilters: IOrderTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const OrdersTableView = ({ showFirstPageOnly = false }) => {
  const navigate = useNavigate();

  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 20 });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [tableInfo, setTableInfo] = useState({
    count: 0,
    page: 1,
    inPage: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const notFound = false;

  const getOrders = async (page: number): Promise<void> => {
    try {
      setIsLoading(true);
      const orders = await AdminApi.getOrders(page);

      setTableInfo({
        count: orders.count,
        page: orders.page,
        inPage: orders.inPage,
      });

      setTableData(orders.orders);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    if (showFirstPageOnly) {
      getOrders(1);
    } else {
      getOrders(table.page);
    }
  }, [showFirstPageOnly]);

  const renderTableData = showFirstPageOnly
    ? tableData.slice(0, 10)
    : tableData.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

  const showPagination = !showFirstPageOnly && Math.ceil(+tableInfo.count / +tableInfo.inPage) > 1;

  return (
    <Card>
      {!showFirstPageOnly && (
        <OrderTableToolbar
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.id),
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={null}
              orderBy={null}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              onSort={null}
            />

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEAD.length}>
                    <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                  </TableCell>
                </TableRow>
              ) : tableData.length ? (
                renderTableData.map((row) => (
                  <OrderTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => console.log(row.id)}
                    onViewRow={() => navigate('/admin/orders/info/' + row.id)}
                  />
                ))
              ) : (
                <TableNoData notFound={notFound} />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {showPagination && renderTableData.length > 0 && (
        <Pagination
          color="primary"
          shape="rounded"
          variant="outlined"
          style={{ width: 'fit-content', margin: '20px auto' }}
          count={Math.ceil(+tableInfo.count / +tableInfo.inPage)}
          onChange={(event, page) => getOrders(page)}
        />
      )}
    </Card>
  );
};

export default OrdersTableView;

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: any;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  let orders = [...inputData];

  if (comparator) {
    orders.sort(comparator);
  }

  if (name) {
    const searchName = name.toLowerCase();
    orders = orders.filter((order) => {
      if (
        (order.products &&
          Array.isArray(order.products) &&
          order.products.some((product) => product.title && product.title.toLowerCase().includes(searchName))) ||
        (order.id && order.id.toString().includes(searchName)) ||
        (order.seller && order.seller.name && order.seller.name.toLowerCase().includes(searchName))
      ) {
        return true;
      }
      return false;
    });
  }

  if (status !== 'all') {
    orders = orders.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      orders = orders.filter(
        (order) => new Date(order.createdAt) >= new Date(startDate) && new Date(order.createdAt) <= new Date(endDate),
      );
    }
  }

  return { orders, count: orders.length, page: 1, inPage: 20 };
}
