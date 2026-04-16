const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending professionally formatted inquiry emails.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // This resolves the 'self-signed certificate' error common in some hosting environments
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 15000      // 15 seconds
    });
  }

  /**
   * Send a highly-formatted inquiry email to the admin.
   */
  async sendInquiryEmail(booking) {
    const adminEmail = process.env.ADMIN_EMAIL_RECIPIENT || "thelumoraweddings@gmail.com";
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('[Email Error] Credentials missing in .env. Skipping email notification.');
      return false;
    }

    const mailOptions = {
      from: `"THE LUMORA WEDDINGS" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `✨ New Inquiry: ${booking.name || 'Unknown Client'}`,
      html: `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; border-top: 5px solid #d4af37; background-color: #fdfdfd; color: #1a1a1a;">
          <h2 style="text-align: center; color: #1a1a1a; letter-spacing: 2px;">THE LUMORA WEDDINGS</h2>
          <hr style="border: 0.5px solid #d4af37; width: 60%; margin: 20px auto;" />
          <h3 style="color: #4a4a4a; text-transform: uppercase; font-size: 14px; text-align: center;">New Cinematic Inquiry Received</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Client Name:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Email Address:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.email || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Contact Number:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>City of Event:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.city || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Venue:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.venue || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Event Date(s):</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.date || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Guest Count:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.guestCount || '0'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee;"><strong>Found Us Via:</strong></td>
              <td style="padding: 12px 0; border-bottom: 0.5px solid #eeeeee; text-align: right;">${booking.source || 'N/A'}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-left: 20px solid #d4af37;">
            <p style="margin: 0; font-style: italic; color: #555;">"${booking.message || 'No additional message was provided.'}"</p>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #999; font-size: 11px;">
            This inquiry was automatically processed by THE LUMORA WEDDINGS booking system.
          </div>
        </div>
      `,
    };

    try {
      console.log(`[Email Dispatch] Sending inquiry to: ${adminEmail}`);
      await this.transporter.sendMail(mailOptions);
      console.log(`[Email Success] Inquiry email delivered successfully.`);
      return true;
    } catch (error) {
      console.error(`[Email Error] Failed to send email: ${error.message}`);
      return false;
    }
  }
}

module.exports = new EmailService();
