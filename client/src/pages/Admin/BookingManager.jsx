import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, FileText, X } from 'lucide-react';
import api from '../../utils/api';
import './QuotationManager.css'; // Reusing the modern table styles from Quotations

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/api/bookings');
                setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="qm-container">
            <header className="qm-header">
                <div>
                    <h1 className="qm-title">Client Leads</h1>
                    <p className="qm-subtitle">Manage inquiries from the "Book Us" form</p>
                </div>
            </header>

            <main className="qm-main">
                <div className="qm-table-container">
                    <table className="qm-table">
                        <thead>
                            <tr>
                                <th>Date Received</th>
                                <th>Client Details</th>
                                <th>Event Info</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="qm-empty-state">
                                        <div className="qm-spinner" style={{ margin: '0 auto 15px' }} />
                                        <p>Loading leads...</p>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="qm-empty-state">
                                        <FileText size={48} />
                                        <p>No client inquiries found.</p>
                                    </td>
                                </tr>
                            ) : bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>
                                        <div className="qm-td-val">{new Date(booking.timestamp || booking.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        <div className="qm-td-sub">{new Date(booking.timestamp || booking.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td>
                                        <div className="qm-td-val" style={{ fontWeight: 600 }}>{booking.name}</div>
                                        <div className="qm-td-sub" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <a href={`tel:${booking.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}><Phone size={11} /> {booking.phone}</a>
                                            <a href={`mailto:${booking.email}`} style={{ color: 'inherit', textDecoration: 'none' }}><Mail size={11} /> {booking.email}</a>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="qm-td-val">{booking.eventType}</div>
                                        <div className="qm-td-sub" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <Calendar size={11} />
                                            {booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="qm-td-val" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <MapPin size={12} /> {booking.location || 'Not Specified'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="qm-actions">
                                            <button className="qm-action-btn" title="View Full Details" onClick={() => setSelectedBooking(booking)}>
                                                <FileText size={16} /> View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Details Modal */}
            {selectedBooking && (
                <div className="qm-modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="qm-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className="qm-modal-header">
                            <h2>Lead Details</h2>
                            <button className="qm-modal-close" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
                        </div>
                        <div className="qm-modal-body" style={{ padding: '30px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Client Name</h4>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#002D24' }}>{selectedBooking.name}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Contact Info</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{selectedBooking.phone}</p>
                                    <p style={{ margin: '3px 0 0', fontSize: '14px', color: '#333' }}>{selectedBooking.email}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Event Type</h4>
                                    <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>{selectedBooking.eventType}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Event Date</h4>
                                    <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>{selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified'}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Location</h4>
                                    <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>{selectedBooking.location}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>Message / Requirements</h4>
                                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', fontSize: '14px', color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                        {selectedBooking.message || 'No additional message provided.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManager;
