const express = require('express');
const router = express.Router();
const outpassController = require('../controllers/outpassController');
// Temporarily disabled authentication for development
// const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Create outpass (Admin only)
router.post('/', 
  // authenticate, 
  // authorizeRoles('Admin'), 
  outpassController.createOutpass
);

// Parent approval
router.patch('/:id/parent-approval', 
  // authenticate, 
  // authorizeRoles('Parent'), 
  outpassController.parentApproval
);

// Admin final status
router.patch('/:id/admin-status', 
  // authenticate, 
  // authorizeRoles('Admin'), 
  outpassController.adminUpdateStatus
);

// Update outpass times
router.patch('/:id/times', 
  // authenticate, 
  // authorizeRoles('Admin'), 
  outpassController.updateOutpassTimes
);

// Get all outpasses for a cadet
router.get('/cadet/:cadetId', 
  // authenticate, 
  outpassController.getCadetOutpasses
);
// Get all outpasses for a parent's cadet(s)
router.get('/:parentId/outpasses', 
  // authenticate, 
  outpassController.getParentCadetOutpasses
);

// Get all outpasses for a cadet
router.get('/cadet/:cadetId', 
  // authenticate, 
  outpassController.getCadetOutpasses
);
// Get single outpass
router.get('/:id', 
  // authenticate, 
  outpassController.getSingleOutpass
);

// Get all outpasses for a parent's cadet(s)
router.get('/:parentId/outpasses', 
  // authenticate, 
  outpassController.getParentCadetOutpasses
);

// List all outpasses with optional filtering
router.get('/', 
  // authenticate, 
  outpassController.listOutpasses
);

module.exports = router;
