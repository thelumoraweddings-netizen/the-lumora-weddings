const axios = require('axios');
async function test() {
  try {
    let res = await axios.get('https://thelumoraweddings.onrender.com/api/debug-db');
    console.log(res.data);
  } catch (err) {
    console.error(err.message);
  }
}
test();
