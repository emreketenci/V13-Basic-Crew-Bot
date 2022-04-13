/** @returns {import("discord.js").MessageEmbed | import("discord.js").MessageEmbedOptions} */
module.exports = function buildEmbed(title = undefined, description = undefined, color = 0xe1cf6f) {
  return {
    title,
    description,
    color,
    footer: {
      text: `Armagan#4869 ❤ ${Underline.other.projectName}`
    },
    timestamp: Date.now()
  }
}