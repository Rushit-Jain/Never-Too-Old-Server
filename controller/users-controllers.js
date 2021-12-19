// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const HttpError = require('../models/http-error');
const Elder = require('../models/elder-model');
const Volunteer = require('../models/volunteer-model');

const checkUser = async (req, res, next) => {
  // const errors = validationResult(req);
  // console.log(errors);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError('Invalid inputs passed, please check your data.', 422)
  //   );
  // }
  // req.body = JSON.parse(req.body);
  console.log(req.body);
  let existingUser;
  try {
    existingUser = await Elder.findOne({ phoneNumber: req.body.number }, { friends: 0 });
  } catch (err) {
    // const error = new HttpError(
    //   'Signing up failed, please try again later.',
    //   500
    // );
    // return next(error);
    res
      .status(201)
      .json({ "present": "false" });
    return;
  }

  let present = "false";
  let friendsdata;
  try {
    if (existingUser) {
      // const error = new HttpError(
      //   'User exists already, please login instead.',
      //   422
      // );
      friendsdata = await Elder.find({ phoneNumber: req.body.number }, { friends: 1, _id: 0, volunteers: 1 }).populate([{ path: "friends", select: ['phoneNumber', 'firstName', 'lastName', 'profilePicture'] }, { path: "volunteers", select: ['phoneNumber', 'firstName', 'lastName', 'profilePicture'] }]);
      console.log(existingUser);
      present = "true";
      // return next(error);
    }
    res
      .status(201)
      .json({ "present": present, existingUser, friendsdata });
  } catch (err) {
    console.log(err);
  }

}

const saveUser = async (req, res, next) => {
  // const errors = validationResult(req);
  // console.log(errors);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError('Invalid inputs passed, please check your data.', 422)
  //   );
  // }
  // req.body = JSON.parse(Object.keys(req.body)[0]);
  const { phoneNumber, fname, lname, gender, language } = req.body;
  console.log(req.body);

  const createdUser = new Elder({
    phoneNumber,
    firstName: fname,
    lastName: lname,
    gender: gender,
    document: "enjd",
    profilePicture: "wjdhwj",
    birthDay: "28",
    birthMonth: "11",
    birthYear: "2000",
    language: language,
    longitude: "cdnkjc",
    latitude: "ndjncj",
    friends: [],
    volunteers: [],
    interests: [],
    groups: [],
    emergencyContacts: ['7506432454', '9892283930']
  });
  try {
    console.log(typeof createdUser);
    createdUser.save().then(result => console.log(result)).catch(err => console.log(err));
    res
      .status(201)
      .json(createdUser);
  } catch (err) {
    const error = new HttpError(
      'User Creation Failed.29',
      500
    );
    return next(error);
  }
};
const getUser = async (req, res, next) => {
  console.log(req.body);
  try {
    let existingUser = await Elder.findOne({ phoneNumber: req.body.number });
    res
      .status(201)
      .json(existingUser);
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }


};

exports.getUser = getUser;
exports.saveUser = saveUser;
exports.checkUser = checkUser;