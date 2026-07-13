const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/dashboard', requireAdmin, adminController.getDashboard);
router.post('/assign-technician', requireAdmin, adminController.postAssignTechnician);
router.post('/update-status', requireAdmin, adminController.postUpdateStatus);

module.exports = router;
