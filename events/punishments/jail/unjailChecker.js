const Punishment = require("../../../codebase/models/Punishment");
const { quickForEach } = require("async-and-quick");
const sleep = require("stuffs/lib/sleep");
const unjailMember = require("../../../codebase/api/unjailMember");

module.exports = new Underline.Event({
  eventName: "ready",
  async onEvent(client) {
    async function _loop() {
      let punishments = await Punishment.find({}).exec();
      await quickForEach(punishments, async (p) => {
        if (p.type !== Punishment.PUNISHMENT_JAIL) return;
        let guild = client.guilds.cache.get(p.guildId);
        if (!guild) {
          await p.remove();
          return;
        }
        let member = await guild.members.fetch(p.userId ?? "01").catch(() => null);
        if (!member) return;
        if (Date.now() > p.createdAt + p.duration) { 
          await unjailMember(member);
          await p.remove();
        }
      });
      await sleep(60000);
      _loop();
    };
    _loop();
  }
});