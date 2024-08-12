import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { Routes } from './src/routes';
import { layoutAssets } from './src/layouts/layout.list';

const entries = Object.entries(Routes).reduce((previousValue, [page, route]) => {
  return [...previousValue, ...route.getClientEntries(page).map((entry) => `/${entry}`)];
}, []);

Object.values(layoutAssets).forEach((assets) =>
  Object.values(assets || {}).forEach((asset) =>
    (asset || []).forEach((entry) => {
      if (entry && typeof entry !== 'string' && !entry.local) {
        return;
      }
      return entry && entries.push(`/${entry}`);
    }),
  ),
);

export default defineConfig({
  root: 'src',
  plugins: [react()],
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: '../dist/client',
    assetsDir: 'ui',
    rollupOptions: {
      input: entries,
    },
  },
  resolve: {
    alias: {
      '@fonts': resolve(__dirname, 'assets', 'fonts'),
      '@style': resolve(__dirname, 'src', 'styles'),
    },
  },
});
