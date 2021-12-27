const express = require('express');
// const { check } = require('express-validator');

const callController = require('../controller/call-controller');

const router = express.Router();
router.post('/save', callController.saveCall);
router.post('/update', callController.updateCall);
router.get('/', callController.getCalls);

module.exports = router;
