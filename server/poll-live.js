const { exec } = require('child_process');

function runTest() {
    console.log('Polling live server...');
    exec('node live-test.js', (err, stdout, stderr) => {
        console.log(stdout);
        if (stderr) console.error(stderr);
        
        if (stdout.includes('ALL TESTS PASSED SUCCESSFULLY!')) {
            console.log('\n✅ Server is FULLY OPERATIONAL!');
            process.exit(0);
        } else {
            console.log('Server still deploying or failed. Retrying in 15 seconds...');
            setTimeout(runTest, 15000);
        }
    });
}

runTest();
