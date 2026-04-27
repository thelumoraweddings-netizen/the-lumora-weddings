const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const EmailService = require('../services/emailService');
const NotificationService = require('../services/notificationService');

/**
 * HIGH PRIORITY RELIABILITY TEST SCRIPT
 * This script verifies your Email (Gmail) and WhatsApp (Twilio) connectivity.
 * Run this to ensure your notifications are correctly configured.
 */

async function runTests() {
  console.log('--- 🛡️  RELIABILITY AUDIT: NOTIFICATION TEST ---');
  
  const testData = {
    name: "TESTING SYSTEM",
    email: "test@lumoraweddings.com",
    phone: "+91 0000000000",
    date: "SYSTEM_TEST",
    location: "RELIABILITY_CHECK",
    message: "This is a priority test notification to ensure your booking form delivery is active."
  };

  console.log('\n[1/2] Testing Email Delivery...');
  const emailResult = await EmailService.sendInquiryEmail(testData);
  if (emailResult) {
    console.log('✅ EMAIL SUCCESS: Your SMTP settings are correct.');
  } else {
    console.error('❌ EMAIL FAILED: Check your EMAIL_USER and EMAIL_PASS (App Password).');
  }

  console.log('\n[2/2] Testing WhatsApp Delivery...');
  const waResult = await NotificationService.sendWhatsAppNotification(testData);
  if (waResult) {
    console.log('✅ WHATSAPP SUCCESS: Your Twilio settings are correct.');
  } else {
    console.error('❌ WHATSAPP FAILED: Check your TWILIO SID/TOKEN and SENDER number.');
  }

  console.log('\n--- 📜 JOURNAL STATUS ---');
  console.log('Check server/logs/notification_journal.log for the formal proof of delivery.');
}

runTests();
