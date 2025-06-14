const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const classroomCadetController = require('../controllers/classroomCadetController');

// Middleware for validation
// const validateRequest = require('../middleware/validateRequest');

// Add cadet to classroom
router.post('/:classroomId/cadets', [
  param('classroomId').isInt().withMessage('Invalid classroom ID'),
  body('cadetId').isInt().withMessage('Cadet ID is required and must be a number'),
  body('academicYear')
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('Academic year must be in format YYYY-YYYY'),
  body('status')
    .optional()
    .isIn(['active', 'transferred', 'graduated', 'withdrawn'])
    .withMessage('Invalid status'),
  body('joinedDate')
    .optional()
    .isISO8601()
    .withMessage('Joined date must be a valid date (YYYY-MM-DD)'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  // validateRequest
], classroomCadetController.addCadetToClassroom);

// Get all cadets in a classroom
router.get('/:classroomId/cadets', [
  param('classroomId').isInt().withMessage('Invalid classroom ID'),
  // validateRequest
], classroomCadetController.getClassroomCadets);

// Update cadet's classroom allocation
router.put('/allocations/:allocationId', [
  param('allocationId').isInt().withMessage('Invalid allocation ID'),
  body('status')
    .optional()
    .isIn(['active', 'transferred', 'graduated', 'withdrawn'])
    .withMessage('Invalid status'),
  body('leftDate')
    .optional()
    .isISO8601()
    .withMessage('Left date must be a valid date (YYYY-MM-DD)'),
  body('newClassroomId')
    .optional()
    .isInt()
    .withMessage('New classroom ID must be a number'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  // validateRequest
], classroomCadetController.updateClassroomCadet);

// Remove cadet from classroom (soft delete)
router.delete('/allocations/:allocationId', [
  param('allocationId').isInt().withMessage('Invalid allocation ID'),
  body('status')
    .optional()
    .isIn(['transferred', 'graduated', 'withdrawn'])
    .withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  // validateRequest
], classroomCadetController.removeCadetFromClassroom);

module.exports = router;
