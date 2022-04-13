const Member = require("../models/Member");
const getDBMember = require("./getDBMember");
/**
 * @param {import("discord.js").GuildMember} member 
 * @param {string} reason 
 */
async function afkMember(member, reason) {

  if (!(member.nickname || member.user.username).includes("[AFK]")) member.setNickname(`[AFK] ${(member.nickname || member.user.username)}`);

  const dbTargetMember = await getDBMember(member.guild.id, member.id);
  dbTargetMember.other.afk = reason;
  dbTargetMember.markModified("other");
  await dbTargetMember.save();

  return `${p._id}`;
}

module.exports = afkMember;