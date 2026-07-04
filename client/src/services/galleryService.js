import api from '../utils/api';
import { galleryCategories as initialData } from '../utils/galleryConfig';

// A flag to easily switch between Mock LocalStorage Mode and Real API Mode
const USE_MOCK = true;

// Hardcode the 5 exact categories requested by the user
const EXACT_CATEGORIES = [
    { id: 'engagement', title: 'Engagement', description: 'The beautiful promise of a lifetime, captured in every glance.' },
    { id: 'wedding', title: 'Wedding / Reception', description: 'Cinematic storytelling of your most sacred union.' },
    { id: 'pre-post', title: 'Pre / Post Wedding', description: 'Natural light and breathtaking landscapes for your moments.' },
    { id: 'maternity-babyshower', title: 'Maternity / Baby Shower', description: 'Capturing the beautiful journey of motherhood.' },
    { id: 'baby-shoot', title: 'Baby Shoot', description: 'Capturing the joy of new beginnings and precious arrivals.' }
];

// Helper to seed initial data from config to localStorage if empty
const seedData = () => {
    // ALWAYS force the 5 EXACT categories requested so the admin panel is pristine
    localStorage.setItem('lumora_categories', JSON.stringify(EXACT_CATEGORIES));

    if (!localStorage.getItem('lumora_clients')) {
        let clients = [];
        initialData.forEach(cat => {
            // Map old category IDs to the new exact 5 category IDs
            let mappedCategoryId = cat.id;
            if (cat.id === 'maternity' || cat.id === 'baby-shower') mappedCategoryId = 'maternity-babyshower';
            if (cat.id === 'puberty') return; // Skip puberty as it's not in the requested 5

            if (cat.subCategories) {
                cat.subCategories.forEach(sub => {
                    clients.push({
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
                clients.push({
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
        localStorage.setItem('lumora_clients', JSON.stringify(clients));
    } else {
        // Migration for existing local storage data
        let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
        let changed = false;
        clients.forEach(c => {
            if (c.categoryId === 'maternity' || c.categoryId === 'baby-shower') {
                c.categoryId = 'maternity-babyshower';
                changed = true;
            }
        });
        if (changed) {
            localStorage.setItem('lumora_clients', JSON.stringify(clients));
        }
    }
};

if (USE_MOCK) {
    seedData();
}

// Convert File object to Base64 to store in LocalStorage
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const galleryService = {
    // ---- CATEGORIES ----
    getCategories: async () => {
        if (USE_MOCK) {
            return JSON.parse(localStorage.getItem('lumora_categories') || '[]');
        }
        const res = await api.get('/api/galleries/categories');
        return res.data;
    },

    // ---- CLIENTS ----
    getClientsByCategory: async (categoryId) => {
        if (USE_MOCK) {
            const clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            return clients.filter(c => c.categoryId === categoryId);
        }
        const res = await api.get(`/api/galleries/categories/${categoryId}/clients`);
        return res.data;
    },

    getClientById: async (clientId) => {
        if (USE_MOCK) {
            const clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            return clients.find(c => c.id === clientId);
        }
        const res = await api.get(`/api/galleries/clients/${clientId}`);
        return res.data;
    },

    createClient: async (clientData, coverFile) => {
        if (USE_MOCK) {
            let coverImageUrl = clientData.coverImage || '';
            if (coverFile) {
                coverImageUrl = await fileToBase64(coverFile);
            }
            const clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            const newClient = {
                ...clientData,
                id: `client-${Date.now()}`,
                coverImage: coverImageUrl,
                images: [],
                active: clientData.active !== undefined ? clientData.active : true,
                createdAt: new Date().toISOString()
            };
            clients.push(newClient);
            localStorage.setItem('lumora_clients', JSON.stringify(clients));
            return newClient;
        }
        
        // Real API upload with FormData
        const formData = new FormData();
        Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
        if (coverFile) formData.append('coverImage', coverFile);
        
        const res = await api.post('/api/galleries/clients', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    updateClient: async (clientId, clientData, coverFile) => {
        if (USE_MOCK) {
            let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            const index = clients.findIndex(c => c.id === clientId);
            if (index !== -1) {
                let coverImageUrl = clients[index].coverImage;
                if (coverFile) {
                    coverImageUrl = await fileToBase64(coverFile);
                }
                clients[index] = { ...clients[index], ...clientData, coverImage: coverImageUrl, updatedAt: new Date().toISOString() };
                localStorage.setItem('lumora_clients', JSON.stringify(clients));
                return clients[index];
            }
            throw new Error('Client not found');
        }

        const formData = new FormData();
        Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
        if (coverFile) formData.append('coverImage', coverFile);
        
        const res = await api.put(`/api/galleries/clients/${clientId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    deleteClient: async (clientId) => {
        if (USE_MOCK) {
            let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            clients = clients.filter(c => c.id !== clientId);
            localStorage.setItem('lumora_clients', JSON.stringify(clients));
            return { success: true };
        }
        const res = await api.delete(`/api/galleries/clients/${clientId}`);
        return res.data;
    },

    // ---- IMAGES ----
    uploadImages: async (clientId, files) => {
        if (USE_MOCK) {
            let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            const clientIndex = clients.findIndex(c => c.id === clientId);
            if (clientIndex === -1) throw new Error('Client not found');

            const base64Images = await Promise.all(files.map(f => fileToBase64(f)));
            clients[clientIndex].images = [...(clients[clientIndex].images || []), ...base64Images];
            localStorage.setItem('lumora_clients', JSON.stringify(clients));
            return clients[clientIndex];
        }

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        
        const res = await api.post(`/api/galleries/clients/${clientId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    deleteImage: async (clientId, imageUrl) => {
        if (USE_MOCK) {
            let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            const clientIndex = clients.findIndex(c => c.id === clientId);
            if (clientIndex !== -1) {
                clients[clientIndex].images = clients[clientIndex].images.filter(img => img !== imageUrl);
                localStorage.setItem('lumora_clients', JSON.stringify(clients));
                return clients[clientIndex];
            }
            throw new Error('Client not found');
        }
        
        const res = await api.delete(`/api/galleries/clients/${clientId}/images`, { data: { imageUrl } });
        return res.data;
    },
    
    reorderImages: async (clientId, newImagesArray) => {
        if (USE_MOCK) {
            let clients = JSON.parse(localStorage.getItem('lumora_clients') || '[]');
            const clientIndex = clients.findIndex(c => c.id === clientId);
            if (clientIndex !== -1) {
                clients[clientIndex].images = newImagesArray;
                localStorage.setItem('lumora_clients', JSON.stringify(clients));
                return clients[clientIndex];
            }
            throw new Error('Client not found');
        }
        
        const res = await api.put(`/api/galleries/clients/${clientId}/images/reorder`, { images: newImagesArray });
        return res.data;
    }
};

export default galleryService;
