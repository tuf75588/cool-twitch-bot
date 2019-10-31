const axios = require('axios');
const express = require('express');
const router = express.Router();
const config = require('../config');
const redirect_uri = `${config.TWITCH_CLIENT_REDIR_HOST}/auth/twitch/callback`;
const authAPI = axios.create({
  baseURL: 'https://id.twitch.tv/oauth2',
});

router.get('/', async (req, res) => {
  const qs = new URLSearchParams({
    client_id: config.TWITCH_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope: 'user:edit',
    forceVerify: true,
  });

  const redirectUrl = await `${authAPI.defaults.baseURL}/authorize?${qs}`;
  res.redirect(redirectUrl);
});

router.get('/callback', (req, res) => {
  console.log(req.query);
  res.json({ hello: 'callback!' });
});

module.exports = router;
