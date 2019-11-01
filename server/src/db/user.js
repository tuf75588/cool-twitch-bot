const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  twitchId: {
    type: String,
    unique: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
});

const userModel = model('user', UserSchema);

module.exports = userModel;
