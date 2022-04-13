const Punishment = require("../models/Punishment");

/** @param {import("discord.js").GuildMember} member */
async function unjailMember(member) {
  let lastJail = (await Punishment.aggregate([
    {
      $match: {
        type: Punishment.PUNISHMENT_JAIL,
        userId: member.user.id,
        guildId: member.guild.id
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $limit: 1
    }
  ]).exec())?.[0];
  if (!lastJail) return false;
  await Punishment.deleteMany({
    type: Punishment.PUNISHMENT_JAIL,
    userId: member.user.id,
    guildId: member.guild.id
  });

  await member.roles.remove(Underline.other.jailRoles);
  await member.roles.add(member.guild.roles.cache.filter(i => lastJail.other.originalRoles.includes(i.id)).map(i => i.id));

  return true;
}

module.exports = unjailMember;