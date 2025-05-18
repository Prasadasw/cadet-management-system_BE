const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 
const cadetController = require('../controllers/cadetController');

router.post(
  '/',
  [
    check('parentEmail').isEmail().withMessage('Valid parent email required'),
    check('parentFullName').notEmpty(),
    check('parentContactNumber').isMobilePhone(),
  ],
  cadetController.createCadet
);

// Create cadet
router.post('/create', cadetController.createCadet);

// Get all cadets
router.get('/', cadetController.getAllCadets);

// Get cadets by battalion
router.get('/battalion/:battalionId', cadetController.getCadetsByBattalion);

// Get cadet by ID
router.get('/:id', cadetController.getCadet);

// Update cadet by ID
router.put('/:id', cadetController.updateCadet);

// Get cadet by chest number
router.get('/chest/:chestNumber', cadetController.getCadetByChestNumber);

module.exports = router;
