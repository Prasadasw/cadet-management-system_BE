// routes/classroomRoutineRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const classroomRoutineController = require('../controllers/classroomRoutineController');

// Create a new routine
router.post('/', [
  body('classroomId').isInt().withMessage('Classroom ID is required'),
  body('activity').notEmpty().withMessage('Activity is required'),
  body('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time is required (HH:MM)'),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid end time is required (HH:MM)'),
  body('notes').optional().isString()
], classroomRoutineController.createRoutine);

// Get routines with filters
router.get('/', [
  query('classroomId').optional().isInt(),
  query('startDate').optional().isDate(),
  query('endDate').optional().isDate(),
  query('date').optional().isDate()
], classroomRoutineController.getRoutines);

// Update a routine
router.put('/:id', [
  param('id').isInt(),
  body('activity').optional().notEmpty(),
  body('date').optional().isDate(),
  body('startTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('endTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled']),
  body('notes').optional().isString()
], classroomRoutineController.updateRoutine);

// Delete a routine
router.delete('/:id', [
  param('id').isInt()
], classroomRoutineController.deleteRoutine);

module.exports = router;