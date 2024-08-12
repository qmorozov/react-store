import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from '../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { fCurrency } from '../../utils/format-number';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import { ConfirmDialog } from '../../components/custom-dialog';
import { OrderStatus } from '../../../../cart/model/OrderStatus.enum';
import { useNavigate } from 'react-router-dom';
// hooks
// components

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const navigate = useNavigate();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box
          onClick={() => {
            onViewRow();
            navigate('/admin/orders/info/' + row.id);
          }}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          #{row.id}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={row.user.firstName} src={row.user.image} sx={{ mr: 2 }} />

        <ListItemText
          primary={row.user.firstName}
          secondary={'row.seller.email'}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row.createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(row.createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <Avatar alt={row.seller.name} src={row.seller.image} sx={{ mr: 2 }} />
        <ListItemText
          primary={row.seller.name}
          secondary={'row.seller.email'}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell align="center"> {row.totalProducts} </TableCell>

      <TableCell> {fCurrency(row.amount)} </TableCell>

      <TableCell>
        <Label variant="soft" color={'default'}>
          {OrderStatus[row.status]}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse in={collapse.value} timeout="auto" unmountOnExit sx={{ bgcolor: 'background.neutral' }}>
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {row.products.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  cursor: 'pointer',
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
                  borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => window.open(`/product/${item.$info.url}`, '_blank')}
              >
                <Avatar src={item.$info.images[0].medium} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

                <ListItemText
                  primary={item.$info.title}
                  secondary={item.$info.type}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <Box>x{item.quantity}</Box>

                <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price)}</Box>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

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
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
