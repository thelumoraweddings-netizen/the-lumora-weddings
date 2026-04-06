import React from 'react';
import { Image, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Photos', count: '124', icon: <Image />, color: '#C9A227' },
        { title: 'New Bookings', count: '12', icon: <Calendar />, color: '#4CAF50' },
        { title: 'Messages', count: '8', icon: <MessageSquare />, color: '#2196F3' },
        { title: 'Views', count: '1.2k', icon: <TrendingUp />, color: '#9C27B0' }
    ];

    return (
        <div className="admin-dashboard">
            <div className="stats-grid">
                {stats.map(stat => (
                    <div key={stat.title} className="stat-card glass">
                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p>{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-section glass">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        {[
                            'New booking request from Sarah Miller',
                            'Successfully uploaded 5 wedding photos',
                            'Updated pricing for Portrait Session',
                            'New testimonial added by John Doe'
                        ].map((activity, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-dot"></div>
                                <p>{activity}</p>
                                <span>2 hours ago</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dashboard-section glass">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <button className="btn btn-outline">Upload Photos</button>
                        <button className="btn btn-outline">Check Bookings</button>
                        <button className="btn btn-outline">Write Blog Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
