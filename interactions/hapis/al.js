const hasPermission = require("../../codebase/utils/hasPermission");
const jailMember = require("../../codebase/api/jailMember");
const unjailMember = require("../../codebase/api/unjailMember");
const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["hapis", "al"],
  description: "Üyeyi hapisten almanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    /** @type {import("discord.js").GuildMember} */
    let member = inter.options.getMember("üye");

    if (!hasPermission(inter.member, Underline.other.jailHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    let success = await unjailMember(member);

    if (!success) return inter.editReply({ embeds: [buildEmbed(null, "Bu üye zaten hapiste değil!", 0xff443f)] });

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** adlı üye silivri açık ceza evinden alındı.`)] });
  },
  options: [
    {
      name: "üye",
      description: "Almak istediğininiz kişi.",
      type: "USER",
      required: true
    },
  ]
})