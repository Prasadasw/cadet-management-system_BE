const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const parentAuth = require('../middleware/parentAuth');

// Get cadet details for logged-in parent
router.get('/cadet', parentAuth, parentController.getCadetDetails);

// Get cadet details by parent email (without authentication)
router.post('/cadet-by-email', parentController.getCadetByParentEmail);

// Parent approval for outpass
router.patch('/outpass/:id/parent-approval', parentAuth, parentController.updateOutpassParentApproval);

module.exports = router;
