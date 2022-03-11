const ElderSlots = require("./models/elder-slots");

let elderSlots = [];

module.exports = {
  addSlot: async (id) => {
    await new ElderSlots({ meetID: id }).save();
    elderSlots.push(id.toString());
  },
  removeSlot: async (id) => {
    await ElderSlots.findOneAndRemove({ meetID: id });
    elderSlots = elderSlots.filter((s) => s !== id);
  },
  getElderSlots: () => elderSlots,
  isSlotPresent: (id) => {
    console.log(elderSlots);
    return elderSlots.indexOf(id.toString()) != -1;
  },
  initialize: async () => {
    let temp = await ElderSlots.find({}).lean();
    elderSlots = temp.map((t) => t.meetID.toString());
    console.log(elderSlots);
  },
};
