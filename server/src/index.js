const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const twitchAPI = require('./lib/twitch-api');
const middleware = require('./middleware');
require('dotenv').config();
const config = require('./config');
require('./db');
const app = express();

twitchAPI.getStream('eviltoaster');

const bot = require('./bot');
bot.init();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(middleware.decodeAuthHeader);
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ hello: 'world!' });
});
app.use('/auth/twitch', require('./auth/twitch'));
app.use(
  '/api/channel',
  (req, res, next) => {
    if (!req.user) {
      next(new Error('Un-Authorized'));
    }
    next();
  },
  require('./api/channel'),
);

app.use((req, res, next) => {
  const error = new Error('Not Found - ' + req.originalUrl);
  res.status(404);
  next(error);
});

//eslint-disable-next-line
app.use((error, req, res, next) => {
  res.status(res.statusCode === 200 ? 500 : res.statusCode);
  res.json({
    message: error.message,
    stack: config.NODE_ENV === 'production' ? undefined : error.stack,
  });
});

const port = config.PORT;

const server = app.listen(port, () =>
  console.log('server listening http://localhost:' + server.address().port),
);
