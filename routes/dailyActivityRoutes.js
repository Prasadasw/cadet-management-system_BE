const express = require('express');
const router = express.Router();
const dailyActivityController = require('../controllers/dailyActivityController');

// Create a new activity
router.post('/', dailyActivityController.createActivity);

// Get all activities
router.get('/', dailyActivityController.getAllActivities);

// Get activity by ID with attendance details
router.get('/:id', dailyActivityController.getActivityById);

// Mark attendance for cadets
router.post('/attendance', dailyActivityController.markAttendance);

// Get attendance report
router.get('/report/:activityId', dailyActivityController.getAttendanceReport);

module.exports = router; 