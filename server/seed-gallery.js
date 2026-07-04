const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const GalleryClient = require('./models/GalleryClient');

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Dynamically load ES6 galleryConfig.js by transforming to CommonJS
    const configPath = path.join(__dirname, '../client/src/utils/galleryConfig.js');
    const tempPath = path.join(__dirname, 'tempConfig.js');
    
    let configStr = fs.readFileSync(configPath, 'utf-8');
    configStr = configStr.replace('export const galleryCategories =', 'module.exports =');
    fs.writeFileSync(tempPath, configStr);

    const initialData = require('./tempConfig');
    fs.unlinkSync(tempPath);

    let clientsToInsert = [];

    initialData.forEach(cat => {
        let mappedCategoryId = cat.id;
        if (cat.id === 'maternity' || cat.id === 'baby-shower') mappedCategoryId = 'maternity-babyshower';
        if (cat.id === 'puberty') return; // Skip puberty

        if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
                clientsToInsert.push({
                    id: sub.id,
                    categoryId: mappedCategoryId,
                    name: sub.name,
                    title: sub.title,
                    description: sub.description,
                    content: sub.content || '',
                    coverImage: sub.image,
                    active: true,
                    images: sub.customNames 
                        ? sub.customNames.map(name => `/images/${sub.folder}/${name}`)
                        : Array.from({ length: sub.count || 0 }, (_, i) => `/images/${sub.folder}/${sub.prefix || ''}${i + 1}.jpg`)
                });
            });
        } else if (cat.folder) {
            clientsToInsert.push({
                id: `${mappedCategoryId}-default`,
                categoryId: mappedCategoryId,
                name: 'General Portfolio',
                title: cat.title,
                description: cat.description,
                content: '',
                coverImage: cat.image,
                active: true,
                images: Array.from({ length: cat.count || 0 }, (_, i) => `/images/${cat.folder}/${cat.prefix || ''}${i + 1}.jpg`)
            });
        }
    });

    console.log(`Prepared ${clientsToInsert.length} clients to insert.`);

    // Clear existing clients first
    await GalleryClient.deleteMany({});
    console.log('Cleared existing gallery clients from DB.');

    // Insert new
    await GalleryClient.insertMany(clientsToInsert);
    console.log('Successfully seeded Gallery data!');

    mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
