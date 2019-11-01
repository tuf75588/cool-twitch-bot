const axios = require('axios');
const express = require('express');
const router = express.Router();
const config = require('../config');
const botModel = require('../db/bot');
const redirect_uri = `${config.TWITCH_CLIENT_REDIR_HOST}/auth/twitch/callback`;
const authAPI = axios.create({
  baseURL: 'https://id.twitch.tv/oauth2',
});

router.get('/', async (req, res) => {
  const qs = new URLSearchParams({
    client_id: config.TWITCH_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope: 'moderation:read',
    force_verify: true,
  });

  const redirectUrl = await `${authAPI.defaults.baseURL}/authorize?${qs}`;
  res.redirect(redirectUrl);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  const qs = new URLSearchParams({
    client_id: config.TWITCH_CLIENT_ID,
    client_secret: config.TWITCH_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri,
  });
  const options = {
    upsert: true,
  };

  try {
    const response = await authAPI.post(`/token?${qs}`);
    // const bot = await botModel.findOneAndUpdate(
    //   { name: 'atdbot' },
    //   { name: 'atdbot' },
    //   options,
    // );
    // bot.refresh_token = response.data.refresh_token;
    // await bot.save();
    res.json({
      message: Object.keys(response.data),
    });
  } catch (error) {
    res.json({
      error: error.message,
      body: error.response.message,
    });
  }
});

module.exports = router;

//
