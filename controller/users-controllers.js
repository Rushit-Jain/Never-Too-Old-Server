const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Elder = require("../models/elder-model");
const Volunteer = require("../models/volunteer-model");

const checkUser = async (req, res, next) => {
  console.log(req.body);
  let existingUser;
  try {
    existingUser = await Elder.findOne(
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
      friendsdata = await Elder.find(
        { phoneNumber: req.body.number },
        { friends: 1, _id: 0, volunteers: 1 }
      ).populate([
        {
          path: "friends",
          select: ["phoneNumber", "firstName", "lastName", "profilePicture"],
        },
        {
          path: "volunteers",
          select: ["phoneNumber", "firstName", "lastName", "profilePicture"],
        },
      ]);
      console.log(friendsdata);
      groupsdata = await Elder.find(
        { phoneNumber: req.body.number },
        { groups: 1, _id: 0 }
      );
      console.log(existingUser);
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
  // const errors = validationResult(req);
  // console.log(errors);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError('Invalid inputs passed, please check your data.', 422)
  //   );
  // }
  // req.body = JSON.parse(Object.keys(req.body)[0]);
  console.log(req.body);
  const {
    phoneNumber,
    fname,
    lname,
    gender,
    language,
    interests,
    document,
    emergencyContacts,
  } = req.body;

  const createdUser = new Elder({
    phoneNumber,
    firstName: fname,
    lastName: lname,
    gender: gender,
    document: document,
    profilePicture: "wjdhwj",
    birthDay: "28",
    birthMonth: "11",
    birthYear: "2000",
    language: language,
    location: { type: "Point", coordinates: [72.0, 19.2] },
    friends: [],
    volunteers: [],
    interests: interests,
    groups: [],
    emergencyContacts: emergencyContacts,
  });
  try {
    console.log(typeof createdUser);
    createdUser
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    console.log("ssssssssssssssssssssss");
    res.status(201).json(createdUser);
  } catch (err) {
    const error = new HttpError("User Creation Failed.29", 500);
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  console.log(req.body);
  try {
    let existingUser = await Elder.findOne({ phoneNumber: req.body.number });
    res.status(201).json(existingUser);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

const updateLocation = async (req, res, next) => {
  console.log(req.body.coordinates[0]);
  try {
    let existingUser = await Elder.findOneAndUpdate(
      { phoneNumber: req.body.number },
      { location: { type: "Point", coordinates: req.body.coordinates } }
    );
    console.log(existingUser.location.coordinates);
    // let friendsID = [];
    // for (var i = 0; i < ((existingUser.friends).length); i++) {
    //   let idsplit = existingUser.friends.toString().split("\"")
    //   friendsID.push(idsplit[1]);
    // }
    // let new_friends1 = await Elder.find({ _id: { $nin: [...existingUser.friends, existingUser._id] } });
    // console.log(new_friends1);
    let new_friends = await Elder.find(
      {
        _id: { $nin: [...existingUser.friends, existingUser._id] },
        interests: { $ne: [] },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
            },
            $maxDistance: 20000,
            $minDistance: 0,
          },
        },
      },
      { _id: 1, firstName: 1, lastName: 1, interests: 1 }
    );

    let new_volunteers = await Volunteer.find(
      {
        _id: { $nin: [...existingUser.volunteers] },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
            },
            $maxDistance: 20000,
            $minDistance: 0,
          },
        },
      },
      { _id: 1, firstName: 1, lastName: 1 }
    );
    console.log("HEY there" + new_volunteers);

    console.log("ddddddddddddddddddddddd", new_friends);
    var jaccard_indexes = [];
    let interest = existingUser.interests;

    for (var i = 0; i < new_friends.length; i++) {
      if (new_friends[i].interests == []) continue;
      let bitwiseandlist = [];
      let bitwiseorlist = [];
      console.log(new_friends[i].firstName, new_friends[i].interests);
      for (var j = 0; j < 42; j++) {
        intersection = interest[j] && new_friends[i].interests[j];
        bitwiseandlist.push(intersection);
        union = interest[i] || new_friends[i].interests[j];
        bitwiseorlist.push(union);
      }
      var countOccurrences = (arr, val) =>
        arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
      let similarity =
        countOccurrences(bitwiseandlist, true) /
        countOccurrences(bitwiseorlist, true);
      console.log(similarity);
      jaccard_indexes.push(similarity);
      new_friends[i].similarity = similarity;
    }
    new_friends.sort((a, b) => b.similarity - a.similarity);
    console.log("sssssssssssssokodkdmk", new_friends);
    res
      .status(201)
      .json({ new_friends: new_friends, new_volunteers: new_volunteers });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

const addNewFriend = async (req, res, next) => {
  console.log(req.body);
  try {
    let existingUser = await Elder.findOneAndUpdate(
      { phoneNumber: req.body.number },
      { $push: { friends: req.body.friendID } }
    );
    friendsdata = await Elder.find(
      { phoneNumber: req.body.number },
      { friends: 1, _id: 0 }
    ).populate([
      {
        path: "friends",
        select: ["phoneNumber", "firstName", "lastName", "profilePicture"],
      },
    ]);
    res.status(201).json({ friendsdata });
    await Elder.findByIdAndUpdate(req.body.friendID, {
      $push: { friends: existingUser._id },
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

const addNewVolunteer = async (req, res, next) => {
  console.log(req.body);
  try {
    let existingUser = await Elder.findOneAndUpdate(
      { phoneNumber: req.body.number },
      { $push: { volunteers: req.body.volunteerID } }
    );
    volunteersdata = await Elder.find(
      { phoneNumber: req.body.number },
      { volunteers: 1, _id: 0 }
    ).populate([
      {
        path: "volunteers",
        select: ["phoneNumber", "firstName", "lastName", "profilePicture"],
      },
    ]);
    console.log(volunteersdata);
    res.status(201).json({ volunteersdata: volunteersdata });
    await Volunteer.findByIdAndUpdate(req.body.volunteerID, {
      $push: { elders: existingUser._id },
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

const insertNewGroup = async (req, res, next) => {
  console.log(req.body);
  try {
    let newGroup = {
      timestamp: req.body.timestamp,
      groupName: req.body.groupName,
      memberChatIDs: [req.body.creatorChatID, ...req.body.memberChatIDs],
    };
    let addNewGroup = await Elder.updateMany(
      { _id: { $in: [...req.body.memberChatIDs, req.body.creatorChatID] } },
      { $push: { groups: newGroup } }
    );
    let existingUser = await Elder.findById(req.body.creatorChatID);
    existingUser.groups.sort(
      (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
    );
    // console.log(existingUser.groups);
    res.status(201).json(existingUser.groups[0]);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.getUser = getUser;
exports.saveUser = saveUser;
exports.checkUser = checkUser;
exports.insertNewGroup = insertNewGroup;
exports.updateLocation = updateLocation;
exports.addNewFriend = addNewFriend;
exports.addNewVolunteer = addNewVolunteer;
