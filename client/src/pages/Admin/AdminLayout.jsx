import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Image,
    Calendar,
    BookOpen,
    MessageSquare,
    Star,
    Briefcase,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Gallery', path: '/admin/gallery', icon: <Image size={20} /> },
        { name: 'Bookings', path: '/admin/bookings', icon: <Calendar size={20} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Star size={20} /> },
    ];

    return (
        <div className="admin-layout-v2">
            <div className="admin-sidebar-v2">
                <div className="sidebar-header-v2">
                    <div className="admin-logo-box">
                        <img src="/logo.png" alt="NegativeFilm Logo" />
                    </div>
                    <h2>NegativeFilm</h2>
                    <span className="uppercase">Studio Backend</span>
                </div>
                <nav className="sidebar-nav-v2">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            {item.icon} <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer-v2">
                    <Link to="/" className="back-link"><ChevronLeft size={16} /> Back to Site</Link>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} /> <span>Logout</span>
                    </button>
                </div>
            </div>
            <div className="admin-main-v2">
                <header className="admin-header-v2">
                    <h1 className="uppercase">{navItems.find(i => i.path === location.pathname)?.name || 'Admin'}</h1>
                    <div className="admin-user-v2">
                        <div className="user-avatar-v2">AD</div>
                        <div className="user-info-v2">
                            <p className="bold">Admin</p>
                            <span>Fine Art Studio</span>
                        </div>
                    </div>
                </header>
                <div className="admin-content-v2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
