import { m } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { varHover } from '../../components/animate/variants';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { Avatar, Box, Divider, MenuItem, Stack, Typography } from '@mui/material';
import CurrentUser from '../../../../user/client/user.service.client';

const user = {
  photoURL: CurrentUser.image,
  dispalyName: CurrentUser.name,
  email: CurrentUser.email,
};

const OPTIONS = [
  {
    label: 'MainPage page',
    linkTo: '/',
  },
  {
    label: 'Feed',
    linkTo: '/feed',
  },
  {
    label: 'Orders',
    linkTo: '/cart/orders',
  },
  {
    label: 'Shop',
    linkTo: '/shop',
  },
  {
    label: 'Pricing',
    linkTo: '/pricing',
  },
  {
    label: 'Reviews',
    linkTo: '/reviews',
  },
  {
    label: 'Profile',
    linkTo: '/profile',
  },
  {
    label: 'Start Selling',
    linkTo: '/product/manage',
  },
];

export default function AccountPopover() {
  const popover = usePopover();

  const handleLogout = async () => {
    try {
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.photoURL}
          alt={user?.dispalyName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.dispalyName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.dispalyName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 1 }}>
          {OPTIONS.map(({ label, linkTo }) => (
            <MenuItem onClick={() => (window.location.href = linkTo)} key={label}>
              {label}
            </MenuItem>
          ))}
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }} onClick={() => handleLogout()}>
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
