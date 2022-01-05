const express = require('express');

const meetController = require('../controller/meet-controller');

const router = express.Router();

router.post('/requestMeet', meetController.saveRequestMeet);
router.get('/', meetController.getMeet);

module.exports = router;