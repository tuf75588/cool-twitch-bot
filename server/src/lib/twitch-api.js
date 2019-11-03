const axios = require('axios');
const config = require('../config');
const helixBaseUrl = 'https://api.twitch.tv/helix';
const helix = axios.create({
	baseURL: helixBaseUrl,
});
const authBaseURL = 'https://id.twitch.tv/oauth2';
const authAPI = axios.create({
	baseURL: authBaseURL,
});
/**
 *
 * @typedef TwitchAPIUser
 * @prop {string} id The user ID
 */

/**
 *
 * @param {any} options
 * @param {string} options.token the OAuth token expected for user authentication with twitch
 * @return {TwitchAPIUser}
 */

async function getUser({ token } = {}) {
	const {
		data: { data },
	} = await helix.get('/users', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return data[0] || null;
}

async function getAccessToken(refresh_token) {
	const qs = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token,
		client_id: config.TWITCH_CLIENT_ID,
		client_secret: config.TWITCH_CLIENT_SECRET,
	});
	const { data } = await authAPI.post(`/token?${qs}`);
	return data;
}

/**
 *
 * @param {any} options
 * @param {string} id A list of IDs to look up
 * @param {string} options.token the OAuth token for the bot user.
 * @return {TwitchAPIUser[]}
 */
async function getUsers({ id = [], token }) {
	const qs = new URLSearchParams();
	for (const n of id) {
		qs.append('id', n);
	}
	const {
		data: { data },
	} = await helix.get(`/users?${qs}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return data;
}

module.exports = {
	getUser,
	getUsers,
	getAccessToken,
	authAPI,
};
