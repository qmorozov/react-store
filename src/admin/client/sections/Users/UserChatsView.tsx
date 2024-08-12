import { useNavigate, useParams } from 'react-router-dom';
import { AdminApi } from '../../../../admin1/client/admin.api.client';
import React, { useEffect, useState } from 'react';
import { Table, TableContainer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import Stack from '@mui/material/Stack';
import { Card, Container, LinearProgress, TableBody, TableRow } from '@mui/material';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import { paths } from '../../routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import UsersTableToolbar from './UsersTableToolbar';
import Scrollbar from '../../components/scrollbar';
import TableCell from '@mui/material/TableCell';
import UserChatsTableRow from './UserChatsTableRow';
import Pagination from '@mui/material/Pagination';

const TABLE_HEAD = [
  { id: 'userId', label: 'ID', width: 20 },
  { id: 'name', label: 'Name', width: 20 },
  { id: 'isOnline', label: 'Is online', width: 100 },
  { id: 'lastMessage', label: 'Last message', width: 100 },
  { id: '', width: 25 },
];

const ITEMS_PER_PAGE = 20;

const UserChatsView = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();

  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: ITEMS_PER_PAGE });

  const [userChats, setUserChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState<string>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const displayedUserChats = userChats.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    setCurrentPage(1);
    setSearchQuery(searchQuery);
  };

  const filteredUserChats = userChats.filter(({ addressee }) =>
    addressee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getUserChats = async (id, type): Promise<void> => {
    try {
      setIsLoading(true);

      const userChats = await AdminApi.getUserChats(id, type);
      setUserChats(userChats);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && type) getUserChats(id, type);
  }, []);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUserChats = [...filteredUserChats].sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc'
        ? a.addressee.name.localeCompare(b.addressee.name)
        : b.addressee.name.localeCompare(a.addressee.name);
    } else if (orderBy === 'lastMessage') {
      return order === 'asc'
        ? a.lastMessage.message.localeCompare(b.lastMessage.message)
        : b.lastMessage.message.localeCompare(a.lastMessage.message);
    } else if (orderBy === 'userId') {
      return order === 'asc' ? a.addressee.id - b.addressee.id : b.addressee.id - a.addressee.id;
    }
    return 0;
  });

  return (
    <Container maxWidth="lg">
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton onClick={() => navigate(-1)}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <CustomBreadcrumbs
          heading="Chats list"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Users',
              href: paths.users.root,
            },
            { name: 'Chats list' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      </Stack>

      <Card style={{ marginTop: 20 }}>
        <UsersTableToolbar value={searchQuery} onChange={handleSearch} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={20}
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
                ) : displayedUserChats.length ? (
                  sortedUserChats.slice(startIndex, endIndex).map(({ uuid, addressee, lastMessage }) => (
                    <UserChatsTableRow
                      key={uuid}
                      chat={{
                        uuid,
                        type: addressee.type,
                        userId: addressee.id,
                        name: addressee.name,
                        image: addressee.image,
                        isOnline: addressee.isOnline,
                        lastMessage: lastMessage.message,
                      }}
                    />
                  ))
                ) : (
                  <TableNoData notFound={true} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {userChats.length > 20 && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(userChats.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </Container>
  );
};

export default UserChatsView;
