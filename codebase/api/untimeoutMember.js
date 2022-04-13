/** @param {import("discord.js").GuildMember} member */
async function untimeoutMember(member) {
  
  if (!member.isCommunicationDisabled()) return false;

  await member.roles.remove(Underline.other.timeoutRoles);

  return true;
}

module.exports = untimeoutMember;