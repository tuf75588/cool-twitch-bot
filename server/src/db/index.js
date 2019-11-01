const mongoose = require('mongoose');
const config = require('../config');

require('./bot');

mongoose.connect(`mongodb://${config.MONGO_HOST}/`, {
  user: config.MONGO_USER,
  pass: config.MONGO_PASS,
  dbName: config.MONGO_DBNAME,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

const { connection: db } = mongoose;

db.on('connection', () => {
  console.log('database is connected!');
});

db.on('disconnected', () => {
  console.log('database is disconnected');
});

db.on('error', (err) => {
  console.error(err);
});

module.exports = db;

//
