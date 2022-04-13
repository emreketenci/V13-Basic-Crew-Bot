const Member = require("../codebase/models/Member");
const buildEmbed = require("../codebase/utils/buildEmbed");
const hasPermission = require("../codebase/utils/hasPermission");

module.exports = new Underline.SlashCommand({
  name: ["kız"],
  description: "Üyeyi kız olarak kayıt etmenizi sağlar.",
  async onInteraction(inter, other) {
    await inter.deferReply();

    if (!hasPermission(inter.member, Underline.other.registerHammer)) return inter.editReply("Bu komutu kullanmaya yetkin yetmiyor. :pensive:");
    
    /** @type {import("discord.js").GuildMember} */
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
    await member.roles.add(Underline.other.femaleRoles);

    other.dbMember.registerHistory.unshift({ gender: "female", age, name, at: Date.now(), id: member.id });
    await other.dbMember.save();

    dbTargetMember.infoHistory.unshift({ gender: "female", age, name, at: Date.now(), by: inter.id });
    await dbTargetMember.save();

    await inter.editReply({ embeds: [buildEmbed("İşlem Başarılı", `${member} kız olarak kaydedildi!`)] });
  },
  options: [
    {
      name: "üye",
      description: "Kız olarak keyıt edilecek üye.",
      type: "USER",
      required: true
    },
    {
      name: "isim",
      description: "Kız olarak keyıt edilecek üyenin ismi.",
      type: "STRING",
      required: true
    },
    {
      name: "yaş",
      description: "Kız olarak keyıt edilecek üyenin yaşı.",
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