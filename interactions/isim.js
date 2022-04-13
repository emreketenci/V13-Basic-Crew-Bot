const buildEmbed = require("../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["isim"],
  description: "Sunucu boosterlarının isim değiştirmesini sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    if (!inter.member.roles.cache.has(inter.guild.roles.premiumSubscriberRole.id))
      return await inter.editReply({ embeds: [buildEmbed(null, "Bu komutu kullanabilmek için sunucuyu boostlamış olman gerekiyor!", 0xff5362)] });

    const isim = inter.options.getString("isim") || inter.member.user.username;

    isim = `${Underline.other.tag} ${isim}`;

    if (isim.length > 32) return inter.editReply({ embeds: [buildEmbed(null, "Total isim uzunluğu 32 karekteri geçemez!", 0xff5362)] });

    await inter.member.setNickname(isim);
    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `Harika! İsmin **${isim}** olarak ayarlandı!`)] });
  },
  options: [
    {
      name: "isim",
      description: "Yeni isminiz.",
      type: "STRING"
    }
  ]
})