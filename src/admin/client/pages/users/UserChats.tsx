import UserChatsView from '../../sections/Users/UserChatsView';
import { Helmet } from 'react-helmet-async';
import UserChatView from '../../sections/Users/UserChatView';

const UserChats = () => {
  return (
    <>
      <Helmet>
        <title> User chats</title>
      </Helmet>

      {/*<UserChatsView />*/}
      <UserChatView />
    </>
  );
};

export default UserChats;
