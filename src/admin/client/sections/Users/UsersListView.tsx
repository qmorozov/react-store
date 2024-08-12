import { Card, Container, LinearProgress, TableBody, TableRow } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import UsersTableToolbar from './UsersTableToolbar';
import TableContainer from '@mui/material/TableContainer';
import Scrollbar from '../../components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from '../../components/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AdminApi } from '../../../../admin1/client/admin.api.client';
import { UserRole } from '../../../../user/models/UserRole';
import TableCell from '@mui/material/TableCell';
import UserTableRow from './UserTableRow';
import Table from '@mui/material/Table';
import Pagination from '@mui/material/Pagination';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 20 },
  { id: 'email', label: 'Email', width: 50 },
  { id: 'isOnline', label: 'Is online', width: 20 },
  { id: 'role', label: 'Role', width: 100 },
  { id: '', width: 25 },
];

const UsersListView = () => {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 5 });

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event.target.value);
  };

  const getUsers = async () => {
    try {
      setIsLoading(true);

      const usersData = await AdminApi.getUsers();
      setUsers(usersData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateUserRole = async (id: number | string, role: UserRole | null): Promise<void> => {
    try {
      setIsLoading(true);
      await AdminApi.updateUserRole(id, role);

      const updatedUsersData = await AdminApi.getUsers();
      setUsers(updatedUsersData);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
    } else if (orderBy === 'email') {
      return order === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
    }
    return 0;
  });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const visibleUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Users"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Users',
              href: paths.users.root,
            },
            { name: 'Users list' },
          ]}
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
                  ) : sortedUsers.length ? (
                    visibleUsers.map((user) => (
                      <UserTableRow
                        key={user.uuid}
                        user={user}
                        selectOnChange={(event) => {
                          const selectedRole = (UserRole[event.target.value] || 0) as number | null;
                          updateUserRole(user.id, selectedRole);
                        }}
                        selectValue={UserRole[user.role] ?? 0}
                      />
                    ))
                  ) : (
                    <TableNoData notFound={true} />
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {sortedUsers.length > 20 && (
            <Pagination
              color="primary"
              shape="rounded"
              variant="outlined"
              style={{ width: 'fit-content', margin: '20px auto' }}
              count={Math.ceil(sortedUsers.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
            />
          )}
        </Card>
      </Container>
    </>
  );
};

export default UsersListView;
