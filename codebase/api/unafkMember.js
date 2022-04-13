const Member = require("../models/Member");
const getDBMember = require("./getDBMember");
/**
 * @param {import("discord.js").GuildMember} member 
 */
async function unafkMember(member) {

  if ((member.nickname || member.user.username).includes("[AFK]")) member.setNickname((member.nickname || member.user.username).replace("[AFK]", "").trim());

  const dbTargetMember = await getDBMember(member.guild.id, member.id);
  delete dbTargetMember.other.afk;
  dbTargetMember.markModified("other");
  await dbTargetMember.save();

  return `${p._id}`;
}

module.exports = unafkMember;