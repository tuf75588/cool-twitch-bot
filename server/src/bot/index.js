const tmi = require('tmi.js');
const config = require('../config');
const botModel = require('../db/bot');
const twitchAPI = require('../lib/twitch-api');
async function init() {
  const bot = await botModel.findOne({});
  const { access_token: token } = await twitchAPI.getAccessToken(
    bot.refresh_token,
  );
  const botUser = await twitchAPI.getUsers({ token });
  console.log({ botUser, token });
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: botUser.login,
      password: token,
    },
    options: { debug: true },
  });
  await client.connect();
}

module.exports = {
  init,
};
