const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/employeeAttendanceController');

router.post('/mark', attendanceController.addAttendance);

module.exports = router;


