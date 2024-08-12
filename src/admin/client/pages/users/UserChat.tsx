import { Helmet } from 'react-helmet-async';
import UserChatView from '../../sections/Users/UserChatView';

const UserChat = () => {
  return (
    <>
      <Helmet>
        <title> Chat</title>
      </Helmet>

      <UserChatView />
    </>
  );
};

export default UserChat;
