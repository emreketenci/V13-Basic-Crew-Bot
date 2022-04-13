const Member = require("../models/Member");

async function getDBMember(guildId, userId) {
  return await Member.findOneAndUpdate({ guildId, userId }, {}, { upsert: true, new: true }).exec()
}

module.exports = getDBMember;