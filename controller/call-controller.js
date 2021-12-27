const mongoose = require("mongoose");
const HttpError = require('../models/http-error');
const Call = require('../models/call-model');

exports.saveCall = async (req, res, next) => {
  let calldata = req.body;
  try {
    const call = new Call({
      roomID: calldata.roomID,
      timestamp: calldata.timestamp,
      duration: calldata.duration,
      isReceived: calldata.isReceived,
      callType: calldata.callType,
      senderChatID: calldata.senderChatID,
      receiverChatID: calldata.receiverChatID
    });
    call.save().then(response => res.json(call)).catch(err => console.log(err));
    console.log(call);
  } catch (err) {
    return;
  }
}
exports.updateCall = async (req, res, next) => {
  let calldata = req.body;

  try {
    let call = await Call.find({ roomID: calldata.roomID });
    // console.log(call[0].timestamp);
    console.log(new Date(call.timestamp));
    console.log(new Date(calldata.timestamp));
    let duration = Date.parse(calldata.timestamp) - Date.parse(call[0].timestamp);
    // console.log(duration);
    call = await Call.findOneAndUpdate({ roomID: calldata.roomID }, { isReceived: true, duration: duration });
    console.log(call);
  } catch (err) {
    return;
  }
}

exports.getCalls = async (req, res, next) => {
  try {
    var calls;
    console.log(req.query.senderChatID);
    const senderChatID = req.query.senderChatID;
    const calls1 = await Call.find({
      senderChatID: senderChatID,
    }, { _id: 0, roomID: 0 });
    const calls2 = await Call.find({
      receiverChatID: senderChatID,
    }, { _id: 0, roomID: 0 });
    calls = [...calls1, ...calls2];


    calls.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    console.log(calls);
    res.json(calls);
  } catch (e) {
    const err = new HttpError(e.message, 500);
    return next(err);
  }
}