const express = require('express');
// const { check } = require('express-validator');

const volunteerController = require('../controller/volunteers-controllers');

const router = express.Router();

router.post(
  '/check',
  volunteerController.checkUser
);

router.post('/save', volunteerController.saveUser);
router.post('/updateLocation', volunteerController.updateLocation);

module.exports = router;
