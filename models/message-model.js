const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  timestamp: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userType: String,
  senderUsername: {
    type: Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
  receiverUsername: {
    type: Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
