const axios = require('axios');
const twilio = require('twilio');
const EmailService = require('./emailService');

/**
 * Notification Service
 * Handles sending notifications via WhatsApp and Email channels.
 */
class NotificationService {
  constructor() {
    // Initialize Twilio Client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      console.log('[NotificationService] Twilio credentials missing. Background sends disabled.');
    }
  }

  /**
   * Send WhatsApp notification via Twilio
   * This sends an automated background message to the admin.
   */
  async sendWhatsAppNotification(booking) {
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || "919345849846";
    const fromNumber  = process.env.TWILIO_WHATSAPP_FROM;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;

    console.log(`[WhatsApp Debug] Starting send to admin: ${adminNumber}`);

    // Lazy initialization if client is missing
    if (!this.client && accountSid && authToken) {
      console.log(`[WhatsApp Debug] Re-initializing Twilio client...`);
      this.client = twilio(accountSid, authToken);
    }

    if (!this.client) {
      console.error(`[WhatsApp Error] Twilio Client not initialized. Check Account SID and Auth Token in .env`);
      return false;
    }

    if (!fromNumber) {
      console.error(`[WhatsApp Error] TWILIO_WHATSAPP_FROM is missing in .env`);
      return false;
    }

    // Comprehensive message formatting
    const messageBody = `*New Inquiry: THE LUMORA WEDDINGS*\n` +
      `---------------------------------------\n` +
      `*Bride/Groom:* ${booking.name || 'N/A'}\n` +
      `*Email:* ${booking.email || 'N/A'}\n` +
      `*Phone:* +91 ${booking.phone || 'N/A'}\n` +
      `*City:* ${booking.city || 'N/A'}\n` +
      `*Venue:* ${booking.venue || 'N/A'}\n` +
      `*Date:* ${booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}\n` +
      `*Guests:* ${booking.guestCount || '0'}\n` +
      `*Source:* ${booking.source || 'Direct'}\n` +
      `*Story:* ${booking.message || 'No message provided'}`;

    const to = adminNumber.startsWith('whatsapp:') ? adminNumber : `whatsapp:+${adminNumber}`;
    const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;

    console.log(`[WhatsApp Debug] Sending FROM: ${from} TO: ${to}`);

    try {
      const response = await this.client.messages.create({
        body: messageBody,
        from: from,
        to: to
      });
      
      console.log(`[WhatsApp Success] Message sent! SID: ${response.sid}`);
      return true;
    } catch (error) {
      console.error(`[WhatsApp Error] Twilio API failure! Status: ${error.status} | Code: ${error.code} | Message: ${error.message}`);
      return false;
    }
  }

  /**
   * Send Email notification via Nodemailer
   */
  async sendEmailNotification(booking) {
    try {
      return await EmailService.sendInquiryEmail(booking);
    } catch (error) {
      console.error('[Email Dispatch Error]', error.message);
      return false;
    }
  }

  /**
   * Master function to send all notifications
   * Implements a retry loop (3 attempts) for the entire notification set.
   */
  async notifyAll(booking, attempts = 3) {
    for (let i = 1; i <= attempts; i++) {
      try {
        console.log(`[Notification Dispatch] Starting attempt ${i} of ${attempts}`);
        
        // Parallel execution ensures both arrive simultaneously
        const results = await Promise.allSettled([
          this.sendWhatsAppNotification(booking),
          this.sendEmailNotification(booking)
        ]);
        
        // We prioritize EMAIL success as requested by the user
        const emailSuccess = results[1].status === 'fulfilled' && results[1].value === true;
        const waSuccess = results[0].status === 'fulfilled' && results[0].value === true;
        
        if (emailSuccess) {
          if (!waSuccess) {
            console.warn(`[Notification Warning] Attempt ${i}: Email OK but WhatsApp failed.`);
          }
          console.log(`[Notification Success] Email delivered successfully on attempt ${i}`);
          return true;
        } else {
          console.warn(`[Notification Warning] Attempt ${i} failed for Email.`);
          if (i === attempts) {
            console.error('[Notification Final Error] Exhausted all retry attempts for Email.');
            return false;
          }
        }
      } catch (error) {
        console.error(`[Notification Critical Error] Attempt ${i} failed critically:`, error.message);
        if (i === attempts) return false;
      }
      
      // Brief delay before retry (e.g., 2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

module.exports = new NotificationService();
