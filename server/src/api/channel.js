const express = require('express');
const router = express.Router();
const channelModel = require('../db/channel');
router.patch('/:twitchId', async (req, res, next) => {
  //this endpoint will be for updating a channel with a given id
  const { twitchId } = req.params;
  const { enabled } = req.body;
  //Todo: check manager collection too, instead of just id

  if (enabled === undefined || typeof enabled !== 'boolean') {
    return next(new Error('Enabled must be of type: boolean'));
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
    res.json(channel);
  } catch (error) {
    return next(error);
  }
  if (twitchId !== req.user.twitchId) {
    const error = new Error('now allowed!');
    return next(error);
  }
});

module.exports = router;
