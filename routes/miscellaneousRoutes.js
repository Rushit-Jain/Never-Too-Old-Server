const express = require("express");

const miscellaneousController = require("../controller/miscellaneous-controller");

const router = express.Router();
router.post(
  "/uploadProblemAudio",
  miscellaneousController.uploadFile,
  miscellaneousController.sendFile
);

module.exports = router;
