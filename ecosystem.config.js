module.exports = {
  apps: [
    {
      name: process?.env?.pm2name || 'qmorozov',
      script: './dist/server/main.js',
      instances: process?.env?.pm2instances || '1',
      cwd: __dirname,
    },
  ],
};
