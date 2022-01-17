const mongoose = require("mongoose");
const moment = require("moment");
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
  let timeOfDay = req.body.timeOfDay.split(".")[1].toLowerCase();
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
    let volunteerFromDb = await Volunteer.findById(volunteer);
    let slots = volunteerFromDb.slots;
    let updatedSlots = slots.get(timeOfDay);
    updatedSlots = updatedSlots.filter(
      (e) => e.localeCompare(req.body.slot) != 0
    );
    slots.set(timeOfDay, updatedSlots);
    await Volunteer.findByIdAndUpdate(volunteer, { slots: slots });
    createdMeet
      .save()
      .then((result) => result)
      .catch((err) => console.log(err));
    res.status(201).json(createdMeet);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(err);
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
    return next(e);
  }
};

exports.getUpcomingMeets = async (req, res, next) => {
  try {
    var upcomingMeets;
    const { id, type } = req.query;
    if (type == "elder") {
      upcomingMeets = await TimeSlot.find({ elder: id })
        .populate([
          {
            path: "volunteer",
            select: ["firstName", "lastName", "profilePicture"],
          },
        ])
        .lean();
    } else {
      upcomingMeets = await TimeSlot.find({ volunteer: id })
        .populate([
          {
            path: "elder",
            select: ["firstName", "lastName", "profilePicture"],
          },
        ])
        .lean();
    }
    upcomingMeets = upcomingMeets.filter((e) => {
      let day = e.date.split("-")[2].trim();
      let month = (parseInt(e.date.split("-")[1].trim()) - 1).toString();
      let year = e.date.split("-")[0].trim();
      let ampm = e.startTime
        .split(" ")
        [e.startTime.split(" ").length - 1].trim();
      let hour = e.startTime.split(":")[0].trim();
      let min = e.startTime.split(":")[1].trim().split(" ")[0].trim();
      if (min.length == 1) min = "0" + min;
      let stringToCompare = hour + ":" + min + " " + ampm;
      [hour, min] = moment(stringToCompare, ["h:mm A"])
        .format("HH:mm")
        .split(":");
      var dateThen = new Date(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        parseInt(hour),
        parseInt(min),
        0,
        0
      );
      var dateNow = new Date();
      return dateNow.getTime() <= dateThen.getTime();
    });
    res.status(201).json(upcomingMeets);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.updateSlots = async (req, res, next) => {
  const { id, slots } = req.body;
  try {
    await Volunteer.findByIdAndUpdate(id, { slots: slots });
    res.status(201).json({});
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.getNearbyVolunteers = async (req, res, next) => {
  const { latitude, longitude } = req.query;
  var volunteers;
  try {
    volunteers = await Volunteer.find(
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 20000,
            $minDistance: 0,
          },
        },
      },
      { document: 0 }
    );
    res.status(201).json(volunteers);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
