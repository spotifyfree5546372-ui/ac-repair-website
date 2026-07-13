const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { sendBookingEmail } = require('../utils/email');

exports.getNewBooking = async (req, res) => {
  try {
    const services = await Service.find();
    const selectedServiceId = req.query.service || '';
    res.render('bookings/new', { 
      title: 'Book a Service', 
      services, 
      selectedServiceId, 
      error: null 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postCreateBooking = async (req, res) => {
  const { serviceId, bookingDate, bookingTimeSlot, address, contactPhone } = req.body;
  try {
    const services = await Service.find();
    if (!serviceId || !bookingDate || !bookingTimeSlot || !address || !contactPhone) {
      return res.render('bookings/new', { 
        title: 'Book a Service', 
        services, 
        selectedServiceId: serviceId, 
        error: 'All fields are required.' 
      });
    }

    const selectedService = await Service.findById(serviceId);
    if (!selectedService) {
      return res.render('bookings/new', { 
        title: 'Book a Service', 
        services, 
        selectedServiceId: serviceId, 
        error: 'Invalid service selected.' 
      });
    }

    const booking = await Booking.create({
      userId: req.session.user.id,
      userName: req.session.user.name,
      userEmail: req.session.user.email,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      bookingDate,
      bookingTimeSlot,
      address,
      contactPhone
    });

    // Trigger notification email in background (does not block client redirect)
    sendBookingEmail(booking).catch(err => console.error('Error in sendBookingEmail:', err));

    res.redirect(`/bookings/confirmation?id=${booking.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getConfirmation = async (req, res) => {
  const { id } = req.query;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).send('Booking not found.');
    }
    if (booking.userId !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(403).send('Access Denied.');
    }
    res.render('bookings/confirmation', { title: 'Booking Confirmed', booking });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.session.user.id);
    // Sort bookings: newest first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.render('bookings/my-bookings', { title: 'My Bookings', bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
