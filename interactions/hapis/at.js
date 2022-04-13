const hasPermission = require("../../codebase/utils/hasPermission");
const jailMember = require("../../codebase/api/jailMember");
const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["hapis", "at"],
  description: "Üyeyi hapise atmanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    /** @type {import("discord.js").GuildMember} */
    let member = inter.options.getMember("üye");
    let reason = inter.options.getString("sebep") || "Sebep belirtilmemiş.";
    let durationMinutes = inter.options.getInteger("süre") || 1;

    if (!hasPermission(inter.member, Underline.other.jailHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    let id = await jailMember(member, inter.user.id, durationMinutes * 60000, reason);

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** adlı üye silivri açık ceza evine kapatıldı.\n**Sebep:** ${reason}\n**Süre:** ${durationMinutes} dakika.\n\`${id}\``)] });
  },
  options: [
    {
      name: "üye",
      description: "Atmak istediğininiz kişi.",
      type: "USER",
      required: true
    },
    {
      name: "süre",
      description: "Hapis süresi dakika cinsinden.",
      type: "INTEGER",
      required: true
    },
    {
      name: "sebep",
      description: "Hapise atma sebebiniz.",
      type: "STRING"
    }
  ]
})