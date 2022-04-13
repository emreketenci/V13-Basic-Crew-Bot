const getDBMember = require("../../codebase/api/getDBMember");
const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.Event({
  eventName: "messageCreate",
  async onEvent(message) {
    if (!message.guildId) return;

    message.mentions.members.forEach(async member => {
      let dbMember = await getDBMember(message.guildId, member.id);
      if (!dbMember.other.afk) return;
      await message.reply({
        embeds: [buildEmbed(null, `${member} şuanda **${dbMember.other.afk}** sebebi ile afk!`, 0xff5370)]
      });
    });
  }
});