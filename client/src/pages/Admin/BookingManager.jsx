import React, { useEffect, useState } from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import axios from 'axios';
import './Admin.css';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="booking-manager">
            <div className="manager-table-container glass">
                <table className="manager-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Contact</th>
                            <th>Event Type</th>
                            <th>Event Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading inquiries...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No inquiries found.</td></tr>
                        ) : bookings.map(booking => (
                            <tr key={booking._id}>
                                <td className="client-cell">
                                    <strong>{booking.name}</strong>
                                </td>
                                <td>
                                    <div className="contact-icons">
                                        <Mail size={14} title={booking.email} style={{ cursor: 'pointer' }} onClick={() => window.open(`mailto:${booking.email}`)} />
                                        <Phone size={14} title={booking.phone} style={{ cursor: 'pointer' }} onClick={() => window.open(`tel:${booking.phone}`)} />
                                    </div>
                                </td>
                                <td>{booking.eventType}</td>
                                <td>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td>
                                    <span className={`status-pill ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-btn view"><ExternalLink size={16} /> Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingManager;
