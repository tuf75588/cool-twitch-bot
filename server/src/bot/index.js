const tmi = require('tmi.js');
const config = require('../config');
const botModel = require('../db/bot');
const twitchAPI = require('../lib/twitch-api');
const channelModel = require('../db/channel');
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
		const botUser = twitchAPI.getUser({ token });
		//eslint-disable-next-line
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
		await client.connect();
	} catch (error) {
		console.error('Error connecting to Twitch...', error);
	}
	return client;
}

function getToken() {
	return client.getOptions().identity.password;
}

async function init() {
	try {
		await getClient();
		const dbChannels = await channelModel.findOne({ enabled: true });
		const id = dbChannels.map((c) => c.twitchId);
		await joinChannels(id);
	} catch (error) {
		console.error('error connecting to twitch...', error);
	}
}

async function joinChannels(id) {
	await getClient();
	const channels = await twitchAPI.getUsers({
		token: getToken(),
		id,
	});
	for (const channel of channels) {
		//wait at least 350ms between channel joins
		await Promise.all([client.join(channel.login), sleep(350)]);
	}
}

module.exports = {
	init,
};
