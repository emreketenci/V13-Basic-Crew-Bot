const hasPermission = require("../../codebase/utils/hasPermission");
const buildEmbed = require("../../codebase/utils/buildEmbed");

const typeToName = {
  "infoHistory": "İsim",
  "punishmentHistory": "Ceza",
  "registerHistory": "Kayıt"
}

module.exports = new Underline.SlashCommand({
  name: ["defter","sıfırla"],
  description: "Belirtilen üyenin istenilen geçmişini temizlemenizi sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    /** @type {import("discord.js").GuildMember} */
    let member = inter.options.getMember("üye");
    let resetType = inter.options.getString("tip");
    
    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: member.user.id }, {}, { upsert: true, new: true }).exec();
    
    dbTargetMember[resetType] = [];
    await dbTargetMember.save();

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `**${member.user.tag}** adlı üyenin ${typeToName[resetType]} geçmişi sıfırlandı!`)] });
  },
  perms: {
    user: ["ADMINISTRATOR"]
  },
  options: [
    {
      name: "üye",
      description: "Sıfırlamak istediğininiz kişi.",
      type: "USER",
      required: true
    },
    {
      name: "tip",
      description: "Sıfırlama tipi.",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "İsim Geçmişi",
          value: "infoHistory"
        },
        {
          name: "Kayıt Geçmişi",
          value: "registerHistory",
        },
        {
          name: "Ceza Geçmişi",
          value: "punishmentHistory"
        }
      ]
    },
  ]
})