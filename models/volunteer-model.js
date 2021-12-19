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
  longitude: {
    type: String,
    // required: true,
  },
  latitude: {
    type: String,
    // required: true,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      friendType: String,
      refPath: "friendType",
      // ref: "Elder"
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  groups: [
    {
      type: String,
    },
  ],
  emergencyContacts: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
