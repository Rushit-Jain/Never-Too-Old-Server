const mongoose = require("mongoose");
const HttpError = require('../models/http-error');
const Message = require('../models/message-model');

exports.saveMessages = async (req, res, next) => {
  let msg = req.body;
  try {
    const message = new Message({
      timestamp: msg.timestamp,
      message: msg.text,
      senderChatID: msg.senderChatID,
      receiverChatID: msg.receiverChatID
    });
    message.save().then(response => res.json(message)).catch(err => console.log(err));
    console.log(message);
  } catch (err) {
    return;
  }
}

exports.getMessages = async (req, res, next) => {
  try {
    console.log(req.query.senderChatID);
    const userId1 = req.query.senderChatID;
    const userId2 = req.query.receiverChatID;
    const messages1 = await Message.find({
      senderChatID: userId1,
      receiverChatID: userId2,
    });
    const messages2 = await Message.find({
      senderChatID: userId2,
      receiverChatID: userId1,
    });
    const messages = [...messages1, ...messages2];
    messages.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    console.log(messages);
    res.json(messages);
  } catch (e) {
    const err = new HttpError(e.message, 500);
    return next(err);
  }
}