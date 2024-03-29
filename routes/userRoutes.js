const express = require("express");
// const { check } = require('express-validator');

const usersController = require("../controller/users-controllers");

const router = express.Router();
// router.get('/', usersController.getUsers);
// router.post('/gu', usersController.getUser);
router.post("/check", usersController.checkUser);

router.post("/save", usersController.saveUser);
router.post("/updateLocation", usersController.updateLocation);
router.post("/addNewFriend", usersController.addNewFriend);
router.post("/addNewVolunteer", usersController.addNewVolunteer);
router.post("/insertNewGroup", usersController.insertNewGroup);
router.put("/updateInterests", usersController.updateInterests);
router.put("/updateEmergencyContacts", usersController.updateEmergencyContacts);
router.put("/updateProfilePicture", usersController.updateProfilePicture);

module.exports = router;
