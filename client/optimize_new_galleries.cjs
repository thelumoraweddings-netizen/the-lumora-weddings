const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_DIRECTORIES = [
  'public/images/MATERNITY NEW',
  'public/images/PREWEDDING NEW',
  'public/images/BABYSHOWER NEW'
];

const MAX_DIMENSION = 2500;
const JPEG_QUALITY = 82;

function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllImages(filePath, fileList);
    } else {
      if (/\.(jpe?g)$/i.test(file)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

async function optimizeImages() {
  console.log('--- THE LUMORA WEDDINGS: Gallery Optimization ---');
  let totalSaved = 0;
  let count = 0;

  let allImages = [];
  TARGET_DIRECTORIES.forEach(dir => {
    if (fs.existsSync(dir)) {
      allImages = allImages.concat(getAllImages(dir));
    } else {
      console.warn(`Directory not found: ${dir}`);
    }
  });

  console.log(`Found ${allImages.length} images to optimize.`);

  for (const imgPath of allImages) {
    try {
      const stats = fs.statSync(imgPath);
      const originalSize = stats.size;
      const tempPath = imgPath + '.tmp';

      await sharp(imgPath)
        .rotate() 
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
        .toFile(tempPath);

      const optimizedStats = fs.statSync(tempPath);
      
      if (optimizedStats.size < originalSize) {
        fs.renameSync(tempPath, imgPath);
        const saved = originalSize - optimizedStats.size;
        totalSaved += saved;
        count++;
        console.log(`[${count}/${allImages.length}] Optimized: ${imgPath} (-${(saved / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log(`[${count}/${allImages.length}] Scanned: ${imgPath} (Already optimized)`);
      }
    } catch (err) {
      console.error(`Error optimizing ${imgPath}:`, err.message);
    }
  }

  console.log('\n--- Optimization Complete ---');
  console.log(`Total Images Processed: ${count}`);
  console.log(`Total Space Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
