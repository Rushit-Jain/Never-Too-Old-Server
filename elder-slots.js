let elderSlots = [];

module.exports = {
  addSlot: (id) => elderSlots.push(id.toString()),
  removeSlot: (id) => (elderSlots = elderSlots.filter((s) => s !== id)),
  getElderSlots: () => elderSlots,
  isSlotPresent: (id) => {
    console.log(elderSlots);
    return elderSlots.indexOf(id.toString()) != -1;
  },
};
