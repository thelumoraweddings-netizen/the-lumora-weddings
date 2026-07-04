const axios = require('axios');

async function test() {
    console.log('Polling /api/debug-db...');
    try {
        const res = await axios.get('https://the-lumora-weddings-1.onrender.com/api/debug-db', { timeout: 10000 });
        console.log('✅ Server Responded:');
        console.log(res.data);
        process.exit(0);
    } catch (e) {
        if (e.response && e.response.status === 404) {
            console.log('Still serving old version (404). Retrying in 15 seconds...');
        } else {
            console.error('Error:', e.message);
        }
        setTimeout(test, 15000);
    }
}
test();
