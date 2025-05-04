const express = require('express');
const router = express.Router();
const battalionController = require('../controllers/battalionController');

// Get all battalions with stats
router.get('/', battalionController.getAllBattalions);

// Get battalion by ID with cadets and stats
router.get('/:id', battalionController.getBattalionById);

// Create a new battalion
router.post('/', battalionController.createBattalion);

// Update an existing battalion
router.put('/:id', battalionController.updateBattalion);

// Delete a battalion
router.delete('/:id', battalionController.deleteBattalion);

module.exports = router;