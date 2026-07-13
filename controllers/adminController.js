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

exports.getTestEmail = async (req, res) => {
  try {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = process.env.SMTP_PORT || 587;
    const recipient = process.env.NOTIFICATION_EMAIL || 'sharozmohd786@gmail.com';

    if (!host || !user || !pass) {
      return res.send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #FFD3D3; background: #FFF5F5; border-radius: 8px; color: #D8000C;">
          <h2 style="margin-top:0;">⚠️ SMTP Configurations Missing in environment</h2>
          <p>Your environment variables are not loaded by Render yet.</p>
          <p><b>SMTP_HOST:</b> ${host ? 'Present' : 'MISSING'}</p>
          <p><b>SMTP_USER:</b> ${user ? 'Present' : 'MISSING'}</p>
          <p><b>SMTP_PASS:</b> ${pass ? 'Present' : 'MISSING'}</p>
          <p><b>NOTIFICATION_EMAIL:</b> ${recipient}</p>
          <p>Please double-check that you entered them correctly and clicked <b>"Save changes"</b> at the bottom of the Render Dashboard.</p>
        </div>
      `);
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
      connectionTimeout: 10000, // 10 seconds timeout
      family: 4 // Force IPv4 to bypass Render's lack of IPv6 support
    });

    await transporter.sendMail({
      from: `"Amaan AC Service Alerts" <${user}>`,
      to: recipient,
      subject: `🔔 Diagnostic Test Email`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #C3E6CB; background-color: #D4EDDA; color: #155724; border-radius: 8px;">
          <h3>✔ Email Alerts are working perfectly!</h3>
          <p>If you received this email, the website server on Render is communicating successfully with Gmail SMTP.</p>
        </div>
      `
    });

    res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #C3E6CB; background: #D4EDDA; border-radius: 8px; color: #155724;">
        <h2 style="margin-top:0;">✔ Email Dispatched Successfully!</h2>
        <p>A test email has been successfully sent to: <b>${recipient}</b></p>
        <p>Check your Inbox / Spam / Promotions tab right now!</p>
      </div>
    `);
  } catch (error) {
    res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #FFD3D3; background: #FFF5F5; border-radius: 8px; color: #D8000C;">
        <h2 style="margin-top:0;">❌ Email Dispatch Failed</h2>
        <p>Your server attempted to send the email, but it failed. Here is the exact error message from Google/Render:</p>
        <pre style="background: #211D1D; color: #FFD3D3; padding: 16px; border-radius: 6px; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${error.stack || error.message}</pre>
        <h3>🔍 Troubleshooting checklist:</h3>
        <ul>
          <li><b>Invalid Login (535-5.7.8):</b> Make sure you have 2-Step Verification enabled on your Google Account, and generated a new **App Password** (16 letters). Do not use your normal Google account password. Make sure the app password has no spaces.</li>
          <li><b>Connection Timeout / ESOCKET:</b> Render blocks outbound port 587 or is unable to connect. Change <b>SMTP_PORT</b> to <b>465</b> in your Render dashboard environment variables and save.</li>
        </ul>
      </div>
    `);
  }
};
