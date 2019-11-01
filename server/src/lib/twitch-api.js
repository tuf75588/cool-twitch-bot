const axios = require('axios');

const helix = 'https://api.twitch.tv/helix';
const helixAPI = axios.create({
  baseUrl: helix,
});

async function getUser(token) {
  const response = await helixAPI.get(`/users`, {
    Authorization: `Bearer ${token}`,
  });
}
