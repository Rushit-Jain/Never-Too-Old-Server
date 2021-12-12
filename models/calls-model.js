const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const callSchema = new Schema({
  timestamp: {
    type: String,
    required: true,
  },
  callType: {
    type: String,
    required: true,
  },
  callerType: String,
  calledType: String,
  callerUsername: {
    type: Schema.Types.ObjectId,
    refPath: "callerType",
    required: true,
  },
  calledUsername: {
    type: Schema.Types.ObjectId,
    refPath: "calledType",
    required: true,
  },
});

module.exports = mongoose.model("Call", callSchema);
