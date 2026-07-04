const axios = require('axios');

async function test() {
    try {
        console.log('Fetching vinosha client...');
        let res = await axios.get('http://localhost:5000/api/galleries/clients/vinosha-babyshower');
        console.log('Client:', res.data.name);
        console.log('Images:', res.data.images.slice(0, 5));
    } catch (err) {
        console.error(err.message);
    }
}
test();
