const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const emailService = require('./services/emailService');

async function test() {
  console.log("Testing email...");
  const booking = {
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    city: "Test City",
    venue: "Test Venue",
    date: "20-06-2026",
    guestCount: "100",
    source: "Testing",
    message: "This is a test message"
  };
  const result = await emailService.sendInquiryEmail(booking);
  console.log("Result:", result);
}
test();
