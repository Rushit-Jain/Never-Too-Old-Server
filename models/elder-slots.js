const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const elderSlotSchema = new Schema({
  meetID: {
    required: true,
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("ElderSlot", elderSlotSchema);
