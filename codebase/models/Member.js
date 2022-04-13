const { model, Schema } = require("mongoose");

module.exports = model("member", new Schema({
  guildId: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  infoHistory: {
    default: [],
    type: [Object]
  },
  punishmentHistory: {
    default: [],
    type: [Object]
  },
  registerHistory: {
    default: [],
    type: [Object]
  },
  other: {
    default: {},
    type: Object
  }
}))