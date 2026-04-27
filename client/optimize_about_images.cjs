const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'public/images/Koushik Img/DSC00815.jpg.jpeg',
  'public/images/meet-our-team/maari-selvam new.jpeg',
  'public/images/meet-our-team/maari-selvam.jpg',
  'public/images/meet-our-team/bharathi-raja.jpg',
  'public/images/meet-our-team/hari-krishnan.jpg',
  'public/images/meet-our-team/raja-rajan.jpg',
  'public/images/meet-our-team/santhosh-kumar.jpg',
  'public/images/meet-our-team/siva.jpg',
  'public/images/meet-our-team/tilak.jpg'
];

async function optimize() {
  console.log('--- Starting Image Optimization ---');
  let totalSaved = 0;

  for (const imgPath of images) {
    if (!fs.existsSync(imgPath)) {
      console.log(`Skipping: ${imgPath} (not found)`);
      continue;
    }

    const stats = fs.statSync(imgPath);
    const originalSize = stats.size;
    const backupPath = imgPath + '.original';

    // Backup original if it doesn't exist
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(imgPath, backupPath);
      console.log(`Backed up: ${imgPath} -> ${backupPath}`);
    }

    try {
      const isPng = imgPath.toLowerCase().endsWith('.png');
      const tempPath = imgPath + '.tmp';

      let pipeline = sharp(backupPath)
        .resize({
          width: 2000,
          height: 2000,
          fit: 'inside',
          withoutEnlargement: true
        });

      if (isPng) {
        pipeline = pipeline.png({ quality: 85, compressionLevel: 9 });
      } else {
        pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
      }

      await pipeline.toFile(tempPath);

      // Replace original with optimized version
      fs.renameSync(tempPath, imgPath);

      const newStats = fs.statSync(imgPath);
      const saved = originalSize - newStats.size;
      totalSaved += saved;

      console.log(`Optimized: ${imgPath}`);
      console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  New:      (${(newStats.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`  Reduction: ${((saved / originalSize) * 100).toFixed(1)}%`);
    } catch (err) {
      console.error(`Error processing ${imgPath}:`, err);
    }
  }

  console.log('--- Finished ---');
  console.log(`Total Space Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
