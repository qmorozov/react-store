import { Helmet } from 'react-helmet-async';
import UsersListView from '../../sections/Users/UsersListView';

const UsersList = () => {
  return (
    <>
      <Helmet>
        <title> Users list</title>
      </Helmet>

      <UsersListView />
    </>
  );
};

export default UsersList;
