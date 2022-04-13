const buildEmbed = require("../../codebase/utils/buildEmbed");
const hasPermission = require("../../codebase/utils/hasPermission");
const chunkify = require("stuffs/lib/chunkify");
const { ButtonPaginator } = require("../../codebase/discord-page/dist");

const genders = {
  male: "Erkek",
  female: "Kız"
}

module.exports = new Underline.SlashCommand({
  name: ["defter", "kayıt-geçmişi"],
  description: "İstenilen üyenin kayıt geçmişine bakmayı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    if (!hasPermission(inter.member, Underline.other.registerHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");
    const member = inter.options.getMember("üye");

    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: member.user.id }, {}, { upsert: true, new: true }).exec();
    if (!dbTargetMember.infoHistory.length) return inter.editReply({ embeds: [buildEmbed(null, "Üyenin geçmişi bulunamadı.", 0xff5370)] });
    

    let chunks = chunkify(dbTargetMember.infoHistory, 10);

    let embeds = chunks.map(i => {
      return {
        title: "Kayıt Geçmişi",
        description: i.map(j => `<t:${Math.floor(j.at / 1000)}>** **<@${j.by}>:** ${j.name} | ${j.age} | ${genders[j.gender]}`).join("\n"),
        color: 0xe3e889
      }
    })

    try {
      let paginator = new ButtonPaginator({
        pages: embeds,
        userIds: [inter.user.id, ...Underline.config.developers],
        pageCount: `{current}/{total}`,
        time: 60000 * 15
      });
      let message = await inter.editReply(paginator.getMessageArgs())
      paginator.awaitInteraction(message);
    } catch (err) {
      console.error(err);
      inter.editReply(`Birşeyler yanlış gitti! ${err}`);
    }
  },
  options: [
    {
      type: "USER",
      required: true,
      name: "üye",
      description: "Geçmişine bakılacka üyeyi belirtin."
    }
  ]
})