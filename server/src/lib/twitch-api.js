const axios = require('axios');

const helixBaseUrl = 'https://api.twitch.tv/helix';
const helix = axios.create({
  baseURL: helixBaseUrl,
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

async function getUsers({ token } = {}) {
  const {
    data: { data },
  } = await helix.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data[0] || null;
}

module.exports = {
  getUsers,
};
