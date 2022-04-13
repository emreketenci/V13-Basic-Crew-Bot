const Member = require("../models/Member");
const Punishment = require("../models/Punishment");
const getDBMember = require("./getDBMember");

/**
 * @param {import("discord.js").GuildMember} member 
 * @param {string} byId 
 * @param {number} duration 
 * @param {string} reason 
 * @returns {string|boolean}
 */
async function timeoutMember(member, byId, duration, reason) {

  // if (Date.now() < member.communicationDisabledUntilTimestamp) return false;

  await member.timeout(duration, reason);

  await member.roles.add(Underline.other.timeoutRoles);

  const dbTargetMember = await getDBMember(member.guild.id, member.id);
  dbTargetMember.punishmentHistory.unshift({ at: Date.now(), by: byId, reason, type: Punishment.PUNISHMENT_TIMEOUT, duration });
  await dbTargetMember.save();

  return `${p._id}`;
}

module.exports = timeoutMember;