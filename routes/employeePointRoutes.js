
const express = require('express');
const router = express.Router();
const pointController = require('../controllers/employeePointController');

router.post('/add', pointController.addPoint);

// Update
router.put('/update/:id', pointController.updatePoint);

// Delete
router.delete('/delete/:id', pointController.deletePoint);

// Get point history for an employee
router.get('/history/:employeeId', pointController.getPointHistory);

module.exports = router;
