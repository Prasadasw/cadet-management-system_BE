const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const cadetMobileSubmissionController = require('../controllers/cadetMobileSubmissionController');
// const auth = require('../middleware/auth');

// Add a new cadet mobile submission record
router.post(
  '/add',
  [
    body('cadetId').notEmpty().withMessage('Cadet ID is required'),
    body('cadetName').notEmpty().withMessage('Cadet name is required'),
    body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
    body('mobileSubmission').optional().isBoolean().withMessage('Mobile submission must be a boolean'),
    body('mobileReturn').optional().isBoolean().withMessage('Mobile return must be a boolean'),
    body('note').optional().isString().withMessage('Note must be a string'),
  ],
  cadetMobileSubmissionController.addCadetMobileSubmission
);

// Update an existing cadet mobile submission record
router.put(
  '/update/:id',
  [
    param('id').isUUID().withMessage('Valid submission ID is required'),
    body('cadetName').optional().isString().withMessage('Cadet name must be a string'),
    body('mobileSubmission').optional().isBoolean().withMessage('Mobile submission must be a boolean'),
    body('mobileReturn').optional().isBoolean().withMessage('Mobile return must be a boolean'),
    body('note').optional().isString().withMessage('Note must be a string'),
  ],
  cadetMobileSubmissionController.updateCadetMobileSubmission
);

// Get cadet mobile submission record by ID
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid submission ID is required'),
  ],
  cadetMobileSubmissionController.getCadetMobileSubmissionById
);

// Get cadet mobile submission record for a specific cadet and date
router.get(
  '/cadet/:cadetId',
  [
    param('cadetId').notEmpty().withMessage('Cadet ID is required'),
    query('date').isISO8601().withMessage('Valid date query parameter is required (YYYY-MM-DD)')
  ],
  cadetMobileSubmissionController.getCadetMobileSubmission
);

// Get all cadet mobile submissions for a specific date
router.get(
  '/date/all',
  [
    query('date').isISO8601().withMessage('Valid date query parameter is required (YYYY-MM-DD)')
  ],
  cadetMobileSubmissionController.getCadetMobileSubmissionsByDate
);

// Get all cadet mobile submissions
router.get(
  '/',
  cadetMobileSubmissionController.getAllCadetMobileSubmissions
);

// Delete a cadet mobile submission record
router.delete(
  '/delete/:id',
  [
    param('id').isUUID().withMessage('Valid submission ID is required'),
  ],
  cadetMobileSubmissionController.deleteCadetMobileSubmission
);

module.exports = router;