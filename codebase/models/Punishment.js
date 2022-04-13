const { model, Schema } = require("mongoose");

module.exports = model("punishment", new Schema({
  guildId: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  duration: Number,
  type: String,
  reason: String,
  by: String,
  createdAt: {
    default: Date.now,
    type: Number
  },
  other: Object
}));

module.exports.PUNISHMENT_JAIL = "JAIL";
module.exports.PUNISHMENT_TIMEOUT = "TIMEOUT";