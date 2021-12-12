const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "creatorType",
  },
  acceptor: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "acceptorType",
  },
  creatorType: String,
  acceptorType: String,
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slotType: {
    type: String,
    required: true,
  },
  acceptanceStatus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
