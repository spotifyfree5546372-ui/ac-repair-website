const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.get('/new', requireAuth, bookingController.getNewBooking);
router.post('/new', requireAuth, bookingController.postCreateBooking);
router.get('/confirmation', requireAuth, bookingController.getConfirmation);
router.get('/my-bookings', requireAuth, bookingController.getMyBookings);

module.exports = router;
