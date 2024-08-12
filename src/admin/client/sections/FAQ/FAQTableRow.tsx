import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from '../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import Iconify from '../../components/iconify';
import { ConfirmDialog } from '../../components/custom-dialog';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

type Props = {
  row: any;
  onRemove: any;
};

export function removeHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

export default function FAQTableRow({ row, onRemove }: Props) {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const collapse = useBoolean();

  const popover = usePopover();

  const { id, parentId, title_en, answer_en } = row;

  const renderPrimary = (
    <TableRow hover>
      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          #{id}
        </Box>
      </TableCell>

      <TableCell>{removeHtmlTags(title_en)}</TableCell>

      <TableCell style={{ maxWidth: '400px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {removeHtmlTags(answer_en)}
      </TableCell>

      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          #{parentId}
        </Box>
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
          <Stack component={Paper} sx={{ m: 1.5, p: 1.5 }}>
            <Typography variant="h5">{title_en}</Typography>

            <Typography dangerouslySetInnerHTML={{ __html: answer_en }} style={{ marginTop: '20px' }}></Typography>
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
            popover.onClose();
            navigate('/admin/faq/manage/' + id);
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
