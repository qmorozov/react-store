import { useRouter } from '../../routes/hooks/use-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Image from '../../components/image';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import Iconify from '../../components/iconify';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import { useBoolean } from '../../hooks/use-boolean';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BannerItem = ({ banner, onRemove }: any) => {
  const popover = usePopover();
  const confirm = useBoolean();
  const navigate = useNavigate();

  return (
    <>
      <Card>
        <Image alt={banner.image} src={banner.image} sx={{ borderRadius: 1, height: 164, width: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
          <Typography>{banner.name}</Typography>

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </div>
      </Card>
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="bottom-center" sx={{ width: 140 }}>
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
            navigate('/admin/banners/manage/' + banner.id);
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
          <Button variant="contained" color="error" onClick={() => onRemove(banner.id)}>
            Delete
          </Button>
        }
      />
    </>
  );
};

export default function BannersList({ banners, onRemove }: any) {
  const router = useRouter();

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {banners.map((banner) => (
          <BannerItem key={banner.id} banner={banner} onRemove={onRemove} />
        ))}
      </Box>

      {/*{tours.length > 8 && (*/}
      {/*  <Pagination*/}
      {/*    count={8}*/}
      {/*    sx={{*/}
      {/*      mt: 8,*/}
      {/*      [`& .${paginationClasses.ul}`]: {*/}
      {/*        justifyContent: 'center',*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
}
