const Booking = require('../models/Booking');
const Technician = require('../models/Technician');

exports.getDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const technicians = await Technician.find();

    // Sort bookings: newest first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      assigned: bookings.filter(b => b.status === 'assigned').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    res.render('admin/dashboard', { 
      title: 'Admin Dashboard', 
      bookings, 
      technicians, 
      stats 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postAssignTechnician = async (req, res) => {
  const { bookingId, technicianId } = req.body;
  try {
    if (!bookingId || !technicianId) {
      return res.status(400).send('Booking ID and Technician ID are required.');
    }

    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res.status(404).send('Technician not found.');
    }

    const updatedBooking = await Booking.updateStatus(bookingId, 'assigned', technician.id, technician.name);
    if (!updatedBooking) {
      return res.status(404).send('Booking not found.');
    }

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postUpdateStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    if (!bookingId || !status) {
      return res.status(400).send('Booking ID and Status are required.');
    }

    const updatedBooking = await Booking.updateStatus(bookingId, status);
    if (!updatedBooking) {
      return res.status(404).send('Booking not found.');
    }

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
