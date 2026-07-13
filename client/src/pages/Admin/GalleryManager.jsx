import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import galleryService from '../../services/galleryService';
import './GalleryManager.css';

const GalleryManager = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showClientModal, setShowClientModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    
    // Form state
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({ name: '', title: '', description: '', active: true });
    const [coverFile, setCoverFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image upload state
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (activeCategory) {
            loadClients(activeCategory.id);
        }
    }, [activeCategory]);

    const loadCategories = async () => {
        try {
            const cats = await galleryService.getCategories();
            setCategories(cats);
            if (cats.length > 0) {
                setActiveCategory(cats[0]);
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const loadClients = async (categoryId) => {
        setLoading(true);
        try {
            const data = await galleryService.getClientsByCategory(categoryId);
            setClients(data);
        } catch (error) {
            console.error('Failed to load clients', error);
        }
        setLoading(false);
    };

    const handleOpenClientModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name || '',
                title: client.title || '',
                description: client.description || '',
                active: client.active
            });
        } else {
            setEditingClient(null);
            setFormData({ name: '', title: '', description: '', active: true });
        }
        setCoverFile(null);
        setShowClientModal(true);
    };

    const handleSaveClient = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const dataToSave = { ...formData, categoryId: activeCategory.id };
            if (editingClient) {
                await galleryService.updateClient(editingClient.id, dataToSave, coverFile);
            } else {
                await galleryService.createClient(dataToSave, coverFile);
            }
            setShowClientModal(false);
            loadClients(activeCategory.id);
        } catch (error) {
            console.error('Failed to save client', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Error saving client: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Custom Confirm Modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const handleDeleteClient = (clientId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Client',
            message: 'Are you sure you want to delete this client? All images will also be removed. This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await galleryService.deleteClient(clientId);
                    loadClients(activeCategory.id);
                } catch (error) {
                    console.error('Failed to delete client', error);
                }
                setConfirmModal({ isOpen: false });
            }
        });
    };

    const handleOpenImageModal = (client) => {
        setEditingClient(client);
        setShowImageModal(true);
    };

    const handleUploadImages = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        try {
            const updatedClient = await galleryService.uploadImages(editingClient.id, files);
            setEditingClient(updatedClient);
            loadClients(activeCategory.id); // refresh list count
        } catch (error) {
            console.error('Failed to upload images', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Error uploading images: ${errorMsg}`);
        }
    };

    const handleDeleteImage = (imageUrl) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Image',
            message: 'Are you sure you want to delete this image? It will be permanently removed.',
            onConfirm: async () => {
                try {
                    const updatedClient = await galleryService.deleteImage(editingClient.id, imageUrl);
                    setEditingClient(updatedClient);
                } catch (error) {
                    console.error('Failed to delete image', error);
                }
                setConfirmModal({ isOpen: false });
            }
        });
    };

    return (
        <div className="gallery-manager-wrapper">
            <div className="gallery-header-top">
                <h2>Gallery Management</h2>
            </div>

            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`cat-tab ${activeCategory?.id === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            <div className="client-list-section">
                <div className="client-list-header">
                    <h3>Clients / Events in {activeCategory?.title}</h3>
                    <button className="btn-primary" onClick={() => handleOpenClientModal()}>
                        <Plus size={18} /> Add Client
                    </button>
                </div>

                <div className="manager-table-container">
                    <table className="manager-table">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Client / Event Name</th>
                                <th>Images</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5">Loading...</td></tr>
                            ) : clients.length === 0 ? (
                                <tr><td colSpan="5">No clients found for this category.</td></tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id}>
                                        <td>
                                            <img src={client.coverImage || '/placeholder.jpg'} alt={client.name} className="table-img" />
                                        </td>
                                        <td>
                                            <strong>{client.name}</strong>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--pg-muted)' }}>{client.title}</div>
                                        </td>
                                        <td>{client.images?.length || 0}</td>
                                        <td>
                                            <span className={`status-badge ${client.active ? 'active' : 'inactive'}`}>
                                                {client.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-btn image" title="Manage Images" onClick={() => handleOpenImageModal(client)}>
                                                    <ImageIcon size={18} />
                                                </button>
                                                <button className="action-btn edit" title="Edit Client" onClick={() => handleOpenClientModal(client)}>
                                                    <Edit size={18} />
                                                </button>
                                                <button className="action-btn delete" title="Delete Client" onClick={() => handleDeleteClient(client.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Client Form Modal */}
            {showClientModal && (
                <div className="gm-modal-overlay">
                    <div className="gm-modal">
                        <div className="gm-modal-header">
                            <h3>{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                            <button className="gm-close-btn" onClick={() => setShowClientModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSaveClient}>
                            <div className="gm-modal-body">
                                <div className="gm-form-group">
                                    <label>Client Name (Required)</label>
                                    <input 
                                        type="text" 
                                        className="gm-form-control" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="gm-form-group">
                                    <label>Display Title</label>
                                    <input 
                                        type="text" 
                                        className="gm-form-control" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                    />
                                </div>
                                <div className="gm-form-group">
                                    <label>Short Description</label>
                                    <textarea 
                                        className="gm-form-control" 
                                        rows="3"
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})} 
                                    />
                                </div>
                                <div className="gm-form-group">
                                    <label>Cover Image {editingClient && '(Leave empty to keep existing)'}</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="gm-form-control" 
                                        onChange={e => setCoverFile(e.target.files[0])} 
                                    />
                                </div>
                                <div className="gm-form-group">
                                    <label className="gm-checkbox-group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.active}
                                            onChange={e => setFormData({...formData, active: e.target.checked})}
                                        />
                                        Active (Visible on website)
                                    </label>
                                </div>
                            </div>
                            <div className="gm-modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowClientModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Manager Modal */}
            {showImageModal && editingClient && (
                <div className="gm-modal-overlay">
                    <div className="gm-modal large">
                        <div className="gm-modal-header">
                            <h3>Manage Images - {editingClient.name}</h3>
                            <button className="gm-close-btn" onClick={() => setShowImageModal(false)}><X /></button>
                        </div>
                        <div className="gm-modal-body">
                            <div 
                                className="gm-image-dropzone" 
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={32} style={{ marginBottom: '1rem' }} />
                                <div>Click to browse or drag and drop images here</div>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleUploadImages}
                                />
                            </div>

                            <div className="gm-image-grid">
                                {editingClient.images && editingClient.images.map((img, idx) => (
                                    <div key={idx} className="gm-image-item">
                                        <img src={img} alt={`Gallery ${idx}`} />
                                        <div className="gm-image-overlay">
                                            <button className="gm-delete-img-btn" onClick={() => handleDeleteImage(img)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {(!editingClient.images || editingClient.images.length === 0) && (
                                <div style={{ textAlign: 'center', color: 'var(--pg-muted)', padding: '2rem' }}>
                                    No images uploaded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Confirm Delete Modal */}
            {confirmModal.isOpen && (
                <div className="gm-modal-overlay" style={{ zIndex: 10000 }}>
                    <div className="gm-modal" style={{ maxWidth: '400px' }}>
                        <div className="gm-modal-header">
                            <h3 style={{ color: '#ea4335' }}>{confirmModal.title}</h3>
                            <button className="gm-close-btn" onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}><X /></button>
                        </div>
                        <div className="gm-modal-body">
                            <p style={{ color: 'var(--pg-text)' }}>{confirmModal.message}</p>
                        </div>
                        <div className="gm-modal-footer" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <button type="button" className="btn-secondary" onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}>Cancel</button>
                            <button type="button" className="btn-primary" style={{ background: '#ea4335' }} onClick={confirmModal.onConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
