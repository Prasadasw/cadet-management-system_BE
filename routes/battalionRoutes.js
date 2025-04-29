const express = require('express');
const router = express.Router();
const battalionController = require('../controllers/battalionController');

// Get all battalions with stats
router.get('/', battalionController.getAllBattalions);

// Get battalion by ID with cadets and stats
router.get('/:id', battalionController.getBattalionById);

module.exports = router; 