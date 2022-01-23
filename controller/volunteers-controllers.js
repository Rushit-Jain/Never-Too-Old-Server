const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Volunteer = require("../models/volunteer-model");

const checkUser = async (req, res, next) => {
  // console.log("voluneterr", req.body);
  let existingUser;
  try {
    existingUser = await Volunteer.findOne(
      { phoneNumber: req.body.number },
      { friends: 0, groups: 0 }
    );
  } catch (err) {
    // const error = new HttpError(
    //   'Signing up failed, please try again later.',
    //   500
    // );
    // return next(error);
    res.status(201).json({ present: "false" });
    return;
  }

  let present = "false";
  let friendsdata, groupsdata;
  try {
    if (existingUser) {
      // const error = new HttpError(
      //   'User exists already, please login instead.',
      //   422
      // );
      friendsdata = await Volunteer.find(
        { phoneNumber: req.body.number },
        { elders: 1, _id: 0 }
      ).populate([
        {
          path: "elders",
          select: ["phoneNumber", "firstName", "lastName", "profilePicture"],
        },
      ]);
      // console.log(friendsdata);
      groupsdata = await Volunteer.find(
        { phoneNumber: req.body.number },
        { groups: 1, _id: 0 }
      );
      // console.log(existingUser);
      present = "true";
      // return next(error);
    }
    res
      .status(201)
      .json({ present: present, existingUser, friendsdata, groupsdata });
  } catch (err) {
    console.log(err);
  }
};

const saveUser = async (req, res, next) => {
  // console.log(req.body);
  const {
    phoneNumber,
    fname,
    lname,
    gender,
    language,
    document,
    birthDay,
    birthMonth,
    birthYear,
  } = req.body;

  const createdUser = new Volunteer({
    phoneNumber,
    firstName: fname,
    lastName: lname,
    gender: gender,
    document: document,
    profilePicture: "",
    birthDay: birthDay,
    birthMonth: birthMonth,
    birthYear: birthYear,
    language: language,
    location: { type: "Point", coordinates: [72.0, 19.2] },
    friends: [],
    groups: [],
    slots: {
      morning: [],
      afternoon: [],
      evening: [],
    },
  });
  try {
    // console.log(typeof createdUser);
    createdUser
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    // console.log("ssssssssssssssssssssss");
    res.status(201).json(createdUser);
  } catch (err) {
    const error = new HttpError("User Creation Failed.29", 500);
    return next(error);
  }
};

const updateLocation = async (req, res, next) => {
  // console.log(req.body.coordinates[0]);
  try {
    let existingUser = await Volunteer.findOneAndUpdate(
      { phoneNumber: req.body.number },
      { location: { type: "Point", coordinates: req.body.coordinates } }
    );
    res.status(201).json({});
    // console.log(existingUser.location.coordinates);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  const { id, profilePicture } = req.body;
  try {
    var updatedVolunteer = await Volunteer.findByIdAndUpdate(id, {
      profilePicture: profilePicture,
    });
    res.status(201).json(updatedVolunteer);
  } catch (e) {
    console.log(e);
  }
};

exports.saveUser = saveUser;
exports.checkUser = checkUser;
exports.updateLocation = updateLocation;
exports.updateProfilePicture = updateProfilePicture;
