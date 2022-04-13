const hasPermission = require("../codebase/utils/hasPermission");
const buildEmbed = require("../codebase/utils/buildEmbed");
const timeoutMember = require("../codebase/api/timeoutMember");

module.exports = new Underline.SlashCommand({
  name: ["uzaklaştır"],
  description: "Belirlenen kişiyi uzaklaştırmayı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    /** @type {import("discord.js").GuildMember} */
    let member = inter.options.getMember("üye");
    let reason = inter.options.getString("sebep") || "Sebep belirtilmemiş.";
    let duration = inter.options.getInteger("süre");

    if (!hasPermission(inter.member, Underline.other.timeoutHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    let punishmentId = await timeoutMember(member, inter.user.id, duration * 60000, reason);

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** sunucuda **${duration} dakika**lığına etkisiz hale getirildi.\n**Sebep:** ${reason}\n\`${punishmentId}\``)] });
  },
  options: [
    {
      name: "üye",
      description: "Uzaklaştırmak istediğininiz kişi.",
      type: "USER",
      required: true
    },
    {
      name: "süre",
      description: "Uzaklaştırma süresi dakika cinsinden.",
      type: "INTEGER",
      required: true
    },
    {
      name: "sebep",
      description: "Uzaklaştırma sebebiniz.",
      type: "STRING"
    }
  ]
})