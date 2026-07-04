const axios = require('axios');

async function test() {
    try {
        console.log('Fetching live API categories...');
        let res = await axios.get('https://the-lumora-weddings-1.onrender.com/api/galleries/categories');
        console.log('Categories:', res.data.map(c => c.id));
        
        console.log('\nFetching live API clients...');
        res = await axios.get('https://the-lumora-weddings-1.onrender.com/api/galleries/categories/maternity-babyshower/clients');
        console.log(`Found ${res.data.length} clients.`);

        if (res.data.length > 0) {
            let client = res.data[0];
            console.log(`\nFetching client ${client.id}...`);
            let res2 = await axios.get(`https://the-lumora-weddings-1.onrender.com/api/galleries/clients/${client.id}`);
            console.log(res2.data.images.slice(0,2));
        }

    } catch (err) {
        console.error(err.message);
        if (err.response) console.error(err.response.status);
    }
}
test();
