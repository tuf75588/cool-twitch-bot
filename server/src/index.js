const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const config = require('./config');
require('./db');
const app = express();
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({ hello: 'world!' });
});
app.use('/auth/twitch', require('./auth/twitch'));

const port = config.PORT;

const server = app.listen(port, () =>
  console.log('server listening http://localhost:' + server.address().port),
);
