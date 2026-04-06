const axios = require('axios');

async function testSubmit() {
    try {
        console.log('Sending test inquiry...');
        const response = await axios.post('http://127.0.0.1:5000/api/bookings', {
            name: "DEBUG TEST",
            email: "mithunchakravarthi256@gmail.com",
            phone: "+91 9629551822",
            city: "Coimbatore",
            venue: "Debug Venue",
            date: "2026-04-08",
            guestCount: "1",
            source: "Debug",
            message: "Testing for server crash."
        });
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Server Error:', error.response.status, error.response.data);
        } else {
            console.error('Connection Error:', error.message);
        }
    }
}

testSubmit();
