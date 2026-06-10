import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, FileText, X, Clock, Info, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import './QuotationManager.css'; 
import './BookingManager.css'; // Add our new premium table styles

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);

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

    const handleDeleteClick = (id) => {
        setBookingToDelete(id);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await api.delete(`/api/bookings/${bookingToDelete}`);
            setBookings(bookings.filter(b => b._id !== bookingToDelete));
            setBookingToDelete(null);
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to delete lead. Please try again.');
            setBookingToDelete(null);
        }
    };

    return (
        <>
            <div className="qm-container">
                <header className="qm-header">
                    <div>
                        <h1 className="qm-page-title">Client Leads</h1>
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
                                    <th style={{ textAlign: 'center' }}>Actions</th>
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
                                            <div className="qm-td-sub" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <a href={`tel:${booking.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}><Phone size={11} /> {booking.phone}</a>
                                                <a href={`mailto:${booking.email}`} style={{ color: 'inherit', textDecoration: 'none' }}><Mail size={11} /> {booking.email}</a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="qm-td-val">{booking.eventType}</div>
                                            <div className="qm-td-sub" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                <Calendar size={11} />
                                                {booking.date 
                                                    ? (!isNaN(new Date(booking.date).getTime()) 
                                                        ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                                        : booking.date)
                                                    : 'TBD'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="qm-td-val" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                <MapPin size={12} /> {booking.location || 'Not Specified'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="qm-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button className="qm-btn-outline" title="View Full Details" onClick={() => setSelectedBooking(booking)}>
                                                    <FileText size={14} /> View Details
                                                </button>
                                                <button className="qm-btn-outline" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Delete Lead" onClick={() => handleDeleteClick(booking._id)}>
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Details Modal (Moved outside qm-container so position:fixed works perfectly) */}
            {selectedBooking && (
                <div className="qm-modal-overlay" style={{ zIndex: 999999 }} onClick={() => setSelectedBooking(null)}>
                    <div className="qm-modal qm-modal-premium-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
                        
                        <div className="qm-modal-header-premium">
                            <h2>Lead Details</h2>
                            <button className="qm-modal-close-premium" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
                        </div>
                        
                        <div className="qm-modal-body-premium">
                            <div className="qm-lead-detail-box">
                                <div className="qm-lead-detail-grid">
                                    <div>
                                        <div className="qm-detail-label"><FileText size={12}/> Client Name</div>
                                        <p className="qm-detail-value">{selectedBooking.name}</p>
                                    </div>
                                    <div>
                                        <div className="qm-detail-label"><Phone size={12}/> Contact Info</div>
                                        <p className="qm-detail-value">{selectedBooking.phone}</p>
                                        <p className="qm-detail-subvalue">{selectedBooking.email}</p>
                                    </div>
                                    <div>
                                        <div className="qm-detail-label"><Calendar size={12}/> Event Type</div>
                                        <p className="qm-detail-value">{selectedBooking.eventType}</p>
                                    </div>
                                    <div>
                                        <div className="qm-detail-label"><Clock size={12}/> Event Date</div>
                                        <p className="qm-detail-value">
                                            {selectedBooking.date 
                                                ? (!isNaN(new Date(selectedBooking.date).getTime()) 
                                                    ? new Date(selectedBooking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                                                    : selectedBooking.date)
                                                : 'Not specified'}
                                        </p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div className="qm-detail-label"><MapPin size={12}/> Location</div>
                                        <p className="qm-detail-value">{selectedBooking.location}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="qm-detail-label"><Info size={12}/> Message / Requirements</div>
                            <div className="qm-message-box">
                                {selectedBooking.message || 'No additional message provided by the client.'}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(0,45,36,0.08)', paddingTop: '24px' }}>
                                <a href={`tel:${selectedBooking.phone}`} className="qm-btn-save" style={{ textDecoration: 'none' }}><Phone size={14}/> Call Client</a>
                                <button className="qm-btn-outline" style={{ marginLeft: 'auto' }} onClick={() => setSelectedBooking(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {bookingToDelete && (
                <div className="qm-modal-overlay" style={{ zIndex: 999999 }} onClick={() => setBookingToDelete(null)}>
                    <div className="qm-modal qm-modal-premium-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px 24px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete Lead</h3>
                        <p style={{ margin: '0 0 24px', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                            Are you sure you want to permanently delete this lead? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button className="qm-btn-outline" onClick={() => setBookingToDelete(null)} style={{ flex: 1 }}>Cancel</button>
                            <button className="qm-btn-save" onClick={confirmDelete} style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444', color: 'white' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingManager;
