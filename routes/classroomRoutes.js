const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// Middleware for authentication/authorization can be added here
// const { authenticate, authorize } = require('../middleware/auth');

// Create a new classroom
router.post('/', classroomController.createClassroom);

// Get all classrooms
router.get('/', classroomController.getAllClassrooms);

// Get a single classroom by ID
router.get('/:id', classroomController.getClassroomById);

// Update a classroom
router.put('/:id', classroomController.updateClassroom);

// Delete a classroom
router.delete('/:id', classroomController.deleteClassroom);

module.exports = router;
