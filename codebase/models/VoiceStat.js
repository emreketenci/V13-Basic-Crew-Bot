const { model, Schema } = require("mongoose");

module.exports = model("voice_stat", new Schema({
  guildId: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  dailyMinutesByChannel: {
    default: {},
    type: Object
  },
  dailyTotalMinutes: {
    type: Number,
    default: 0
  },
  weeklyMinutesByChannel: {
    default: {},
    type: Object
  },
  weeklyTotalMinutes: {
    type: Number,
    default: 0
  },
  monthlyMinutesByChannel: {
    default: {},
    type: Object
  },
  monthlyTotalMinutes: {
    type: Number,
    default: 0
  },
}));