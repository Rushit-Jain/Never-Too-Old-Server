const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
  elder: {
    type: Schema.Types.ObjectId,
    ref: "Elder",
  },
  volunteer: {
    type: Schema.Types.ObjectId,
    ref: "Volunteer",
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    // required: true,
  },
  date: {
    type: String,
    required: true,
  },
  meetType: {
    type: String,
    required: true,
  },
  meetLocation: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    },
  },
  meetStatus: {
    type: String,
    required: true,
  },
  acceptanceStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
