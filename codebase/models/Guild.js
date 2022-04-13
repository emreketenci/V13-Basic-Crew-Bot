const { model, Schema } = require("mongoose");

module.exports = model("guild", new Schema({
  guildId: {
    type: String,
    unique: true,
    index: true
  },
  tagOnlyRegisterMode: {
    type: Boolean,
    default: false,
  }
}))