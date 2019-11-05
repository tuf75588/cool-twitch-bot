const { Schema, model } = require('mongoose');

const GlobalCommandSchema = new Schema(
  {
    name: String,
    aliases: [String],
    replyText: String,
    requiredRole: String,
  },
  {
    versionKey: false,
  },
);

const globalCommandModel = model('globalCommand', GlobalCommandSchema);

module.exports = globalCommandModel;
