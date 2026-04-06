import React, { useState } from 'react';
import { Upload, Trash2, Edit } from 'lucide-react';
import { portfolioItems } from '../../utils/galleryData';
import './Admin.css';

const GalleryManager = () => {
    const [items, setItems] = useState(portfolioItems);

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="gallery-manager">
            <div className="manager-header">
                <button className="btn btn-primary"><Upload size={18} /> Upload New Photo</button>
            </div>

            <div className="manager-table-container glass">
                <table className="manager-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td><img src={item.image} alt="" className="table-img" /></td>
                                <td>{item.title}</td>
                                <td><span className="table-tag">{item.category}</span></td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn edit"><Edit size={16} /></button>
                                        <button className="action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GalleryManager;
