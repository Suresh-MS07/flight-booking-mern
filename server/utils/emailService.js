const nodemailer = require('nodemailer');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]));

const sendTicketEmail = async (bookingDetails) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Ticket email skipped because email credentials are not configured');
    return;
  }

  try {
    // 1. Transporter Setup (Postman)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 2. Email Content (Ticket Design)
    const mailOptions = {
      from: `"SkyBooker ✈️" <${process.env.EMAIL_USER}>`,
      to: bookingDetails.email,
      subject: 'Booking Confirmed - Your Flight Ticket 🎟️',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #0d6efd;">✈️ Booking Confirmed!</h2>
          <p>Hi <strong>${escapeHtml(bookingDetails.passengerName)}</strong>,</p>
          <p>Thank you for booking with SkyBooker. Here are your flight details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; border: 1px solid #ddd;">Flight</th>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(bookingDetails.flightInfo.airline)} (${escapeHtml(bookingDetails.flightInfo.flightNumber)})</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">Route</th>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(bookingDetails.flightInfo.from)} ➝ ${escapeHtml(bookingDetails.flightInfo.to)}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(bookingDetails.flightInfo.date)}</td>
            </tr>
            <tr>
  <th style="padding: 10px; border: 1px solid #ddd;">Seat No</th>
  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #008cff;">
    ${escapeHtml(bookingDetails.flightInfo.seatNumber || "Check in at counter")}
  </td>
</tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${escapeHtml(bookingDetails.flightInfo.price)}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Safe Travels!</p>
          <p style="color: #888; font-size: 12px;">Team SkyBooker</p>
        </div>
      `
    };

    // 3. Email Send karein
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to " + bookingDetails.email);

  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

module.exports = sendTicketEmail;
