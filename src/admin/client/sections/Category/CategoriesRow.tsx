import { useBoolean } from '../../hooks/use-boolean';
import { Link, useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const CategoriesRow = ({ row, onRemove }: any) => {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const popover = usePopover();

  const { id, image, name_en, order, productType, url } = row;

  const renderPrimary = (
    <TableRow hover>
      <TableCell>#{id}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={name_en} src={image} sx={{ mr: 2 }} />
      </TableCell>

      <TableCell>
        <Typography style={{ textTransform: 'capitalize' }}>{name_en}</Typography>
      </TableCell>

      <TableCell>{order}</TableCell>

      <TableCell>{productType}</TableCell>

      <TableCell>
        <Link to={'/catalog/' + url} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Box
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: '#7188ff',
              },
            }}
          >
            /catalog/<b>{url}</b>
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
        {/*<MenuItem*/}
        {/*  onClick={() => {*/}
        {/*    confirm.onTrue();*/}
        {/*    popover.onClose();*/}
        {/*  }}*/}
        {/*  sx={{ color: 'error.main' }}*/}
        {/*>*/}
        {/*  <Iconify icon="solar:trash-bin-trash-bold" />*/}
        {/*  Delete*/}
        {/*</MenuItem>*/}

        <MenuItem
          onClick={() => {
            popover.onClose();
            navigate('/admin/category/manage/' + id);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      {/*<ConfirmDialog*/}
      {/*  open={confirm.value}*/}
      {/*  onClose={confirm.onFalse}*/}
      {/*  title="Delete"*/}
      {/*  content="Are you sure want to delete?"*/}
      {/*  action={*/}
      {/*    <Button variant="contained" color="error" onClick={() => onRemove()}>*/}
      {/*      Delete*/}
      {/*    </Button>*/}
      {/*  }*/}
      {/*/>*/}
    </>
  );
};

export default CategoriesRow;
