const hasPermission = require("../codebase/utils/hasPermission");

module.exports = new Underline.SlashCommand({
  name: ["kayıtsız"],
  description: "Üyeyi kayıtsıza atmanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    if (!hasPermission(inter.member, Underline.other.registerHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");
    
    const member = inter.options.getMember("üye");

    await member.setNickname(null);
    await member.roles.remove([...Underline.other.maleRoles, ...Underline.other.femaleRoles]);
    
    await inter.editReply(`${member} kayıtsıza atıldı!`);
  },
  options: [
    {
      name: "üye",
      description: "Kayıtsıza atılacak üye.",
      type: "USER",
      required: true
    },
  ],
  coolDown: 1000,
  guildOnly: true,
  perms: {
    bot: ["MANAGE_ROLES"],
  },
});