const express = require('express');
const router = express.Router();
const cadetController = require('../controllers/cadetController');

// Create cadet
router.post('/create', cadetController.createCadet);

// Get all cadets
router.get('/', cadetController.getAllCadets);

// Get cadet by ID
router.get('/:id', cadetController.getCadet);

// Update cadet by ID
router.put('/:id', cadetController.updateCadet);

// Get cadet by chest number
router.get('/chest/:chestNumber', cadetController.getCadetByChestNumber);

module.exports = router;
