import React from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import Box from '@mui/material/Box';

interface IUserChatsTableRow {
  chat: {
    uuid: string;
    type: string;
    userId: string | number;
    name: string;
    image: string;
    isOnline: boolean;
    lastMessage: string;
  };
}

const UserChatsTableRow = ({ chat }: IUserChatsTableRow) => {
  const navigate = useNavigate();

  const confirm = useBoolean();

  const popover = usePopover();

  const { uuid, userId, name, image, isOnline, lastMessage, type } = chat;

  const renderPrimary = (
    <TableRow hover>
      <TableCell>
        <Box
          onClick={() => navigate('/admin/users/chat/' + userId + '/' + type + '/' + uuid)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          #{userId}
        </Box>
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={name} src={image} sx={{ mr: 2 }} />

        <ListItemText
          primary={name}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>{isOnline ? 'Online' : 'Offline'}</TableCell>

      <TableCell>{lastMessage}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            navigate('/admin/users/chat/' + userId + '/' + type + '/' + uuid);
          }}
        >
          Chats
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
};

export default UserChatsTableRow;
