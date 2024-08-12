// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// theme
// hooks
// components
//
import HeaderShadow from './header-shadow';
import SettingsButton from './settings-button';
import { RouterLink } from '../../routes/components';
import { bgBlur } from '../../theme/css';
import { useOffSetTop } from '../../hooks/use-off-set-top';
import Logo from '../../components/logo';
import { HEADER } from '../config-layout';

// ----------------------------------------------------------------------

export default function HeaderSimple() {
  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Logo />

        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsButton />

          <Link href="/" component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
            Need help?
          </Link>
        </Stack>
      </Toolbar>

      {/*{offsetTop && GeneralFieldShadow />}*/}
    </AppBar>
  );
}
