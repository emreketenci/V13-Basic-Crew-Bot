const VoiceStat = require("../../codebase/models/VoiceStat");
const buildEmbed = require("../../codebase/utils/buildEmbed");

const typeToName = {
  "daily": "Bu gün",
  "weekly": "Bu hafta",
  "monthly": "Bu ay"
}

module.exports = new Underline.SlashCommand({
  name: ["ses", "top"],
  description: "Ses kanallarına geçirdiğiniz süreleri gösterir.",
  async onInteraction(inter, other) {
    let timeZone = inter.options.getString("zaman_aralığı");
    await inter.deferReply();
    let stats = await VoiceStat.aggregate([
      { $match: { guildId: inter.guildId, userId: inter.user.id } },
      { $sort: { [`${timeZone}TotalMinutes`]: -1 } },
      { $limit: 10 }
    ]).exec();
    if (!stats.length) return inter.editReply({ embeds: [buildEmbed(null, "Ses kanallarında hiçbir ses kaydı yok.", 0xff5370)] });

    let totalMinutes = stats.reduce((a, b) => a + b[`${timeZone}TotalMinutes`], 0);
    let statsMapped = stats.map((d) => {
      let sorted = Object.entries(d[`${timeZone}MinutesByChannel`]).sort((a, b) => b[1] - a[1]);
      return {
        channelId: sorted[0][0],
        userId: d.userId,
        minutes: sorted[0][1]
      }
    })

    await inter.editReply({
      embeds: [
        {
          title: `En Çok Ses Kanallarına Vakit Geçirenler (__${typeToName[timeZone]}__)`,
          color: 0xe4e889,
          description: `${typeToName[timeZone]} toplam ${totalMinutes} dakika geçirlmiş olan kanallar:\n${statsMapped.map((d, i) => `${i + 1}. **<#${d.channelId}>:** ${d.minutes} dakika (<@${d.userId}>)`).join("\n")}`,
          timestamp: Date.now(),
          footer: {
            text: `${Underline.other.projectName}`
          }
        }
      ]
    })
  },
  options: [
    {
      type: "STRING",
      name: "zaman_aralığı",
      description: "Hangi zaman aralığının değerlerni görmek istediğiniz.",
      required: true,
      choices: [
        {
          name: "Günlük",
          value: "daily"
        },
        {
          name: "Haftalık",
          value: "weekly"
        },
        {
          name: "Aylık",
          value: "monthly"
        }
      ]
    }
  ]
})