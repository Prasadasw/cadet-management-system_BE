// routes/classroomRoutineAttendanceRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const classroomRoutineAttendanceController = require('../controllers/classroomRoutineAttendanceController');

// Mark attendance for multiple cadets in a routine
router.post('/:routineId/mark', [
  param('routineId').isInt().withMessage('Valid routine ID is required'),
  body('markedById').isInt().withMessage('User ID is required'),
  body('attendanceData').isArray().withMessage('Attendance data array is required'),
  body('attendanceData.*.cadetId').isInt().withMessage('Cadet ID is required'),
  body('attendanceData.*.status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status'),
  body('attendanceData.*.remarks').optional().isString()
], classroomRoutineAttendanceController.markAttendance);

// Get attendance for a specific routine
router.get('/routine/:routineId', [
  param('routineId').isInt().withMessage('Valid routine ID is required')
], classroomRoutineAttendanceController.getRoutineAttendance);

// Get attendance report with filters
router.get('/report', [
  query('startDate').optional().isDate(),
  query('endDate').optional().isDate(),
  query('classroomId').optional().isInt(),
  query('routineId').optional().isInt(),
  query('cadetId').optional().isInt(),
  query('status').optional().isIn(['present', 'absent', 'late', 'excused'])
], classroomRoutineAttendanceController.getAttendanceReport);

// Get attendance summary
router.get('/summary', [
  query('classroomId').optional().isInt(),
  query('startDate').optional().isDate(),
  query('endDate').optional().isDate()
], classroomRoutineAttendanceController.getAttendanceSummary);

module.exports = router;