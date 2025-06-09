const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const mobileSubmissionController = require('../controllers/mobileSubmissionController');
// const auth = require('../middleware/auth');

// Add a new mobile submission record
router.post(
  '/add',
  [
    
    body('cadetId').notEmpty().withMessage('Cadet ID is required'),
    body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
    body('morningSubmitted').optional().isBoolean().withMessage('morningSubmitted must be a boolean'),
    body('eveningReturned').optional().isBoolean().withMessage('eveningReturned must be a boolean'),
    body('note').optional().isString().withMessage('Note must be a string'),
  ],
  mobileSubmissionController.addMobileSubmission
);

// Update an existing mobile submission record
router.put(
  '/update/:id',
  [
  
    param('id').isUUID().withMessage('Valid submission ID is required'),
    body('morningSubmitted').optional().isBoolean().withMessage('morningSubmitted must be a boolean'),
    body('eveningReturned').optional().isBoolean().withMessage('eveningReturned must be a boolean'),
    body('note').optional().isString().withMessage('Note must be a string'),
  ],
  mobileSubmissionController.updateMobileSubmission
);

// Get mobile submission record for a specific cadet and date
router.get(
  '/:cadetId',
  [
  
    param('cadetId').notEmpty().withMessage('Cadet ID is required'),
    query('date').isISO8601().withMessage('Valid date query parameter is required (YYYY-MM-DD)')
  ],
  mobileSubmissionController.getMobileSubmission
);

module.exports = router;
