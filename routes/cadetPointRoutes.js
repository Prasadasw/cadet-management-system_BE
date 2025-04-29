const express = require('express');
const router = express.Router();
const cadetPointController = require('../controllers/cadetPointController');

// Add points to a cadet
router.post('/:cadetId', cadetPointController.addPoints);

// Get points for a cadet
router.get('/:cadetId', cadetPointController.getCadetPoints);

module.exports = router; 