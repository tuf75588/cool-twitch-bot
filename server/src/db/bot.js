const { Schema, model } = require('mongoose');

const BotSchema = new Schema({
  refresh_token: {
    type: String,
    required: true,
  },
});

const BotModel = model('bot', BotSchema);
module.exports = BotModel;
