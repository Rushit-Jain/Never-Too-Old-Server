const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const elderSchema = new Schema({
  phoneNumber: {
    type: String,
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
    required: true,
  },
  profilePicture: {
    type: String,
  },
  birthDay: {
    type: Number,
    required: true,
  },
  birthMonth: {
    type: Number,
    required: true,
  },
  birthYear: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
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

module.exports = mongoose.model("Elder", elderSchema);
