const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/employeeAttendanceController');

router.post('/mark', attendanceController.addAttendance);

// /api/employee-attendance/mark
module.exports = router;


