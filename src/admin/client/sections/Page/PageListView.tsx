import { Button, Container, LinearProgress, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import { paths } from '../../routes/paths';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Card from '@mui/material/Card';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import { useEffect, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import PageListRow from './PageListRow';
import { removeHtmlTags } from '../FAQ/FAQTableRow';
import Pagination from '@mui/material/Pagination';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../../../page/client/page.api.admin.client';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 10 },
  { id: 'title_en', label: 'Title', width: 150 },
  { id: 'content_en', label: 'Content', width: 150 },
  { id: 'url', label: 'URL', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 25 },
];

const PageListView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const [totalPages, setTotalPages] = useState(1);

  const getPages = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const pages = await AdminApi.getPages();

      setIsLoading(false);
      setPages(pages);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status): Promise<void> => {
    const formData = {
      status,
    };

    try {
      await AdminApi.updatePageStatus(id, formData);

      showSuccessNotification('Status changed successfully', null);
    } catch (err) {
      console.log(err);
      showErrorNotification('Something went wrong', null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await AdminApi.deletePage(id);

      const filteredPages = pages.filter((page) => page.id !== id);

      setPages(filteredPages);
      showSuccessNotification('Page deleted successfully', null);

      setTotalPages(Math.ceil(filteredPages.length / rowsPerPage));

      if (page > totalPages) {
        setPage(totalPages);
      }
    } catch (err) {
      console.log(err);
      showErrorNotification('Something went wrong', null);
    }
  };

  useEffect(() => {
    getPages();
  }, []);

  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const sortedPages = [...pages].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy === 'content_en') {
      aValue = removeHtmlTags(aValue);
      bValue = removeHtmlTags(bValue);
    }

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

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPages = sortedPages.filter((page) => page.title_en.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedPages = filteredPages.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Pages"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Pages' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/page/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Page
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UsersTableToolbar value={searchQuery} onChange={handleSearchChange} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={pages.length}
                onSort={(columnId: string) => handleSort(columnId)}
              />

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <LinearProgress style={{ width: '100%', margin: '20px 0' }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedPages.length ? (
                  paginatedPages.map((page) => (
                    <PageListRow
                      row={page}
                      key={page.id}
                      onRemove={() => handleDelete(page.id)}
                      switchOnChange={(id, status) => handleStatusChange(id, status)}
                    />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {pages.length > rowsPerPage && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(filteredPages.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        )}
      </Card>
    </Container>
  );
};

export default PageListView;
