const axios = require('axios');

const BASE_URL = 'https://the-lumora-weddings-1.onrender.com';
const TEST_TOKEN = 'fake-jwt-token';

async function runTests() {
    console.log('--- STARTING LIVE SERVER TESTS ---');

    // 1. Check if server is online
    try {
        console.log('\n1. Pinging Server...');
        const res = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is ONLINE! Response:', res.data);
    } catch (err) {
        console.error('❌ Server is OFFLINE or still building.');
        console.error(err.message);
        return;
    }

    // 2. Test Booking Submission
    let bookingId = null;
    try {
        console.log('\n2. Testing "Book Us" Form Submission...');
        const mockData = {
            name: 'Test Client ' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            phone: '+91 9999999999',
            date: '2026-12-31',
            eventType: 'Wedding Photography',
            location: 'Test Location, Test City',
            message: 'This is an automated test from the system.'
        };
        console.time('Booking POST');
        const res = await axios.post(`${BASE_URL}/api/bookings`, mockData);
        console.timeEnd('Booking POST');
        console.log('✅ Booking Submitted Successfully! Response:', res.data);
    } catch (err) {
        console.timeEnd('Booking POST');
        console.error('❌ Booking Submission FAILED.');
        console.error(err.response ? err.response.data : err.message);
        return;
    }

    // 3. Test Admin Panel Client Leads Fetching
    try {
        console.log('\n3. Testing Admin Panel Client Leads Fetch...');
        const res = await axios.get(`${BASE_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${TEST_TOKEN}` }
        });
        console.log(`✅ Admin Leads Fetched! Found ${res.data.length} leads.`);
        if (res.data.length > 0) {
            console.log('✅ Most recent lead:', res.data[0].name);
        }
    } catch (err) {
        console.error('❌ Admin Leads Fetch FAILED.');
        console.error(err.response ? err.response.data : err.message);
        return;
    }

    // 4. Test Quotations Fetching
    try {
        console.log('\n4. Testing Admin Panel Quotations Fetch...');
        const res = await axios.get(`${BASE_URL}/api/quotations`);
        console.log(`✅ Quotations Fetched! Found ${res.data.length} quotations.`);
    } catch (err) {
        console.error('❌ Quotations Fetch FAILED.');
        console.error(err.response ? err.response.data : err.message);
        return;
    }

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

runTests();
