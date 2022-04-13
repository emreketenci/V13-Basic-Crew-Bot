const jailMember = require("../codebase/api/jailMember");
const unjailMember = require("../codebase/api/unjailMember");

module.exports = new Underline.Event({
  eventName: "guildMemberUpdate",
  onEvent(oldMember, newMember) {
    if (oldMember.user.tag === newMember.user.tag) return;
    let isIncludesBlockedThings = Underline.other.blockedUsernameContents.some(i => newMember.user.tag.toLowerCase().includes(i));
    if (isIncludesBlockedThings) { 
      jailMember(newMember, Underline.client.user.id, Infinity, "Kullanıcı isminde ysaklı içerik.");
    } else {
      unjailMember(newMember);
    }
  }
});