const afkMember = require("../codebase/api/afkMember");
const buildEmbed = require("../codebase/utils/buildEmbed");

module.exports = new Underline.SlashCommand({
  name: ["afk"],
  description: "Afk moduna geçmenizi sağlar.",
  async onInteraction(inter, other) { 
    await inter.deferReply();

    const sebep = inter.options.getString("sebep") || "Sebep belirtilmemiş.";

    await afkMember(inter.member, sebep);

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `Artık **${sebep}** sebebi ile afksın!`)] });
  },
  options: [
    {
      name: "sebep",
      description: "Afk sebebiniz.",
      type: "STRING"
    }
  ]
})