import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Users
} from 'lucide-react';
import './AdminLayout.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee', color: '#c00', borderRadius: '8px', margin: '2rem', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            <summary>Click for error details</summary>
            <br />
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard',   path: '/admin',               icon: <LayoutDashboard size={18} /> },
    { name: 'Quotations',  path: '/admin/quotations',    icon: <FileText size={18} /> },
    { name: 'Work Allocation', path: '/admin/events',    icon: <Calendar size={18} /> },
    { name: 'Client Leads', path: '/admin/bookings',      icon: <Users size={18} /> },
  ];

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const currentPage = navItems.find(i => isActive(i.path))?.name || 'Admin';

  return (
    <div className="al2-layout">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="al2-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`al2-sidebar ${sidebarOpen ? 'al2-sidebar--open' : ''}`}>
        <div className="al2-sidebar-top">
          {/* Logo */}
          <div className="al2-brand">
            <img src="/logo.png" alt="The Lumora Weddings" className="al2-brand-logo" />
            <div className="al2-brand-text">
              <span className="al2-brand-name">THE LUMORA WEDDINGS</span>
              <span className="al2-brand-sub">Admin Portal</span>
            </div>
          </div>

          <div className="al2-divider" />

          {/* Navigation */}
          <nav className="al2-nav">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`al2-nav-link ${isActive(item.path) ? 'al2-nav-link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="al2-nav-icon">{item.icon}</span>
                <span className="al2-nav-label">{item.name}</span>
                {item.name === 'Quotations' && (
                  <span className="al2-nav-badge">New</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="al2-sidebar-bottom">
          <div className="al2-divider" />
          <Link to="/" className="al2-back-site">
            <ChevronLeft size={15} />
            <span>Back to Site</span>
          </Link>
          <button onClick={handleLogout} className="al2-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="al2-main">

        {/* Header */}
        <header className="al2-header">
          <div className="al2-header-left">
            <button
              className="al2-mobile-toggle"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="al2-breadcrumb">
              <span className="al2-breadcrumb-root">Admin</span>
              <span className="al2-breadcrumb-sep">/</span>
              <span className="al2-breadcrumb-current">{currentPage}</span>
            </div>
          </div>

          <div className="al2-header-right">
            <div className="al2-user">
              <img src="/images/Koushik%20Img/DSC00815.jpg.jpeg" alt="Koushik" className="al2-avatar" style={{ objectFit: 'cover' }} />
              <div className="al2-user-info">
                <p>Administrator</p>
                <span>The Lumora Weddings</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="al2-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
