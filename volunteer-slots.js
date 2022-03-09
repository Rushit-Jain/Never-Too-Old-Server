let volunteerSlots = {};
const Volunteer = require("./models/volunteer-model");

module.exports = {
  updateVolunteerSlots: (id, slots) => {
    volunteerSlots[id] = slots;
  },
  getVolunteerSlots: (id) => volunteerSlots[id],
  isSlotPresent: (id, timeOfDay, slot) =>
    volunteerSlots[id][timeOfDay].indexOf(slot) != -1,
  initialize: async () => {
    let volunteers = await Volunteer.find({}, { _id: 1, slots: 1 }).lean();
    volunteers.forEach((v) => (volunteerSlots[v._id] = v.slots));
    console.log(volunteerSlots);
  },
};
