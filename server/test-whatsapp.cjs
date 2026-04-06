require('dotenv').config();
const NotificationService = require('./services/notificationService');

async function test() {
  console.log('--- WhatsApp Isolation Test ---');
  console.log('Sending mock inquiry...');

  const mockBooking = {
    name: 'TEST USER',
    email: 'test@example.com',
    phone: '9345849846',
    city: 'Chennai',
    venue: 'Taj Connemara',
    date: new Date(),
    guestCount: '250',
    source: 'Isolation Test',
    message: 'Testing if WhatsApp works in the background.'
  };

  try {
    const result = await NotificationService.sendWhatsAppNotification(mockBooking);
    console.log(`\nTest Finished. Result: ${result ? 'SUCCESS ✅' : 'FAILURE ❌'}`);
  } catch (err) {
    console.error('Test Crashed:', err.message);
  }
}

test();
