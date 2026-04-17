const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('../core/config');
const logger = require('../core/logger')('app');

let mongoUri;
const baseConnection = config.database.connection;
const dbName = config.database.name;

if (dbName) {
  const url = new URL(baseConnection);

  const cleanDbName = dbName.startsWith('/') ? dbName : `/${dbName}`;

  url.pathname = cleanDbName;

  mongoUri = url.toString();
} else {
  mongoUri = baseConnection;
}

mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const dbExports = { db };

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(mongoose);
    dbExports[model.modelName] = model;
  });

module.exports = dbExports;
