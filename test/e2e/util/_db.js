/* CONNECT TO DB */
process.env.MONGODB_URI = 'mongodb://localhost:27017/authpoms-test';
require('../../../lib/connect');
const connection = require('mongoose').connection;

//export a small helper for dropping DB
module.exports = {
  drop() {
    return connection.dropDatabase();
  }
};