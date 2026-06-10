import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import api from '../../utils/api';
import './AdminDashboard.css';

const ADD_SERVICES = [
  { id: 'helicam',   price: 10000 },
  { id: 'ledtv',     price: 5000 },
  { id: 'ledwall',   price: 18000 },
  { id: 'switcher',  price: 8000 },
  { id: 'youtube',   price: 3000 },
];

const AdminDashboard = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const { data } = await api.get('/api/quotations');
        setQuotations(data);
      } catch (err) {
        console.error('Failed to load quotations', err);
      }
    };
    fetchQuotations();
  }, []);

  const stats = [
    {
      title: 'Quotations',
      count: quotations.length,
      sub: `${quotations.filter(q => q.status === 'Draft').length} drafts`,
      icon: <FileText size={22} />,
      color: '#D4AF37',
      path: '/admin/quotations',
    },
    {
      title: 'Confirmed',
      count: quotations.filter(q => q.status === 'Confirmed').length,
      sub: 'of all quotes',
      icon: <TrendingUp size={22} />,
      color: '#4CAF50',
      path: '/admin/quotations',
    },
  ];

  const recent = quotations.slice(0, 5);

  return (
    <div className="ad2-dashboard">
      <div className="ad2-welcome">
        <div>
          <h1 className="ad2-welcome-title">Good to see you 👋</h1>
          <p className="ad2-welcome-sub">Here's a snapshot of your studio activity.</p>
        </div>
        <Link to="/admin/quotations" className="ad2-cta">
          <Plus size={15} /> Create Quotation
        </Link>
      </div>

      {/* Stats */}
      <div className="ad2-stats">
        {stats.map(stat => (
          <Link key={stat.title} to={stat.path} className="ad2-stat-card">
            <div className="ad2-stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="ad2-stat-info">
              <div className="ad2-stat-count">{stat.count}</div>
              <div className="ad2-stat-title">{stat.title}</div>
              <div className="ad2-stat-sub">{stat.sub}</div>
            </div>
            <ArrowRight size={16} className="ad2-stat-arrow" />
          </Link>
        ))}
      </div>

      {/* Recent Quotations */}
      <div className="ad2-section">
        <div className="ad2-section-header">
          <h2 className="ad2-section-title">Recent Quotations</h2>
          <Link to="/admin/quotations" className="ad2-view-all">View all <ArrowRight size={13} /></Link>
        </div>

        {recent.length === 0 ? (
          <div className="ad2-empty">
            <FileText size={36} strokeWidth={1} />
            <p>No quotations yet. <Link to="/admin/quotations">Create your first one.</Link></p>
          </div>
        ) : (
          <div className="ad2-table-wrap">
            <table className="ad2-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(q => {
                  let sum = parseFloat(q.baseAmount) || 0;
                  (q.additionalServices || []).forEach(sid => {
                    const s = ADD_SERVICES.find(x => x.id === sid);
                    if (s) sum += (s.price || 0);
                  });
                  const discountAmt = Math.round(sum * (parseFloat(q.discount) || 0) / 100);
                  const total = sum - discountAmt;
                  
                  // Handle Date Display (Checking both q.events and q.eventDate)
                  const eventDateStr = (q.events && q.events.length > 0 && q.events[0].date) 
                    ? q.events[0].date 
                    : q.eventDate;
                  const displayDate = eventDateStr 
                    ? (!isNaN(new Date(eventDateStr).getTime()) 
                        ? new Date(eventDateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                        : eventDateStr)
                    : '—';
                  const extraDates = (q.events && q.events.length > 1) ? ` (+${q.events.length - 1})` : '';

                  return (
                    <tr key={q.id}>
                      <td className="ad2-td-id">{q.id}</td>
                      <td className="ad2-td-name">{q.clientName || '—'}</td>
                      <td>{q.eventType || '—'}</td>
                      <td>{displayDate !== '—' ? `${displayDate}${extraDates}` : '—'}</td>
                      <td className="ad2-td-amount">
                        {total > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="ad2-section">
        <div className="ad2-section-header">
          <h2 className="ad2-section-title">Quick Actions</h2>
        </div>
        <div className="ad2-quick-actions">
          <Link to="/admin/quotations" className="ad2-quick-btn">
            <FileText size={18} /> New Quotation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
