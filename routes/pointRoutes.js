const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');

// Add point
router.post('/add', pointController.addPoint);

// Get points by cadet
router.get('/:cadetId', pointController.getPointsByCadet);

// Delete point
router.delete('/:id', pointController.deletePoint);

module.exports = router;
