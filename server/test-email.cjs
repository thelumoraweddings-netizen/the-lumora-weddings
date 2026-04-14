const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const EmailService = require('./services/emailService');

async function test() {
  console.log('--- Isolation Email Test ---');
  console.log(`Testing with User: ${process.env.EMAIL_USER}`);
  console.log(`Testing with Host: ${process.env.EMAIL_HOST}`);

  const mockBooking = {
    name: 'TEST ADMIN',
    email: 'test@thelumoraweddings.com',
    phone: '0000000000',
    city: 'System Check',
    venue: 'Isolation Test',
    date: new Date(),
    guestCount: '1',
    source: 'Backend Diagnostic',
    message: 'If you are reading this, your Zero-Fail Email system is 100% active! ✅'
  };

  try {
    const result = await EmailService.sendInquiryEmail(mockBooking);
    console.log(`\nTest Finished. Result: ${result ? 'SUCCESS ✅' : 'FAILURE ❌'}`);
    if (!result) {
      console.log('--- Troubleshooting Tip ---');
      console.log('1. Check if EMAIL_PASS is an "App Password" (if using 2FA).');
      console.log('2. Verify SMTP Host and Port (thelumoraweddings.com usually uses port 465 or 587).');
    }
  } catch (err) {
    console.error('Test Crashed:', err.message);
  }
}

test();
