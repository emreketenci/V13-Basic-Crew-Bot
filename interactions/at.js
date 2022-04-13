const Member = require("../codebase/models/Member");
const buildEmbed = require("../codebase/utils/buildEmbed");
const hasPermission = require("../codebase/utils/hasPermission");

module.exports = new Underline.SlashCommand({
  name: ["at"],
  description: "Üyeyi sunucudan atmanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    let user = inter.options.getUser("üye");
    let reason = inter.options.getString("sebep") || "Sebep belirtilmemiş.";

    if (!hasPermission(inter.member, Underline.other.kickHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    user = await Underline.client.users.fetch(user ?? "01").catch(() => { })
    if (!user) return inter.editReply("Üye bulunamadı!");

    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: user.id }, {}, { upsert: true, new: true }).exec();

    await inter.guild.members.kick(user, `${reason} | Atan: ${inter.user.tag} (${inter.user.id})`).catch(() => null);

    dbTargetMember.punishmentHistory.unshift({ at: Date.now(), by: inter.user.id, reason, type: "KICK" });
    await dbTargetMember.save();

    inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${user.tag}** sunucudan **${reason}** sebebi ile atıldı.`)] });
  },
  perms: {
    bot: ["KICK_MEMBERS"]
  },
  options: [
    {
      name: "üye",
      description: "Atmak istediğininiz kişi/id.",
      type: "USER",
      required: true
    },
    {
      name: "sebep",
      description: "Atma sebebiniz.",
      type: "STRING"
    }
  ]
})