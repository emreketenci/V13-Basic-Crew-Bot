const ontime = require("ontime");
const VoiceStat = require("../../codebase/models/VoiceStat");

module.exports = new Underline.Event({
  eventName: "ready",
  async onEvent(client) {

    // Aylık toplam ses sürelerini sıfırlar.
    ontime({
      utc: true,
      cycle: "1T00:00:00",
      single: true
    }, async (tr) => {
      await VoiceStat.updateMany({}, {
        $set: {
          monthlyMinutesByChannel: {},
          monthlyTotalMinutes: 0
        }
      }).exec();
      tr.done();
    });

    // Haftalık toplam ses sürelerini sıfırlar.
    ontime({
      utc: true,
      cycle: "Sunday 00:00:00",
      single: true
    }, async (tr) => {
      await VoiceStat.updateMany({}, {
        $set: {
          weeklyMinutesByChannel: {},
          weeklyTotalMinutes: 0
        }
      }).exec();
      tr.done();
    });

    // Günlük toplam ses sürelerini sıfırlar.
    ontime({
      utc: true,
      cycle: "00:00:00",
      single: true
    }, async (tr) => {
      await VoiceStat.updateMany({}, {
        $set: {
          dailyMinutesByChannel: {},
          dailyTotalMinutes: 0
        }
      }).exec();
      tr.done();
    });
  }
});