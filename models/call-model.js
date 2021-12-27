const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const callSchema = new Schema({
  roomID: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  isReceived: {
    type: Boolean,
    required: true,
  },
  callType: {
    type: String,
    required: true,
  },
  senderChatID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  receiverChatID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Call", callSchema);
