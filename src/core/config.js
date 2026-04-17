require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',

  api: {
    prefix: '/api',
  },

  database: {
    connection: process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017',
    name: process.env.DB_NAME || 'gacha_db',
  },
};
