const express = require('express');
// const { check } = require('express-validator');

const messageController = require('../controller/message-controller');

const router = express.Router();
router.post('/save', messageController.saveMessages);
// router.get('/', messageController.getMessages);
router.get('/', messageController.getAllMessages);

module.exports = router;
