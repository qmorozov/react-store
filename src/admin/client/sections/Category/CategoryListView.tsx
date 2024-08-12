import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import { useEffect, useState } from 'react';
import CategoriesRow from './CategoriesRow';
import Pagination from '@mui/material/Pagination';
import { AdminApi } from '../../admin.api.client';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 10 },
  { id: 'image', label: 'Image', width: 40 },
  { id: 'name_en', label: 'Name', width: 150 },
  { id: 'order', label: 'Order', width: 10 },
  { id: 'productType', label: 'Product type', width: 100 },
  { id: 'url', label: 'url', width: 100 },
  { id: '', width: 25 },
];

const CategoryListView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState<string>('order');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (property: string) => {
    if (property === 'image') {
      return;
    }

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const categoriesData = await AdminApi.getCategoriesList();

      setCategories(categoriesData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const sortedCategories = categories.sort((a, b) => {
    const isAsc = order === 'asc';
    const compareValue = (a: any, b: any) => {
      if (a[orderBy] < b[orderBy]) {
        return isAsc ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    };
    return compareValue(a, b);
  });

  const filteredCategories = sortedCategories.filter(
    (category) =>
      category.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.productType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const displayedCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Categories"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Categories' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UsersTableToolbar
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={categories.length}
                onSort={handleSort}
              />

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                    </TableCell>
                  </TableRow>
                ) : displayedCategories.length ? (
                  displayedCategories.map((category) => (
                    <CategoriesRow key={category.id} row={category} onRemove={() => console.log('del')} />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Pagination
          color="primary"
          shape="rounded"
          variant="outlined"
          style={{ width: 'fit-content', margin: '20px auto' }}
          count={Math.ceil(filteredCategories.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Card>
    </Container>
  );
};

export default CategoryListView;
