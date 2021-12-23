const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const elderSchema = new Schema({
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
      // friendType: String,
      // refPath: "friendType",
      ref: "Elder"
    },
  ],
  volunteers: [
    {
      type: Schema.Types.ObjectId,
      // friendType: String,
      // refPath: "friendType",
      ref: "Volunteer"
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  groups: [
    {
      timestamp: { type: String },
      groupName: { type: String },
      memberChatIDs: [{}],
      // memberChatIDs: [{ _id: { type: Schema.ObjectId } }]
      // type: String,
    },
  ],
  emergencyContacts: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Elder", elderSchema);
