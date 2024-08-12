import { useNavigate, useParams } from 'react-router-dom';
import { AdminApi } from '../../../../admin1/client/admin.api.client';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import Stack from '@mui/material/Stack';
import { Avatar, Card } from '@mui/material';
import UserChatNav from './UserChatNav';
import ChatMessageList from './chat-message-list';
import Badge from '@mui/material/Badge';
import ListItemText from '@mui/material/ListItemText';

const UserChatView = () => {
  const navigate = useNavigate();

  const { id, type } = useParams<string>();
  const [userChats, setUserChats] = useState<any[]>([]);

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [isChatEmpty, setIsChatEmpty] = useState<boolean>(false);

  const getUserChatMessages = async (id, type, uuid): Promise<void> => {
    try {
      setChatInfo(null);
      setChatMessages([]);

      const userChatMessages = await AdminApi.getUserChatMessages(id, type, uuid);

      setChatMessages(userChatMessages.messages);

      setChatInfo(userChatMessages.chat.addressee);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserChats = async (id, type): Promise<void> => {
    try {
      const userChats = await AdminApi.getUserChats(id, type);
      setUserChats(userChats);

      setIsChatEmpty(!!!userChats.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id && type) getUserChats(id, type);
  }, []);

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <ChatMessageList messages={chatMessages} isChatEmpty={isChatEmpty} />
    </Stack>
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
        <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Avatar src={chatInfo?.image} alt={chatInfo?.name} />
        </Badge>

        {chatInfo && <ListItemText primary={chatInfo?.name} secondary={chatInfo?.isOnline ? 'Online' : 'Offline'} />}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton onClick={() => navigate(-1)}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <CustomBreadcrumbs
          heading="Chat"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Users',
              href: paths.users.root,
            },
            { name: 'Chat' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      </Stack>

      <Card style={{ marginTop: 20 }}>
        <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
          <UserChatNav
            selectedChatUUID={chatInfo?.uuid}
            chatItemsData={userChats}
            setChatInfo={setChatInfo}
            getChatRoomUUID={(uuid) => getUserChatMessages(id, type, uuid)}
          />

          <Stack
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            {renderHead}

            <Stack
              direction="row"
              sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              {renderMessages}
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};

export default UserChatView;
