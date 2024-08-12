import { useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import { Link, useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Switch, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import { removeHtmlTags } from '../FAQ/FAQTableRow';

const PageListRow = ({ row, onRemove, switchOnChange }: any) => {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const popover = usePopover();

  const { id, title_en, content_en, url, status, locked } = row;
  const [switchValue, setSwitchValue] = useState<boolean>(status);

  const handleSwitchChange = (event) => {
    setSwitchValue(!switchValue);
    switchOnChange(id, event.target.checked);
  };

  const renderPrimary = (
    <TableRow hover>
      <TableCell>#{id}</TableCell>

      <TableCell>
        <Typography style={{ textTransform: 'capitalize' }}>{title_en}</Typography>
      </TableCell>

      <TableCell style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '150px' }}>
        {removeHtmlTags(content_en)}
      </TableCell>

      <TableCell>
        <Link to={'/page/' + url} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Box
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: '#7188ff',
              },
            }}
          >
            /page/<b>{url}</b>
          </Box>
        </Link>
      </TableCell>

      <TableCell>
        <Switch checked={switchValue} disabled={locked} onChange={(event) => handleSwitchChange(event)} />
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
            navigate('/admin/page/manage/' + id);
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

export default PageListRow;
