import api from '../utils/api';

const compressImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return file;
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    },
                    'image/jpeg',
                    0.85
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};

const galleryService = {
    // ---- CATEGORIES ----
    getCategories: async () => {
        const res = await api.get('/api/galleries/categories');
        return res.data;
    },

    // ---- CLIENTS ----
    getClientsByCategory: async (categoryId) => {
        const res = await api.get(`/api/galleries/categories/${categoryId}/clients`);
        return res.data;
    },

    getClientById: async (clientId) => {
        const res = await api.get(`/api/galleries/clients/${clientId}`);
        return res.data;
    },

    createClient: async (clientData, coverFile) => {
        const formData = new FormData();
        Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
        if (coverFile) {
            const compressed = await compressImage(coverFile);
            formData.append('coverImage', compressed);
        }
        
        const res = await api.post('/api/galleries/clients', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    updateClient: async (clientId, clientData, coverFile) => {
        const formData = new FormData();
        Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
        if (coverFile) {
            const compressed = await compressImage(coverFile);
            formData.append('coverImage', compressed);
        }
        
        const res = await api.put(`/api/galleries/clients/${clientId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    deleteClient: async (clientId) => {
        const res = await api.delete(`/api/galleries/clients/${clientId}`);
        return res.data;
    },

    // ---- IMAGES ----
    uploadImages: async (clientId, files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const compressed = await compressImage(files[i]);
            formData.append('images', compressed);
        }
        
        const res = await api.post(`/api/galleries/clients/${clientId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    deleteImage: async (clientId, imageUrl) => {
        const res = await api.delete(`/api/galleries/clients/${clientId}/images`, { data: { imageUrl } });
        return res.data;
    }
};

export default galleryService;
