import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { fDateTime } from '../../utils/format-time';
import { OrderStatus } from '../../../../cart/model/OrderStatus.enum';
import { useNavigate } from 'react-router-dom';

interface IOrderDetailsToolbar {
  toolbarDetails: {
    id: number;
    status: number;
    createdAt: string;
  };
}

export default function OrderDetailsToolbar({ toolbarDetails }: IOrderDetailsToolbar) {
  const navigate = useNavigate();

  const popover = usePopover();

  const { id, status, createdAt } = toolbarDetails;

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={'/admin/orders'}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order #{id} </Typography>
              <Label variant="soft" color={'default'}>
                {OrderStatus[status]}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack flexGrow={1} spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {OrderStatus[status]}
          </Button>

          {/*<Button color="inherit" variant="outlined" startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}>*/}
          {/*  Print*/}
          {/*</Button>*/}

          {/*<Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>*/}
          {/*  Edit*/}
          {/*</Button>*/}
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right" sx={{ width: 140 }}>
        {Object.keys(OrderStatus)
          .filter((key) => isNaN(Number(OrderStatus[key])))
          .map((key) => (
            <MenuItem
              key={OrderStatus[key]}
              onClick={() => {
                popover.onClose();
                console.log(OrderStatus[key]);
              }}
            >
              {OrderStatus[key]}
            </MenuItem>
          ))}
      </CustomPopover>
    </>
  );
}
