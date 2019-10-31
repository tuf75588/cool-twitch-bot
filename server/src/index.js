const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();
const config = require('./config');
const app = express();

app.get('/', (req, res) => {
  res.json({ hello: 'world!' });
});
app.use('/auth/twitch', require('./auth/twitch'));

const port = config.PORT;

const server = app.listen(port, () =>
  console.log('server listening http://localhost:' + server.address().port),
);
