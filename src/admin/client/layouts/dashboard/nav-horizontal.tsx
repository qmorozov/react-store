import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

//
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import HeaderShadow from '../_common/header-shadow';
import { bgBlur } from '../../theme/css';
import { NavSectionHorizontal } from '../../components/nav-section';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={navData}
          config={{
            currentRole: 'admin',
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
