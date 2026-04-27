const axios = require('axios');

async function testSubmission() {
  console.log('--- Testing Booking Submission API ---');
  try {
    const testData = {
      name: "Mobile Test User",
      email: "mobile_test@example.com",
      phone: "+91 9999999999",
      city: "Mobile City",
      venue: "Mobile Venue",
      date: "2026-12-31",
      guestCount: "100",
      source: "Instagram",
      message: "This is a test submission from the CLI.",
      isdCode: "+91",
      location: "Mobile Venue, Mobile City",
      eventType: "Wedding Photography"
    };

    const response = await axios.post('http://localhost:5000/api/bookings', testData);
    
    console.log('Status Code:', response.status);
    console.log('Response Body:', response.data);
    
    if (response.data.success) {
      console.log('✅ Success! Submission received and logged.');
    } else {
      console.log('❌ Failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testSubmission();
