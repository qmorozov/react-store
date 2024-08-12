import { createServer } from 'vite';

export const devServer = createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

export default devServer;
