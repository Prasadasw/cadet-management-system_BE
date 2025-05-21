const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/employeeAttendanceController');

// GET /api/employee-attendance?date=YYYY-MM-DD
router.get('/', attendanceController.getAttendanceByDate);

// POST /api/employee-attendance/mark
router.post('/mark', attendanceController.addAttendance);

module.exports = router;
