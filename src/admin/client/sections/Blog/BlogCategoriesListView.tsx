import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { Button, Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import BlogCategoriesTableRow from './BlogCategoriesTableRow';
import { AdminApi } from '../../admin.api.client';
import { useNotification } from '../../hooks/useNotification';
import Pagination from '@mui/material/Pagination';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 20 },
  { id: 'name_en', label: 'Name', width: 100 },
  { id: 'url', label: 'URL', width: 100 },
  { id: '', width: 5 },
];

const BlogCategoriesListView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [orderBy, setOrderBy] = useState<string>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchBlogCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const blogCategoriesData = await AdminApi.getBlogCategories();

      setCategories(blogCategoriesData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogCategories();
  }, []);

  const handleDeleteCategory = async (id: string | number, name: string): Promise<void> => {
    try {
      await AdminApi.deleteBlogCategory(id);

      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));

      showSuccessNotification(`Category "${name}" has been deleted.`, null);
    } catch (error) {
      console.error(error);
      showErrorNotification(`Error deleting category "${name}".`, null);
    }
  };

  const handleSort = (columnId: string) => {
    if (orderBy === '') {
      return;
    }

    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (orderBy === '') {
      return 0;
    }

    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (order === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const filteredCategories = sortedCategories.filter((category) =>
    category.name_en.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedCategories = filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Blog categories"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Blog categories' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/blog/categories/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Category
          </Button>
        }
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
                ) : paginatedCategories.length ? (
                  paginatedCategories.map((category) => (
                    <BlogCategoriesTableRow
                      row={category}
                      key={category.id}
                      onRemove={() => handleDeleteCategory(category.id, category.name_en)}
                    />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {categories.length > rowsPerPage && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(filteredCategories.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        )}
      </Card>
    </Container>
  );
};

export default BlogCategoriesListView;
