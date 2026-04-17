const express = require('express');

const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
const gacha = require('./components/gacha/gacha-route');

module.exports = () => {
  const router = express.Router();

  books(router);
  users(router);
  gacha(router);

  return router;
};
