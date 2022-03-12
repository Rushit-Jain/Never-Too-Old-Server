const ElderSlots = require("./models/elder-slots");

let elderSlots = [];

module.exports = {
  addSlot: async (id) => {
    elderSlots.push(id.toString());
    new ElderSlots({ meetID: id }).save();
  },
  removeSlot: async (id) => {
    elderSlots = elderSlots.filter((s) => s !== id);
    ElderSlots.findOneAndRemove({ meetID: id });
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
