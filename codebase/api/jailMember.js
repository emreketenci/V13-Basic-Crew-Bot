const Member = require("../models/Member");
const Punishment = require("../models/Punishment");
const getDBMember = require("./getDBMember");

async function jailMember(member, byId, duration, reason) {

  let p = await Punishment.create({
    guildId: member.guild.id,
    userId: member.id,
    duration,
    type: Punishment.PUNISHMENT_JAIL,
    reason,
    by: byId,
    other: {
      originalRoles: member.roles.cache.map(i => i.id)
    }
  });

  await member.roles.remove(member.roles.cache.map(i => i.id));
  await member.roles.add(Underline.other.jailRoles);

  const dbTargetMember = await getDBMember(member.guild.id, member.id);
  dbTargetMember.punishmentHistory.unshift({ at: Date.now(), by: byId, reason, type: Punishment.PUNISHMENT_JAIL, duration });
  await dbTargetMember.save();

  return `${p._id}`;
}

module.exports = jailMember;