const express = require('express');
const router = express.Router();
const channelModel = require('../db/channel');
const commandModel = require('../db/command');
const { partChannels, joinChannels } = require('../bot');

//basic middleware function for validating user
const ensureUserAccess = (req, res, next) => {
  const { twitchId } = req.params;
  // TODO: check manager collection too, instead of just id
  if (twitchId !== req.user.twitchId) {
    const error = new Error('Not Allowed!');
    return next(error);
  }
  next();
};

router.patch('/:twitchId', ensureUserAccess, async (req, res, next) => {
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

//list all the commands
router.get('/:twitchId/commands', ensureUserAccess, async (req, res, next) => {
  const { twitchId } = req.params;
  try {
    const commands = await commandModel.find({ channelId: twitchId });
    res.json(commands);
  } catch (error) {
    return next(error);
  }
});

router.post('/:twitchId/commands', ensureUserAccess, async (req, res, next) => {
  const { twitchId } = req.params;
  const { name, aliases, replyText, requiredRole } = req.body;
  try {
    // TODO: sanitize command...
    // TODO: myString.replace(/[^\w\s!]/g,'');
    // TODO: check if mustaches, if so, validate all variables to be valid
    const existingCommand = await commandModel.findOne({
      channelId: twitchId,
      name,
    });
    if (existingCommand) {
      throw new Error('Command already exists');
    }
    const command = await commandModel.create({
      channelId: twitchId,
      name,
      aliases,
      replyText,
      requiredRole,
    });
    res.json(command);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:twitchId/commands/:commandId',
  ensureUserAccess,
  async (req, res, next) => {
    const { twitchId, commandId } = req.params;
    const { name, aliases, replyText, requiredRole } = req.body;

    try {
      //use findOneAndUpdate so a user can't update someone elses command
      const updated = await commandModel.findOneAndUpdate(
        {
          _id: commandId,
          channelId: twitchId,
        },
        Object.fromEntries(
          Object.entries({ name, aliases, requiredRole, replyText }),
        ).filter((name) => name[1] !== undefined),
        { new: true },
      );
      if (!updated) {
        return next();
      }
      res.json(updated);
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;
