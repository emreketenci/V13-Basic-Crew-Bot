const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["yt", "taglı-alım"],
  description: "Taglı alım modunu açıp kapamanızı sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    const durum = !!inter.options.getInteger("durum");

    other.dbGuild.tagOnlyRegisterMode = durum;
    await other.dbGuild.save();

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `Taglı alım **${durum ? "açıldı" : "kapatıldı"}**!`)] });
  },
  options: [
    {
      name: "durum",
      description: "Taglı alım durumu.",
      type: "INTEGER",
      required: true,
      choices: [
        {
          name: "Açık",
          value: 1
        },
        {
          name: "Kapalı",
          value: 0
        }
      ]
    },
  ],
  coolDown: 1000,
  guildOnly: true,
  perms: {
    bot: ["MANAGE_ROLES"],
    user: ["ADMINISTRATOR"]
  },
});