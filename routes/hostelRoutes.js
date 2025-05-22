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

// Get all issued items
router.get('/items/issue', hostelController.getIssuedItems);

// Mark hostel attendance
router.post('/attendance/mark', hostelController.markHostelAttendance);

// Get attendance report
router.get('/attendance/report', hostelController.generateReports);

// Generate hostel reports (deprecated, kept for backward compatibility)
router.get('/reports', hostelController.generateReports);

// Get all cadets in a specific hostel
router.get('/:hostelId/cadets', hostelController.getCadetsByHostel);

// Get rooms for a specific hostel
router.get('/:hostelId/rooms', hostelController.getRoomsByHostel);

module.exports = router;
