const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

// Hostel Routes
// Create a new hostel
router.post('/create', hostelController.createHostel);

// Get all hostels
router.get('/', hostelController.getAllHostels);

// Create a new room
router.post('/rooms/create', hostelController.createRoom);

// Allocate a cadet to a room
router.post('/rooms/allocate', hostelController.allocateCadetToRoom);

// Issue an item to a cadet
router.post('/items/issue', hostelController.issueItemToCadet);

// Mark hostel attendance
router.post('/attendance/mark', hostelController.markHostelAttendance);

// Generate hostel reports
router.get('/reports', hostelController.generateReports);

// Get rooms for a specific hostel
router.get('/:hostelId/rooms', hostelController.getRoomsByHostel);

module.exports = router;
