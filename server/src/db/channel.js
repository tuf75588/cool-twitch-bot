const { Schema, model } = require('mongoose');

const ChannelSchema = new Schema({
  twitchId: {
    type: String,
    unique: true,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
});

const channelModel = model('channel', ChannelSchema);

module.exports = channelModel;
