import { useBoolean } from '../../hooks/use-boolean';
import { Link, useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';

const BlogCategoriesTableRow = ({ row, onRemove }: any) => {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const popover = usePopover();

  const { id, name_en, url } = row;

  const renderPrimary = (
    <TableRow hover>
      <TableCell>#{id}</TableCell>

      <TableCell>
        <Typography style={{ textTransform: 'capitalize' }}>{name_en}</Typography>
      </TableCell>

      <TableCell>
        <Link to={'/blog/' + url} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Box
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: '#7188ff',
              },
            }}
          >
            /blog/<b>{url}</b>
          </Box>
        </Link>
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
            navigate('/admin/blog/categories/manage/' + id);
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
};

export default BlogCategoriesTableRow;
