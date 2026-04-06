const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images');
const MIN_SIZE_BYTES = 1024 * 1024 * 1.5; // 1.5MB

async function optimizeFolder(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            await optimizeFolder(fullPath);
        } else if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
            if (stats.size > MIN_SIZE_BYTES) {
                console.log(`Optimizing: ${fullPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
                
                try {
                    const buffer = fs.readFileSync(fullPath);
                    const outputBuffer = await sharp(buffer)
                        .resize(2500, null, { withoutEnlargement: true })
                        .jpeg({ quality: 80, mozjpeg: true })
                        .toBuffer();

                    if (outputBuffer.length < stats.size) {
                        fs.writeFileSync(fullPath, outputBuffer);
                        console.log(`  Done! New size: ${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB`);
                    } else {
                        console.log(`  Skipped: Compression didn't reduce size enough.`);
                    }
                } catch (err) {
                    console.error(`  Error processing ${file}:`, err.message);
                }
            }
        }
    }
}

console.log('Starting In-Place Optimization...');
optimizeFolder(targetDir).then(() => console.log('All done! Site is now fully optimized.'));
