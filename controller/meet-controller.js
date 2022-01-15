const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const TimeSlot = require("../models/time-slot-model");
const Elder = require("../models/elder-model");
const Volunteer = require("../models/volunteer-model");

exports.saveRequestMeet = async (req, res, next) => {
  const { userId, date, time, meetType } = req.body;
  // console.log(req.body);

  const createdMeet = new TimeSlot({
    elder: userId,
    volunteer: null,
    startTime: time,
    endTime: "",
    date: date,
    meetType: meetType,
    acceptanceStatus: false,
  });
  try {
    // console.log(typeof createdMeet);
    createdMeet
      .save()
      .then((result) => {})
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
    }).lean();
    meetIds = meet.map((e) => e.volunteer);
    var volunteers = await Volunteer.find(
      { _id: { $in: meetIds } },
      { firstName: 1, lastName: 1 }
    );
    var volunteerNames = {};
    for (let i = 0; i < volunteers.length; i++)
      volunteerNames[volunteers[i]["_id"].toString()] =
        volunteers[i]["firstName"] + " " + volunteers[i]["lastName"];
    finalResult = meet.map((e) => {
      var temp = e;
      temp.volunteerName = volunteerNames[e["volunteer"]];
      return temp;
    });
    res.json(meet);
  } catch (e) {
    console.log(e);
    const err = new HttpError(e.message, 500);
    return next(err);
  }
};

exports.getVolunteerMeets = async (req, res, next) => {
  try {
    var meet;
    const userId = req.query.userId;
    meet = await TimeSlot.find({
      volunteer: userId,
    }).lean();
    meetIds = meet.map((e) => e.elder);
    var elders = await Elder.find(
      { _id: { $in: meetIds } },
      { firstName: 1, lastName: 1 }
    );
    var elderNames = {};
    for (let i = 0; i < elders.length; i++)
      elderNames[elders[i]["_id"].toString()] =
        elders[i]["firstName"] + " " + elders[i]["lastName"];
    finalResult = meet.map((e) => {
      var temp = e;
      temp.elderName = elderNames[e["elder"].toString()];
      return temp;
    });
    res.json(finalResult);
  } catch (e) {
    const err = new HttpError(e.message, 500);
    return next(err);
  }
};

exports.bookMeet = async (req, res, next) => {
  const { elder, date, startTime, meetType, endTime, volunteer } = req.body;

  const createdMeet = new TimeSlot({
    elder: elder,
    volunteer: volunteer,
    startTime: startTime,
    endTime: endTime,
    date: date,
    meetType: meetType,
    acceptanceStatus: true,
  });
  try {
    createdMeet
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    res.status(201).json(createdMeet);
  } catch (err) {
    const error = new HttpError("Meet Creation Failed", 500);
    return next(error);
  }
};

exports.getLatestMeets = async (req, res, next) => {
  try {
    let elders = await Elder.find(
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [req.query.longitude, req.query.latitude],
            },
            $maxDistance: 20000,
            $minDistance: 0,
          },
        },
      },
      { _id: 1 }
    );
    var elderIds = elders.map((e) => e["_id"]);
    let meets = await TimeSlot.find({
      elder: {
        $in: elderIds,
      },
    }).populate([
      {
        path: "elder",
        select: ["firstName", "lastName", "profilePicture"],
      },
    ]);
    console.log("hi");
    res.status(201).json(meets);
  } catch (e) {
    const error = new HttpError(e, 500);
    return next(error);
  }
};

exports.acceptMeet = async (req, res, next) => {
  try {
    const { meetId, volunteerId } = req.query;
    let result = await TimeSlot.findByIdAndUpdate(meetId, {
      acceptanceStatus: true,
      volunteer: volunteerId,
    });
    res.status(201).json({});
  } catch (e) {
    console.log(e);
  }
};
