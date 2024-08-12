import { useEffect, useState } from 'react';
import { Button, Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import { paths } from '../../routes/paths';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import { AdminApi } from '../../admin.api.client';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import FAQCategoriesTableRow from './FAQCategoriesTableRow';
import Pagination from '@mui/material/Pagination';
import { useNotification } from '../../hooks/useNotification';

export interface IFAQCategory {
  id: number;
  parentId: number | null;
  [titleLang: string]: string | number;
}

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 100 },
  { id: 'title', label: 'Title', width: 400 },
  { id: '', width: 50 },
];

const FaqCategoriesView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });
  const [categories, setCategories] = useState<IFAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchFAQCategories = async (): Promise<void> => {
    try {
      const FAQCategoriesData = await AdminApi.getFAQCategories();
      setCategories(FAQCategoriesData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQCategories();
  }, []);

  const handleDeleteCategory = async (id: IFAQCategory['id'], title: string | number) => {
    try {
      await AdminApi.deleteFAQCategory(id);
      setCategories((prevCategories) => prevCategories.filter((category: IFAQCategory) => category.id !== id));
      showSuccessNotification(`Category "${title}" has been deleted.`, null);
    } catch (error) {
      console.error(error);
      showErrorNotification(`Error deleting category "${title}".`, null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = (categories, query) => {
    return categories.filter((category) => category.title_en.toLowerCase().includes(query.toLowerCase()));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedCategories = filterCategories(categories, searchQuery).sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'id') {
      return isAsc ? a.id - b.id : b.id - a.id;
    } else if (orderBy === 'title') {
      if (a.title && b.title) {
        return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      return isAsc ? a.id - b.id : b.id - a.id;
    }
    return 0;
  });

  const calculatePageRange = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return [startIndex, endIndex];
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="FAQ categories"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ',
            href: paths.users.root,
          },
          { name: 'FAQ categories' },
        ]}
        action={
          <Button
            component={RouterLink}
            variant="contained"
            href={'/admin/faq/categories/manage'}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New category
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
                rowCount={categories.length}
                numSelected={table.selected.length}
                onSort={handleSort}
              />

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedCategories.length ? (
                  filteredAndSortedCategories
                    .slice(...calculatePageRange())
                    .map((category) => (
                      <FAQCategoriesTableRow
                        row={category}
                        key={category.id}
                        onRemove={() => handleDeleteCategory(category.id, category.title_en)}
                      />
                    ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {categories.length > 20 && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(filteredAndSortedCategories.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </Container>
  );
};

export default FaqCategoriesView;
