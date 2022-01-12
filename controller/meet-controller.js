const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const TimeSlot = require("../models/time-slot-model");

exports.saveRequestMeet = async (req, res, next) => {


  const { userId, date, time, meetType } = req.body;
  console.log(req.body);

  const createdMeet = new TimeSlot({
    elder: userId,
    volunteer: null,
    startTime: time,
    endTime: '',
    date: date,
    meetType: meetType,
    acceptanceStatus: false,
  });
  try {
    console.log(typeof createdMeet);
    createdMeet
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    res.status(201).json(createdMeet);
  } catch (err) {
    const error = new HttpError("User Creation Failed.29", 500);
    return next(error);
  }
};


exports.getMeet = async (req, res, next) => {
  try {
    var meet;
    const userId = req.query.userId;
    meet = await TimeSlot.find({
      elder: userId,
    });
    console.log(meet);
    res.json(meet);
  } catch (e) {
    const err = new HttpError(e.message, 500);
    return next(err);
  }
}