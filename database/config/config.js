const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const env =
  ((args) => {
    const search = '--env=';
    const env = args.find((arg) => arg.startsWith(search));
    return env ? env.substring(search.length) : undefined;
  })(process.argv) ||
  process.env.NODE_ENV ||
  'development';

const configuration = {
  dialect: process.env.DB_MAIN_TYPE,
  username: process.env.DB_MAIN_USERNAME,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  host: process.env.DB_MAIN_HOST,
  port: process.env.DB_MAIN_PORT,
  migrationStorageTableName: 'migrations',
};

console.warn(env, ':', configuration);

module.exports = configuration;
