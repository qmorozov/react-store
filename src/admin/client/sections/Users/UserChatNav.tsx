import React, { useCallback, useEffect } from 'react';
import { useResponsive } from '../../hooks/user-responsive';
import { Drawer, IconButton, Stack } from '@mui/material';
import useCollapseNav from './use-collapse-nav';
import Iconify from '../../components/iconify';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { useTheme } from '@mui/material/styles';
import Scrollbar from '../../components/scrollbar';
import ChatNavItem from './chat-nav-item';
import Typography from '@mui/material/Typography';

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

const UserChatNav = ({ chatItemsData, getChatRoomUUID, selectedChatUUID, setChatInfo }: any) => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { collapseDesktop, onCloseDesktop, onCollapseDesktop, openMobile, onOpenMobile, onCloseMobile } =
    useCollapseNav();

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const renderToggleBtn = (
    <IconButton
      onClick={onOpenMobile}
      sx={{
        left: 0,
        top: 84,
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        borderRadius: `0 12px 12px 0`,
        bgcolor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText,
        '&:hover': {
          bgcolor: (theme) => theme.palette.primary.darker,
        },
      }}
    >
      <Iconify width={16} icon="solar:users-group-rounded-bold" />
    </IconButton>
  );

  const renderSkeleton = (
    <>
      {[...Array(5)].map((_, index) => (
        <ChatNavItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = chatItemsData.map((chat) => (
    <ChatNavItem
      key={chat.addressee.id}
      selected={chat.addressee.uuid === selectedChatUUID}
      getChatUuid={(uuid) => {
        if (chat.addressee.uuid !== selectedChatUUID) {
          getChatRoomUUID(uuid);
        }
      }}
      collapse={collapseDesktop}
      onCloseMobile={null}
      navItem={{
        addressee: {
          name: chat.addressee.name,
          image: chat.addressee.image,
          isOnline: chat.addressee.isOnline,
          id: chat.addressee.id,
        },
        lastMessage: {
          message: chat.lastMessage.message,
          createdAt: chat.lastMessage.createdAt,
        },
        uuid: chat.uuid,
      }}
    />
  ));

  const renderContent = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2.5, pb: 0, justifyContent: 'space-beetwen', paddingBottom: '20px' }}
      >
        {!collapseDesktop && (
          <Typography variant="h6" style={{ marginRight: 'auto', whiteSpace: 'nowrap' }}>
            Chats list
          </Typography>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} />
        </IconButton>
      </Stack>

      <Scrollbar sx={{ pb: 1 }} style={{ overflowX: 'hidden' }}>
        {chatItemsData.length ? renderList : renderSkeleton}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!mdUp && renderToggleBtn}

      {mdUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: NAV_WIDTH,
            borderRight: `solid 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
};

export default UserChatNav;
