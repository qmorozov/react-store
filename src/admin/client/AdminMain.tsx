import React from 'react';
import { MotionLazy } from './components/animate/motion-lazy';
import ProgressBar from './components/progress-bar';
import CustomRouter from './routes/sections';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import { SettingsDrawer, SettingsProvider } from './components/settings';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AdminMain = () => {
  useScrollToTop();

  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light',
          themeDirection: 'ltr',
          themeContrast: 'default',
          themeLayout: 'vertical',
          themeColorPresets: 'default',
          themeStretch: false,
        }}
      >
        <MotionLazy>
          <SettingsDrawer />
          <ProgressBar />
          <CustomRouter />
        </MotionLazy>
      </SettingsProvider>
    </MuiLocalizationProvider>
  );
};

export default AdminMain;
