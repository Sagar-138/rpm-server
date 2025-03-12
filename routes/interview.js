const express = require('express');
const { scheduleInterview } = require('../controllers/interviewController');
const router = express.Router();

router.post('/', scheduleInterview);

module.exports = router;
