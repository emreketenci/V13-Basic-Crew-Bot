const Member = require("../codebase/models/Member");
const buildEmbed = require("../codebase/utils/buildEmbed");
const hasPermission = require("../codebase/utils/hasPermission");

module.exports = new Underline.SlashCommand({
  name: ["erkek"],
  description: "Üyeyi erkek olarak kayıt etmenizi sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    if (!hasPermission(inter.member, Underline.other.registerHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");

    const member = inter.options.getMember("üye");
    const name = inter.options.getString("isim");
    const age = inter.option.getInteger("yaş");

    if (
      dbGuild.tagOnlyRegisterMode
      && !(member.nickname.includes(Underline.other.tag) || member.user.discriminator == Underline.other.discriminatorTag)
    ) return inter.editReply({ embeds: [buildEmbed(null, `Sunucu taglı alım modunda! Bu üye taglı alım için gerekli olan hiç bir gereksinimi karşılamaıyor.`, 0xff443f)] });
    
    let resultName = `${Underline.other.tag} ${name}`;
    if (resultName.length > 32) return inter.editReply({ embeds: [buildEmbed(null, "Kullanıcının total ismi çok uzun!", 0xff443f)] });

    const dbTargetMember = await Member.findOneAndUpdate({ guildId: inter.guildId, userId: member.user.id }, {}, { upsert: true, new: true }).exec();

    await member.setNickname(resultName);
    await member.roles.add(Underline.other.maleRoles);


    other.dbMember.registerHistory.unshift({ gender: "male", age, name, at: Date.now(), id: member.id });
    await other.dbMember.save();

    dbTargetMember.infoHistory.unshift({ gender: "male", age, name, at: Date.now(), by: inter.id });
    await dbTargetMember.save();

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `${member} erkek olarak kaydedildi!`)] });
  },
  options: [
    {
      name: "üye",
      description: "Erkek olarak keyıt edilecek üye.",
      type: "USER",
      required: true
    },
    {
      name: "isim",
      description: "Erkek olarak keyıt edilecek üyenin ismi.",
      type: "STRING",
      required: true
    },
    {
      name: "yaş",
      description: "Erkek olarak keyıt edilecek üyenin yaşı.",
      type: "INTEGER",
      required: true
    }
  ],
  coolDown: 1000,
  guildOnly: true,
  perms: {
    bot: ["MANAGE_ROLES"],
  },
});