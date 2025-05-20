const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Register a new employee
router.post('/register', employeeController.registerEmployee);

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get single employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update employee
router.put('/:id', employeeController.updateEmployee);

// Delete employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
