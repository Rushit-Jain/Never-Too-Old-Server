const express = require('express');
// const { check } = require('express-validator');

const usersController = require('../controller/users-controllers');

const router = express.Router();
// router.get('/', usersController.getUsers);
// router.post('/gu', usersController.getUser);
router.post(
  '/check',
  usersController.checkUser
);

router.post('/save', usersController.saveUser);

module.exports = router;
