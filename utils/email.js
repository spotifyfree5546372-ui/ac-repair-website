const nodemailer = require('nodemailer');

/**
 * Sends a detailed booking notification email to the administrator/technician.
 * @param {Object} booking - The booking document containing details.
 */
async function sendBookingEmail(booking) {
  // 1. Read environment variables
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.NOTIFICATION_EMAIL || 'sharozmohd786@gmail.com';

  // 2. Validate parameters gracefully
  if (!host || !user || !pass) {
    console.warn('⚠️ [Nodemailer Config Warning]: SMTP host, user, or password is missing in .env. Email notification was skipped.');
    console.log(`📝 [Simulated Booking Email for ${recipient}]:`);
    console.log(`   - Reference ID: ${booking.id}`);
    console.log(`   - Customer: ${booking.userName} (${booking.userEmail}, Phone: ${booking.contactPhone})`);
    console.log(`   - Service: ${booking.serviceName} (${booking.servicePrice})`);
    console.log(`   - Scheduled: ${booking.bookingDate} at ${booking.bookingTimeSlot}`);
    console.log(`   - Address: ${booking.address}`);
    return;
  }

  try {
    const dns = require('dns').promises;
    let smtpHost = host;
    
    // Explicitly resolve IPv4 to completely bypass Render's broken IPv6 network stack
    if (host === 'smtp.gmail.com') {
      try {
        const records = await dns.resolve4('smtp.gmail.com');
        if (records && records.length > 0) {
          smtpHost = records[0];
        }
      } catch (dnsErr) {
        console.error('DNS IPv4 Resolution failed, falling back to hostname:', dnsErr);
      }
    }

    // 3. Create mail transport client with forced IPv4 host and TLS servername override
    const transportConfig = {
      host: smtpHost,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
      tls: {
        // Ensure SSL certificates match the original host, not the resolved IP address
        servername: host === 'smtp.gmail.com' ? 'smtp.gmail.com' : undefined 
      }
    };

    const transporter = nodemailer.createTransport(transportConfig);

    // 4. Construct email message body
    const emailSubject = `🔔 New AC Service Booking - Ref: ${booking.id}`;
    const emailHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; background-color: #F5F1EC; padding: 30px; color: #211D1D; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(33, 29, 29, 0.15);">
        <h2 style="font-family: 'Bebas Neue', Impact, sans-serif; font-size: 28px; color: #F44B0D; margin-top: 0; margin-bottom: 20px; letter-spacing: 0.05em; text-transform: uppercase;">
          New AC Booking Received!
        </h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4F5055; margin-bottom: 24px;">
          A new service booking request has been placed on the website. Here are the customer and service details:
        </p>

        <div style="background-color: #FFFFFF; padding: 24px; border-radius: 8px; border: 1px solid rgba(33, 29, 29, 0.1); margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D; width: 140px;">Booking Ref:</td>
              <td style="padding: 8px 0; color: #F44B0D; font-weight: 700;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Service Name:</td>
              <td style="padding: 8px 0; color: #4F5055;">${booking.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Price:</td>
              <td style="padding: 8px 0; color: #4F5055; font-weight: 600;">${booking.servicePrice}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Scheduled Date:</td>
              <td style="padding: 8px 0; color: #4F5055;">${booking.bookingDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Time Slot:</td>
              <td style="padding: 8px 0; color: #4F5055;">${booking.bookingTimeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Customer Name:</td>
              <td style="padding: 8px 0; color: #4F5055;">${booking.userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Contact Phone:</td>
              <td style="padding: 8px 0; color: #4F5055;">
                <a href="tel:${booking.contactPhone}" style="color: #F44B0D; text-decoration: none; font-weight: 600;">${booking.contactPhone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D;">Customer Email:</td>
              <td style="padding: 8px 0; color: #4F5055;">${booking.userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #211D1D; vertical-align: top;">Service Address:</td>
              <td style="padding: 8px 0; color: #4F5055; line-height: 1.5;">${booking.address}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 10px;">
          <a href="https://www.amaanacservice.in/admin/dashboard" style="display: inline-block; background-color: #F44B0D; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 12px rgba(244,75,13,0.25);">
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    `;

    // 5. Send message
    await transporter.sendMail({
      from: `"Amaan AC Service Alerts" <${user}>`,
      to: recipient,
      subject: emailSubject,
      html: emailHtml
    });

    console.log(`✔ [Nodemailer Success]: Notification email sent successfully to ${recipient} for Booking Ref: ${booking.id}`);
  } catch (error) {
    console.error(`❌ [Nodemailer Error]: Failed to dispatch email to ${recipient}. Error detail:`, error);
  }
}

module.exports = { sendBookingEmail };
