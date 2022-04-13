const buildEmbed = require("../../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["yt", "rol", "al"],
  description: "İstediğiniz kullanıcıya istediğiniz rolü verir.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    const member = inter.options.getMember("üye");
    const role = inter.options.getString("rol");

    try {
      await member.roles.remove(role);
      await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** adlı üyeden istenilen rol alındı.`)] });
    } catch {
      await inter.editReply({ embeds: [buildEmbed(null, `**${member.user.tag}** adlı üyeden istenilen rol alınamadı.`, 0xff5362)] });
    }
  },
  options: [
    {
      name: "üye",
      description: "Rol almak istediğiniz kişi.",
      type: "USER",
      required: true
    },
    {
      name: "rol",
      description: "İstediğin rol.",
      type: "STRING",
      autocomplete: true,
      async onComplete(inter, value) {
        let memberId = inter.options.data?.[0]?.options?.[0]?.options?.[0]?.value;
        /** @type {import("discord.js").GuildMember} */
        let member = memberId ? await inter.guild.members.fetch(memberId ?? "01") : null;
        if (!member) return [];
        return member.roles.cache.filter(i=>i.id != i.guild.id).filter(i => i.name.toLowerCase().includes(value.toLowerCase()) || i.id == value).map(i => ({ value: i.id, name: i.name.slice(0, 99) })).slice(0, 20);
      },
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