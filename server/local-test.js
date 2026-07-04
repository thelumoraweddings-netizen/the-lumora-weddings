const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

async function runTests() {
    console.log('--- STARTING LOCAL INTEGRATION TESTS ---');

    try {
        console.log('\n1. Pinging Local Server...');
        const res = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is ONLINE! Response:', res.data);
    } catch (err) {
        console.error('❌ Server is OFFLINE. Please start it using npm run dev.');
        console.error(err.message);
        return;
    }

    let bookingId = null;
    try {
        console.log('\n2. Testing "Book Us" Form Submission...');
        const mockData = {
            name: 'Integration Test Client',
            email: 'test@example.com',
            phone: '+91 9999999999',
            date: '2026-12-31',
            eventType: 'Wedding Photography',
            location: 'Test City',
            message: 'Integration testing the system.'
        };
        const res = await axios.post(`${BASE_URL}/api/bookings`, mockData);
        console.log('✅ Booking Submitted Successfully!');
    } catch (err) {
        console.error('❌ Booking Submission FAILED.', err.response?.data || err.message);
    }

    let quotationId = null;
    try {
        console.log('\n3. Testing Quotation Creation...');
        const quoteData = {
            clientName: 'Integration Test Client',
            clientEmail: 'test@example.com',
            clientPhone: '+91 9999999999',
            eventLocation: 'Test City',
            deliverables: { photos: true, videos: true, albums: true },
            pricing: { totalAmount: 150000, advanceAmount: 50000 }
        };
        const res = await axios.post(`${BASE_URL}/api/quotations`, quoteData, {
            headers: { Authorization: `Bearer ${TEST_TOKEN}` }
        });
        quotationId = res.data._id;
        console.log('✅ Quotation Created Successfully! ID:', quotationId);
    } catch (err) {
        console.error('❌ Quotation Creation FAILED.', err.response?.data || err.message);
    }

    if (quotationId) {
        try {
            console.log('\n4. Testing Quotation Status Update (Confirmed)...');
            const res = await axios.patch(`${BASE_URL}/api/quotations/${quotationId}/status`, { status: 'Confirmed' }, {
                headers: { Authorization: `Bearer ${TEST_TOKEN}` }
            });
            console.log('✅ Quotation Status Updated! Status:', res.data.status);
        } catch (err) {
            console.error('❌ Quotation Status Update FAILED.', err.response?.data || err.message);
        }

        try {
            console.log('\n5. Testing Work Allocation (Assignments)...');
            const assignments = [
                { eventName: 'Wedding', requirementName: 'Traditional', assignedTo: 'Siva', status: 'Pending' }
            ];
            const res = await axios.patch(`${BASE_URL}/api/quotations/${quotationId}/assignments`, { assignments }, {
                headers: { Authorization: `Bearer ${TEST_TOKEN}` }
            });
            console.log('✅ Work Allocation Updated! Assignments count:', res.data.assignments.length);
        } catch (err) {
            console.error('❌ Work Allocation Update FAILED.', err.response?.data || err.message);
        }

        try {
            console.log('\n6. Testing Payment Tracking...');
            const payments = [
                { amount: 50000, date: '2026-06-10', method: 'UPI', remarks: 'Advance' }
            ];
            const res = await axios.patch(`${BASE_URL}/api/quotations/${quotationId}/payments`, { payments }, {
                headers: { Authorization: `Bearer ${TEST_TOKEN}` }
            });
            console.log('✅ Payment Tracking Updated! Payments count:', res.data.payments.length);
        } catch (err) {
            console.error('❌ Payment Tracking Update FAILED.', err.response?.data || err.message);
        }
    }

    console.log('\n--- LOCAL TESTS COMPLETED ---');
    process.exit(0);
}

runTests();
