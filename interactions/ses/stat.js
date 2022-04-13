const VoiceStat = require("../../codebase/models/VoiceStat");
const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["ses", "stat"],
  description: "Ses kanallarına geçirdiğiniz süreleri gösterir.",
  async onInteraction(inter, other) { 
    await inter.deferReply();
    let stats = await VoiceStat.findOne({ guildId: inter.guildId, userId: inter.user.id }).exec();
    if (!stats) return inter.editReply({ embeds: [buildEmbed(null, "Ses kanallarında hiçbir ses kaydın yok.", 0xff5370)] });
    
    let dailyMinutesByChannel = Object.entries(stats.dailyMinutesByChannel).sort((a, b) => b[1] - a[1]).slice(0, 10);
    let weeklyMinutesByChannel = Object.entries(stats.weeklyMinutesByChannel).sort((a, b) => b[1] - a[1]).slice(0, 10);
    let monthlyMinutesByChannel = Object.entries(stats.monthlyMinutesByChannel).sort((a, b) => b[1] - a[1]).slice(0, 10);

    await inter.editReply({
      embeds: [
        {
          title: "Ses Kanallarında Geçirdiğiniz Süreler",
          color: 0xe4e889,
          fields: [
            {
              name: "Toplam Değerler",
              value: `**Bu gün:** ${stats.dailyTotalMinutes} dakika\n**Bu hafta:** ${stats.weeklyTotalMinutes} dakika\n**Bu ay:** ${stats.monthlyTotalMinutes} dakika`,
            },
            {
              name: "Kanallara Göre Değerler (__Günlük__)",
              value: `${dailyMinutesByChannel.map((d, i) => `${i + 1}. **<#${d[0]}>:** ${d[1]} dakika`).join("\n")}`,
            },
            {
              name: "Kanallara Göre Değerler (__Hafatlık__)",
              value: `${weeklyMinutesByChannel.map((d, i) => `${i + 1}. **<#${d[0]}>:** ${d[1]} dakika`).join("\n")}`,
            },
            {
              name: "Kanallara Göre Değerler (__Aylık__)",
              value: `${monthlyMinutesByChannel.map((d, i) => `${i + 1}. **<#${d[0]}>:** ${d[1]} dakika`).join("\n")}`,
            }
          ],
          timestamp: Date.now(),
          footer: {
            text: `${Underline.other.projectName}`
          }
        }
      ]
    })
  }
})