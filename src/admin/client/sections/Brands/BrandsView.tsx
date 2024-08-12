import { ChangeEvent, useEffect, useState } from 'react';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import { Button, Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import { paths } from '../../routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import BrandsTableRow from './BrandsTableRow';
import Pagination from '@mui/material/Pagination';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import { AdminApi } from '../../admin.api.client';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 20 },
  { id: 'name', label: 'Name', width: 50 },
  { id: 'image', label: 'Image', width: 20 },
  { id: 'order', label: 'Order', width: 100 },
  { id: 'url', label: 'URL', width: 100 },
  { id: 'showOnMain', label: 'Show on main', width: 10 },
  { id: '', width: 25 },
];

const BrandsView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [filteredBrands, setFilteredBrands] = useState([]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchQuery = event.target.value.toLowerCase();

    const filteredBrands = brands.filter((brand) => {
      const brandValues = Object.values(brand).join(' ').toLowerCase();
      return brandValues.includes(searchQuery);
    });

    setFilteredBrands(filteredBrands);
    setSearchValue(event.target.value);
    setPage(1);
  };

  const getBrands = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const brandsData = await AdminApi.getBrands();

      setBrands(brandsData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleDeleteBrand = async (id: number | string): Promise<void> => {
    try {
      await AdminApi.deleteBrand(id.toString());
      const updatedBrands = brands.filter((brand) => brand.id !== id);
      setBrands(updatedBrands);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const totalPages = Math.ceil(brands.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (property: string) => {
    if (property === 'showOnMain' || property === 'image') {
      return;
    }

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedBrands = [...brands].sort((a, b) => {
    const isAsc = order === 'asc';

    if (orderBy === 'order') {
      return (isAsc ? a.order : b.order) - (isAsc ? b.order : a.order);
    } else if (orderBy === 'id') {
      return isAsc ? a.id - b.id : b.id - a.id;
    } else {
      const valueA = typeof a[orderBy] === 'string' ? a[orderBy] : '';
      const valueB = typeof b[orderBy] === 'string' ? b[orderBy] : '';

      return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
  });

  const getCurrentPageBrands = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return searchValue ? filteredBrands.slice(startIndex, endIndex) : sortedBrands.slice(startIndex, endIndex);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Brands"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Brands',
            href: paths.brands.root,
          },
          { name: 'Brands' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/brands/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Brand
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UsersTableToolbar value={searchValue} onChange={handleSearchChange} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={brands.length}
                onSort={handleSort}
              />

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                    </TableCell>
                  </TableRow>
                ) : getCurrentPageBrands().length ? (
                  getCurrentPageBrands().map((brand) => (
                    <BrandsTableRow key={brand.id} row={brand} onRemove={() => handleDeleteBrand(brand.id)} />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {brands.length > 20 && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </Container>
  );
};

export default BrandsView;
