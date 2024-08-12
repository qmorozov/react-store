import { ChangeEvent, useEffect, useState } from 'react';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import {
  Button,
  Container,
  LinearProgress,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tabs,
} from '@mui/material';
import { paths } from '../../routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import UsersTableToolbar from '../Users/UsersTableToolbar';
import Card from '@mui/material/Card';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import FAQTableRow from './FAQTableRow';
import Pagination from '@mui/material/Pagination';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 100 },
  { id: 'title', label: 'Title', width: 400 },
  { id: 'answer', label: 'Answer', width: 400 },
  { id: 'categoryId', label: 'Category ID', width: 200 },
  { id: '', width: 50 },
];

const FaqListView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [FAQList, setFAQList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedFAQList, setSortedFAQList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(20);

  const [FAQCategoriesList, setFAQCategoriesList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    const sorted = [...FAQList].sort((a, b) => {
      if (orderBy === 'title') {
        return order === 'asc' ? a.title_en.localeCompare(b.title_en) : b.title_en.localeCompare(a.title_en);
      } else {
        return order === 'asc' ? a.id - b.id : b.id - a.id;
      }
    });

    const filtered = sorted.filter((faq) => {
      const searchText = searchValue.toLowerCase();
      return faq.title_en.toLowerCase().includes(searchText) || faq.answer_en.toLowerCase().includes(searchText);
    });

    const parentIdFiltered = selectedCategory ? filtered.filter((faq) => faq.parentId === selectedCategory) : filtered;

    setSortedFAQList(parentIdFiltered);
  }, [FAQList, orderBy, order, searchValue, selectedCategory]);

  const handlePageChange = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const fetchFAQList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const FAQListData = await AdminApi.getFAQList();
      setFAQList(FAQListData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getFAQCategories = async (): Promise<void> => {
    try {
      const FAQCategoriesData = await AdminApi.getFAQCategories();

      setFAQCategoriesList(FAQCategoriesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFAQList();
    getFAQCategories();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedFAQList = sortedFAQList.slice(startIndex, endIndex);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await AdminApi.deleteFAQ(id.toString());
      showSuccessNotification('FAQ successfully deleted.', null);
      const updatedList = FAQList.filter((faqItem) => faqItem.id !== id);
      setFAQList(updatedList);
    } catch (error) {
      console.error(error);
      showErrorNotification('An error occurred while deleting the FAQ item.', null);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="FAQ List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'FAQ',
            href: paths.users.root,
          },
          { name: 'FAQ list' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/faq/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New FAQ
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UsersTableToolbar value={searchValue} onChange={handleSearchChange} />

        <Tabs
          value={selectedCategory}
          onChange={(event, newValue) => handleCategoryChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="FAQ Categories"
        >
          <Tab label="All" value={null} />
          {FAQCategoriesList.map((category) => (
            <Tab label={category.title_en} value={category.id} key={category.id} />
          ))}
        </Tabs>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={sortedFAQList.length}
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
                ) : paginatedFAQList.length ? (
                  paginatedFAQList.map((faq) => (
                    <FAQTableRow row={faq} key={faq.id} onRemove={() => handleDelete(faq.id)} />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {FAQList.length > 20 && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(sortedFAQList.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </Container>
  );
};

export default FaqListView;
