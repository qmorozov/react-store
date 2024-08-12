import { useCallback, useEffect, useState } from 'react';
import { IOrderTableFilters, IOrderTableFilterValue } from '../../types/order';
import { AdminApi } from '../../admin.api.client';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from '../../components/table';
import { Button, Card, Container, IconButton, LinearProgress, TableBody, TableRow, Tooltip } from '@mui/material';
import { ConfirmDialog } from '../../components/custom-dialog';
import { useBoolean } from '../../hooks/use-boolean';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import OrderTableToolbar from './order-table-toolbar';
import TableContainer from '@mui/material/TableContainer';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import Table from '@mui/material/Table';
import OrderTableRow from './order-table-row';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import OrdersTableView from './OrdersTableView';

const OrderListView = () => {
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 20 });

  const confirm = useBoolean();
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Orders"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Order',
              href: paths.orders.root,
            },
            { name: 'Orders list' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <OrdersTableView />
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default OrderListView;
