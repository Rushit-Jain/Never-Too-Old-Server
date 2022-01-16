const express = require("express");

const meetController = require("../controller/meet-controller");

const router = express.Router();

router.post("/requestMeet", meetController.saveRequestMeet);
router.post("/bookMeet", meetController.bookMeet);
router.get("/getVolunteerMeets", meetController.getVolunteerMeets);
router.get("/getLatestMeets", meetController.getLatestMeets);
router.get("/upcomingMeets", meetController.getUpcomingMeets);
router.put("/acceptMeet", meetController.acceptMeet);
router.get("/", meetController.getMeet);

module.exports = router;
