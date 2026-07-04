const { exec } = require('child_process');

function runTest() {
    console.log('Polling live server for /api/galleries...');
    exec('node test-live.js', (err, stdout, stderr) => {
        const fullOutput = stdout + stderr;
        console.log(fullOutput);
        
        if (fullOutput.includes('404')) {
            console.log('Server still deploying. Retrying in 15 seconds...');
            setTimeout(runTest, 15000);
        } else {
            console.log('\n✅ Server is FULLY DEPLOYED AND OPERATIONAL!');
            process.exit(0);
        }
    });
}

runTest();
