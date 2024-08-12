import { useBoolean } from '../../hooks/use-boolean';
import { useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '../../components/iconify';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { UserRole } from '../../../../user/models/UserRole';
import { Select } from '@mui/material';
import IconButton from '@mui/material/IconButton';

interface IUserTableRow {
  user: any;
  selectOnChange: any;
  selectValue: any;
}

const UserTableRow = ({ user, selectValue, selectOnChange }: IUserTableRow) => {
  const navigate = useNavigate();

  const { firstName, lastName, image, email, isOnline, id, type } = user;

  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={firstName} src={image} sx={{ mr: 2 }} />

        <ListItemText
          primary={firstName}
          secondary={lastName}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>{email}</TableCell>

      <TableCell>{isOnline ? 'Online' : 'Offline'}</TableCell>

      <TableCell>
        <Select style={{ width: '100%' }} value={selectValue} onChange={(event) => selectOnChange(event)}>
          <MenuItem value={0}>User</MenuItem>
          {Object.keys(UserRole)
            .filter((key) => isNaN(Number(key)))
            .map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
        </Select>
      </TableCell>

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
            navigate('/admin/users/chats/' + id + '/' + type);
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

export default UserTableRow;
