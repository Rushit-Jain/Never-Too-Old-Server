let volunteerSlots = {};

module.exports = {
  updateVolunteerSlots: (id, slots) => {
    volunteerSlots[id] = slots;
    console.log(volunteerSlots);
  },
  getVolunteerSlots: (id) => volunteerSlots[id],
  isSlotPresent: (id, timeOfDay, slot) =>
    volunteerSlots[id][timeOfDay].indexOf(slot) != -1,
};
