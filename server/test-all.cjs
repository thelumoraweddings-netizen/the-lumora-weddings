require('dotenv').config();
const NotificationService = require('./services/notificationService');

async function testAll() {
  console.log('--- 🛡️ THE LUMORA WEDDINGS: Final Dual-Alert Test ---');
  console.log(`WhatsApp: ${process.env.ADMIN_WHATSAPP_NUMBER}`);
  console.log(`Email: ${process.env.ADMIN_EMAIL_RECIPIENT}\n`);

  const mockBooking = {
    name: 'ZERO-FAIL TEST',
    email: 'admin@thelumoraweddings.com',
    phone: '9345849846',
    city: 'System Verification',
    venue: 'Final Check',
    date: new Date(),
    guestCount: '250',
    source: 'Dual-Alert Logic',
    message: 'If you receive this on BOTH WhatsApp and Email, your site is now professionally protected! 🥂💍✨'
  };

  try {
    console.log('Dispatching Dual Notifications in background...');
    await NotificationService.notifyAll(mockBooking);
    console.log('\n--- Test Finished ---');
    console.log('1. Check WhatsApp (Remember your 72h Sandbox).');
    console.log('2. Check your Business Email Inbox.');
    console.log('3. If you see both, you are 100% READY! ✅');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

testAll();
