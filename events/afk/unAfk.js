const getDBMember = require("../../codebase/api/getDBMember");
const unafkMember = require("../../codebase/api/unafkMember");
const buildEmbed = require("../../codebase/utils/buildEmbed");

module.exports = new Underline.Event({
  eventName: "messageCreate",
  async onEvent(message) {
    if (!message.guildId) return;

    let dbTargetMember = await getDBMember(message.guildId, message.author.id);

    if (!dbTargetMember.other.afk) return;

    await message.reply({
      embeds: [buildEmbed(null, "Artık AFK değilsin!")]
    });

    unafkMember(message.member);
  }
});