const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

async function optimize(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await optimize(fullPath);
        } else if (item.match(/\.(jpg|jpeg|png)$/i)) {
            const tempPath = fullPath + '.tmp';
            try {
                const originalSize = stat.size;

                await sharp(fullPath)
                    .jpeg({ quality: 85, progressive: true, force: false })
                    .png({ quality: 8, compressionLevel: 9, force: false })
                    .toFile(tempPath);

                const newSize = fs.statSync(tempPath).size;

                if (newSize < originalSize) {
                    fs.unlinkSync(fullPath);
                    fs.renameSync(tempPath, fullPath);
                    console.log(`Optimized: ${path.relative(baseDir, fullPath)} (${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB)`);
                } else {
                    fs.unlinkSync(tempPath);
                    console.log(`Skipped (already optimized): ${path.relative(baseDir, fullPath)}`);
                }
            } catch (err) {
                console.error(`Error optimizing ${fullPath}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }
}

optimize(baseDir).then(() => {
    console.log('Optimization complete.');
}).catch(console.error);
