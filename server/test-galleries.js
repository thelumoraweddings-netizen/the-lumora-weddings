const axios = require('axios');

async function test() {
    try {
        console.log('Fetching categories...');
        let res = await axios.get('http://localhost:5000/api/galleries/categories');
        console.log('Categories:', res.data.map(c => c.id));

        console.log('\nFetching maternity-babyshower clients...');
        res = await axios.get('http://localhost:5000/api/galleries/categories/maternity-babyshower/clients');
        console.log(`Found ${res.data.length} clients.`);
        res.data.forEach(c => console.log(`- ${c.name} (${c.id})`));
        
        console.log('\nAll good!');
    } catch (err) {
        console.error(err.message);
        if (err.response) console.error(err.response.data);
    }
}
test();
