const express = require('express');
const router = express.Router();
const channelModel = require('../db/channel');
const { partChannels, joinChannels } = require('../bot');
router.patch('/:twitchId', async (req, res, next) => {
  const { twitchId } = req.params;
  const { enabled } = req.body;
  if (enabled === undefined || typeof enabled !== 'boolean') {
    return next(new Error('Enabled must be a boolean.'));
  }
  try {
    const channel = await channelModel.findOneAndUpdate(
      { twitchId },
      { enabled },
      { new: true },
    );
    if (!channel) {
      return next();
    }
    if (enabled) {
      await joinChannels([twitchId]);
    } else {
      await partChannels([twitchId]);
    }
    return res.json(channel);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
