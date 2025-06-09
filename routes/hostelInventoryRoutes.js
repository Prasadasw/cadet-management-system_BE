const express = require('express');
const router = express.Router();
const hostelInventoryController = require('../controllers/hostelInventoryController');

// Create a new inventory item for a hostel
router.post('/', hostelInventoryController.createInventoryItem);

// Get all inventory items
router.get('/', hostelInventoryController.getAllInventoryItems);

// Get inventory items by hostel ID
router.get('/hostel/:hostelId', hostelInventoryController.getInventoryItemsByHostel);

// Get a single inventory item by ID
router.get('/:id', hostelInventoryController.getInventoryItemById);

// Update an inventory item
router.put('/:id', hostelInventoryController.updateInventoryItem);

// Delete an inventory item
router.delete('/:id', hostelInventoryController.deleteInventoryItem);

module.exports = router;