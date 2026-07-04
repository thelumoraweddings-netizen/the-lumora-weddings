import api from '../utils/api';

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
        const formData = new FormData();
        Object.keys(clientData).forEach(key => formData.append(key, clientData[key]));
        if (coverFile) formData.append('coverImage', coverFile);
        
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
        files.forEach(file => formData.append('images', file));
        
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
