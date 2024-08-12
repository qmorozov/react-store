import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from '../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import Iconify from '../../components/iconify';
import { ConfirmDialog } from '../../components/custom-dialog';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';

type Props = {
  row: any;
  onRemove: any;
};

export default function BrandsTableRow({ row, onRemove }: Props) {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const popover = usePopover();

  const { id, name, image, url, order, showOnMain } = row;

  const renderPrimary = (
    <TableRow hover>
      <TableCell>
        <Box
          sx={{
            textDecoration: 'underline',
          }}
        >
          #{id}
        </Box>
      </TableCell>

      <TableCell>
        <Typography style={{ textTransform: 'capitalize' }}>{name}</Typography>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={name} src={image} sx={{ mr: 2 }} />
      </TableCell>

      <TableCell>{order}</TableCell>

      <TableCell>{url}</TableCell>

      <TableCell>
        <Typography variant="h5" style={{ color: showOnMain ? 'green' : 'red' }}>
          {showOnMain ? '✓' : '×'}
        </Typography>
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
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            navigate('/admin/brands/manage/' + id);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => onRemove()}>
            Delete
          </Button>
        }
      />
    </>
  );
}
