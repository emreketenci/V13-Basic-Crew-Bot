const Punishment = require("../../../codebase/models/Punishment");

module.exports = new Underline.Event({
  eventName: "guildMemberAdd",
  async onEvent(member) { 
    let isInJail = (await Punishment.count({ guildId: member.guild.id, userId: member.id, type: Punishment.PUNISHMENT_JAIL }).limit(1).exec()) === 1;

    if (isInJail) {
      await member.roles.remove(member.roles.cache.map(i => i.id));
      await member.roles.add(Underline.other.jailRoles);
    }
  }
});