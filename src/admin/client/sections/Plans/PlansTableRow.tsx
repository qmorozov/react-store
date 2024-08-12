import { useBoolean } from '../../hooks/use-boolean';
import { useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Switch, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import { useState } from 'react';

const PlansTableRow = ({ row, onRemove, switchOnChange }: any) => {
  const confirm = useBoolean();
  const { id, title_en, description_en, type, price_month, price_year, max_products, currency, active } = row;
  const [switchValue, setSwitchValue] = useState<boolean>(active);

  const navigate = useNavigate();

  const popover = usePopover();

  const handleSwitchChange = (event) => {
    setSwitchValue(!switchValue);
    switchOnChange(id, event.target.checked);
  };

  const renderPrimary = (
    <TableRow hover>
      <TableCell>#{id}</TableCell>

      <TableCell>
        <Switch checked={switchValue} onChange={(event) => handleSwitchChange(event)} />
      </TableCell>

      <TableCell>
        <Typography style={{ textTransform: 'capitalize' }}>{title_en}</Typography>
      </TableCell>

      <TableCell
        title={description_en}
        dangerouslySetInnerHTML={{ __html: description_en }}
        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '150px' }}
      />

      <TableCell>{type === 1 ? 'Company' : 'User'}</TableCell>

      <TableCell style={{ textAlign: 'center' }}>
        {getCurrencySymbol(currency)}
        {price_month}
      </TableCell>

      <TableCell style={{ textAlign: 'center' }}>
        {getCurrencySymbol(currency)}
        {price_year}
      </TableCell>

      <TableCell style={{ textAlign: 'center' }}>x{max_products}</TableCell>

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
            navigate('/admin/plan/manage/' + id);
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

export default PlansTableRow;
