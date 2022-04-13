const Member = require("../codebase/models/Member");
const buildEmbed = require("../codebase/utils/buildEmbed");
const hasPermission = require("../codebase/utils/hasPermission");

module.exports = new Underline.SlashCommand({
  name: ["yasakla"],
  description: "Üyeyi sunucudan yasaklamanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    let user = inter.options.getUser("üye");
    let reason = inter.options.getString("sebep") || "Sebep belirtilmemiş.";

    if (!hasPermission(inter.member, Underline.other.banHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    user = await Underline.client.users.fetch(user ?? "01").catch(()=>{})
    if (!user) return inter.editReply("Üye bulunamadı!");

    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: user.id }, {}, { upsert: true, new: true }).exec();

    await inter.guild.bans.create(user, { reason: `${reason} | Yasaklayan: ${inter.user.tag} (${inter.user.id})` }).catch(() => null);

    dbTargetMember.punishmentHistory.unshift({ at: Date.now(), by: inter.user.id, reason, type: "BAN" });
    await dbTargetMember.save();

    inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${user.tag}** sunucudan **${reason}** sebebi ile yasaklandı.`)] });
  },
  perms: {
    bot: ["BAN_MEMBERS"]
  },
  options: [
    {
      name: "üye",
      description: "Yasaklamak istediğininiz kişi/id.",
      type: "USER",
      required: true
    },
    {
      name: "sebep",
      description: "Yasaklama sebebiniz.",
      type: "STRING"
    }
  ]
})