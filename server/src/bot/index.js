const tmi = require('tmi.js');
const config = require('../config');
const botModel = require('../db/bot');
const twitchAPI = require('../lib/twitch-api');
const channelModel = require('../db/channel');
const commandModel = require('../db/command');
const globalCommandModel = require('../db/globalCommand');
const { sleep } = require('../lib/utils');
/** @type {import('tmi.js').Client} */

let client;

async function getClient(token) {
  if (client) {
    return client;
  }

  try {
    const bot = await botModel.findOne({});

    if (!token) {
      ({ access_token: token } = await twitchAPI.getAccessToken(
        bot.refresh_token,
      ));
    }
    const botUser = await twitchAPI.getUser({ token });

    // eslint-disable-next-line
    client = new tmi.Client({
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

    client.on('message', messageHandler);

    await client.connect();
  } catch (error) {
    console.error('Error connecting to twitch...', error);
  }

  return client;
}

function getToken() {
  return client.getOptions().identity.password;
}

async function init() {
  try {
    await getClient();
    const dbChannels = await channelModel.find({ enabled: true });
    const id = dbChannels.map((c) => c.twitchId);
    await joinChannels(id);
  } catch (error) {
    console.error('Error connecting to twitch...', error);
  }
}

async function partChannels(id) {
  await getClient();
  const channels = await twitchAPI.getUsers({
    token: getToken(),
    id,
  });
  for (const channel of channels) {
    await Promise.all([client.part(channel.login), sleep(350)]);
  }
}

async function joinChannels(id) {
  await getClient();
  const channels = await twitchAPI.getUsers({
    token: getToken(),
    id,
  });
  for (const channel of channels) {
    await Promise.all([client.join(channel.login), sleep(350)]);
  }
}

/**
 *
 * @param {string} channel
 * @param {import('tmi.js').ChatUserstate} tags
 * @param {string} message
 * @param {boolean} self
 */
async function messageHandler(channel, tags, message, self) {
  //ignore whispers or messages from ourself.
  if (message.self || tags['message-type'] === 'whisper') return;
  //make sure its a command starting with the appropriate prefix
  if (message.startsWith('!')) {
    const arguments = message.slice(1).split(' ');
    const command = arguments.shift().toLowerCase();
    const channelId = tags['room-id'];
    commandHandler(tags['room-id'], command);
  }
}

/**
 *
 * @param {string} command the command that is executed from the user
 * @param {string} channel the id of the channel the command is being created for
 */
async function commandHandler(context) {
  const { reply, commandName, channelId } = context;
  const [globalCommand, channelCommand] = await Promise.all([
    commandModel.findOne({ name: commandName, channelId }),
    globalCommandModel.findOne({ name: commandName }),
  ]);
  const command = globalCommand || channelCommand;
  //if there's no command, return
  if (!command) {
    return;
  }
  if (command.replyText) {
    return reply(command.replyText);
  } else {
    //if we get here it must be a global command
    const commandFn = require(`./commands/${command.name}`);
    commandFn(context);
  }
}

module.exports = {
  init,
  joinChannels,
  partChannels,
};
