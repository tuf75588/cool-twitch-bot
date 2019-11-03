require('dotenv').config();

/**
 * @typedef EnvironmentConfiguration
 * @prop {string} PORT the port to listen on
 * @prop {string} TWITCH_CLIENT_ID Client ID for the twitch app.
 * @prop {string} TWITCH_CLIENT_SECRET Client OAuth Secret for the twitch app.
 * @prop {string} TWITCH_CLIENT_REDIR_HOST client redirect URL
 * @prop {string} MONGO_HOST Host URL of our mongo instance
 * @prop {string} MONGO_PASS MongoDB Password
 * @prop {string} MONGO_USER MongoDB username
 * @prop {string} MONGO_DBNAME MongoDB database name
 * @prop {string} JWT_SECRET JWT for verifying channelId
 */

/**
 * @type {EnvironmentConfiguration}
 */

const config = {
	...process.env,
};

module.exports = config;
