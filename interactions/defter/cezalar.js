const buildEmbed = require("../../codebase/utils/buildEmbed");
const hasPermission = require("../../codebase/utils/hasPermission");
const chunkify = require("stuffs/lib/chunkify");
const { ButtonPaginator } = require("../../codebase/discord-page/dist");


module.exports = new Underline.SlashCommand({
  name: ["defter", "cezalar"],
  description: "",
  async onInteraction(inter, other) {
    await inter.deferReply();
    if (
      !(
        hasPermission(inter.member, Underline.other.jailHammer) ||
        hasPermission(inter.member, Underline.other.kickHammer) ||
        hasPermission(inter.member, Underline.other.banHammer)
      )
    ) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");
    const member = inter.options.getMember("üye");

    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: member.user.id }, {}, { upsert: true, new: true }).exec();
    if (!dbTargetMember.punishmentHistory.length) return inter.editReply({ embeds: [buildEmbed(null, "Üyenin geçmişi bulunamadı.", 0xff5370)] });

    let chunks = chunkify(dbTargetMember.punishmentHistory, 10);

    let embeds = chunks.map(i => {
      return {
        title: "Ceza Geçmişi",
        description: i.map(j => `<t:${Math.floor(j.at / 1000)}>** **<@${j.by}>:** ${j.reason} | ${j.type} | ${(j.duration / 60000).toFixed(1)} dakika`).join("\n"),
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
      description: "Cezalarına bakılacka üyeyi belirtin."
    }
  ]
})