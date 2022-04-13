const VoiceStat = require("../../codebase/models/VoiceStat");

/** @type {Map<string, import("discord.js").VoiceBasedChannel>} */
const voiceMembers = new Map();

module.exports = new Underline.Event({
  eventName: "voiceStateUpdate",
  onEvent(oldState, newState) { 
    if ((!oldState?.channelId && newState?.channelId) || (oldState?.channelId && newState?.channelId)) {
      voiceMembers.set(newState.member.id, newState.channel);
    } else if (oldState?.channelId && !newState?.channelId) {
      voiceMembers.delete(oldState.member.id);
    }
  },
  onLoad(client) {
    setInterval(() => {
      voiceMembers.forEach((channel, userId) => {
        if (!channel.members.has(userId)) {
          voiceMembers.delete(userId);
          return;
        }
        VoiceStat.findOneAndUpdate({
          guildId: channel.guild.id,
          userId: userId
        }, {
          $inc: {
            [`dailyMinutesByChannel.${channel.id}`]: 1,
            [`weeklyMinutesByChannel.${channel.id}`]: 1,
            [`monthlyMinutesByChannel.${channel.id}`]: 1,
            dailyTotalMinutes: 1,
            weeklyTotalMinutes: 1,
            monthlyTotalMinutes: 1
          }
        }, { upsert: true }).exec();
      });
    }, 60000);
    client.once("ready", () => {
      client.guilds.cache.forEach((guild) => { 
        guild.channels.cache.forEach((channel) => {
          if (channel.type === "GUILD_VOICE") {
            channel.members.forEach((member) => {
              voiceMembers.set(member.id, channel);
            });
          }
        });
      })
    })
  }
});