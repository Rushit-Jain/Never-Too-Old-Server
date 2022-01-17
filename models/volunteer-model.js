const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
  phoneNumber: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    // required: true,
  },
  profilePicture: {
    type: String,
  },
  birthDay: {
    type: Number,
    // required: true,
  },
  birthMonth: {
    type: Number,
    // required: true,
  },
  birthYear: {
    type: Number,
    // required: true,
  },
  language: {
    type: String,
    required: true,
  },
  location: {
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
  elders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Elder",
    },
  ],
  groups: [
    {
      type: String,
    },
  ],
  slots: {
    type: Map,
    of: Array,
  },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
