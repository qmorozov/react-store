import { useEffect, useState } from 'react';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import { Button, Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import { paths } from '../../routes/paths';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import { AdminApi } from '../../admin.api.client';
import TableCell from '@mui/material/TableCell';
import PlansTableRow from './PlansTableRow';
import Pagination from '@mui/material/Pagination';
import { useNotification } from '../../hooks/useNotification';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 10 },
  { id: 'active', label: 'Status', width: 20 },
  { id: 'title_en', label: 'Title', width: 150 },
  { id: 'description_en', label: 'Description', width: 150 },
  { id: 'type', label: 'Type', width: 100 },
  { id: 'price_month', label: 'Month price', width: 100 },
  { id: 'price_year', label: 'Year price', width: 100 },
  { id: 'max_products', label: 'Product quantity', width: 100 },
  { id: '', width: 25 },
];

const PlansView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filterPlans = (plans, query) => {
    return plans.filter(
      (plan) =>
        plan.title_en.toLowerCase().includes(query.toLowerCase()) ||
        plan.description_en.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const plansData = await AdminApi.getPlans();

      setPlans(plansData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleStatusChange = async (id, active, title) => {
    try {
      await AdminApi.updatePricingStatus(id, active);
      setPlans((prevPlans) => prevPlans.map((plan) => (plan.id === id ? { ...plan, active } : plan)));

      showSuccessNotification(`Status "${title}" updated successfully.`, null);
    } catch (error) {
      console.log(error);
      showErrorNotification(`Failed to update "${title}" status.`, null);
    }
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedPlans = filterPlans(plans, searchQuery);

  const sortedPlans = [...filteredAndSortedPlans].sort((a, b) => {
    const isAsc = order === 'asc';

    if (
      orderBy === 'price_month' ||
      orderBy === 'price_year' ||
      orderBy === 'max_products' ||
      orderBy === 'type' ||
      orderBy === 'id'
    ) {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      return isAsc ? valueA - valueB : valueB - valueA;
    } else if (orderBy === 'title_en' || orderBy === 'description_en') {
      const valueA = a[orderBy].toLowerCase();
      const valueB = b[orderBy].toLowerCase();

      return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (orderBy === 'active') {
      if (isAsc) {
        return a[orderBy] === b[orderBy] ? 0 : a[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] === b[orderBy] ? 0 : a[orderBy] ? 1 : -1;
      }
    } else {
      const valueA = typeof a[orderBy] === 'string' ? a[orderBy] : '';
      const valueB = typeof b[orderBy] === 'string' ? b[orderBy] : '';

      return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
  });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedPlans = sortedPlans.slice(startIndex, endIndex);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Pricing plans"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Pricing plans' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/plan/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Plan
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UsersTableToolbar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={plans.length}
                onSort={handleSort}
              />

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                    </TableCell>
                  </TableRow>
                ) : slicedPlans.length ? (
                  slicedPlans.map((plan) => (
                    <PlansTableRow
                      key={plan.id}
                      switchOnChange={(id, active) => handleStatusChange(id, active, plan.title_en)}
                      row={plan}
                      onRemove={() => console.log('delete')}
                    />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {plans.length > rowsPerPage && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(sortedPlans.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </Container>
  );
};

export default PlansView;
