const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Mark attendance for multiple cadets
router.post('/mark', attendanceController.markAttendance);

// Get attendance by date
router.get('/date/:date', attendanceController.getAttendanceByDate);

// Get attendance history for a cadet
router.get('/cadet/:cadetId', attendanceController.getCadetAttendanceHistory);

module.exports = router; 