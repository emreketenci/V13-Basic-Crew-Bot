const buildEmbed = require("../../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["yt", "rol", "ver"],
  description: "İstediğiniz kullanıcıya istediğiniz rolü verir.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    const member = inter.options.getMember("üye");
    const role = inter.options.getRole("rol");

    try {
      await member.roles.add(role);
      await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** adlı üyeye **${role.name}** rolü verildi.`)] });
    } catch {
      await inter.editReply({ embeds: [buildEmbed(null, `**${member.user.tag}** adlı üyeye **${role.name}** rolü verilemedi.`, 0xff5362)] });
    }
  },
  options: [
    {
      name: "üye",
      description: "Rol vermek istediğiniz kişi.",
      type: "USER",
      required: true
    },
    {
      name: "rol",
      description: "İstediğin rol.",
      type: "ROLE",
      required: true
    },
  ],
  coolDown: 1000,
  guildOnly: true,
  perms: {
    bot: ["MANAGE_ROLES"],
    user: ["ADMINISTRATOR"]
  },
});