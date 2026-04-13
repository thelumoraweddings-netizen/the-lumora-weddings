import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Facebook, Instagram, Linkedin, Youtube, MessageCircle, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { name: 'Home',      path: '/',          num: '01' },
  { name: 'About Us',  path: '/about',     num: '02' },
  { 
    name: 'Gallery',   
    num: '03',
    dropdown: [
      { name: 'Engagement', path: '/gallery/engagement' },
      { name: 'WEDDING /reception', path: '/gallery/wedding' },
      { name: 'PRE/POST',   path: '/gallery/pre-post' },
      { name: 'maternity/babyshower',  path: '/gallery/maternity' },
      { name: 'babyshoot', path: '/gallery/baby-shoot' },
    ]
  },
  { name: 'Wedding Films', path: '/portfolio', num: '04' },
  { name: 'Book Us',   path: '/booking',   num: '05' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── Top Bar ── */}
      <nav
        className={[
          'nf-navbar',
          scrolled || !isHome ? 'nf-navbar--solid' : '',
          menuOpen ? 'nf-navbar--open' : '',
        ].join(' ')}
      >
        <div className="nf-navbar__inner">
          
          {/* Logo Section (Left) */}
          <Link 
            to="/" 
            className="nf-logo" 
            onClick={() => setMenuOpen(false)}
            style={{ opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? 'none' : 'all', transition: 'opacity 0.3s' }}
          >
            <img src="/logo.png" alt="THE LUMORA WEDDINGS" className="nf-logo__img" />
          </Link>

          {/* Desktop Navigation (Center-Right) */}
          <nav className="nf-navbar__desktop-links">
            {navLinks.map((link) => (
              <div key={link.name} className="nf-nav-item-wrapper">
                {link.path ? (
                  <Link 
                    to={link.path} 
                    className={`nf-desktop-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <span className={`nf-desktop-link ${location.pathname.startsWith('/gallery') ? 'active' : ''}`} style={{ cursor: 'default' }}>
                    {link.name}
                  </span>
                )}

                {link.dropdown && (
                  <div className="nf-dropdown">
                    <div className="nf-dropdown-inner">
                      {link.dropdown.map((sub) => (
                        <Link key={sub.path} to={sub.path} className="nf-dropdown-link">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="nf-navbar__controls">

            <div className="nf-hamburger-wrapper">
              <span className="nf-info-label">{menuOpen ? 'CLOSE' : 'INFO'}</span>
              <button
                className={`nf-hamburger ${menuOpen ? 'nf-hamburger--active' : ''}`}
                onClick={() => setMenuOpen(v => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span className="nf-hamburger__line" />
                <span className="nf-hamburger__line" />
                <span className="nf-hamburger__line" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Overlay for Click-Outside-to-Close ── */}
      <div 
        className={`nf-drawer-overlay ${menuOpen ? 'nf-drawer-overlay--visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Side Drawer Panel ── */}
      <div className={`nf-side-drawer ${menuOpen ? 'nf-side-drawer--open' : ''}`}>
        
        {/* Close Button Top Right of Drawer */}
        <div className="nf-drawer-close-area">
          <button className="nf-drawer-close-btn" onClick={() => setMenuOpen(false)}>
            <span className="close-label">CLOSE</span>
            <X size={32} strokeWidth={1} />
          </button>
        </div>

        <div className="nf-drawer-inner">
          <div className="nf-drawer-content-stack">
            
            {/* Primary Navigation (Mobile & Tablet) */}
            <nav className="nf-drawer-nav-vertical">
              {navLinks.map((link) => (
                <div key={link.name} className="nf-drawer-item-container">
                  {link.path ? (
                    <Link 
                      to={link.path} 
                      className={`nf-drawer-link ${location.pathname === link.path ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <span 
                      className={`nf-drawer-link ${location.pathname.startsWith('/gallery') ? 'active' : ''}`}
                    >
                      {link.name}
                    </span>
                  )}
                  {link.dropdown && (
                    <div className="nf-drawer-sublinks">
                      {link.dropdown.map((sub) => (
                        <Link 
                          key={sub.path} 
                          to={sub.path} 
                          className="nf-drawer-sublink" 
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="nf-drawer-divider-thin" />

            {/* Description */}
            <p className="nf-drawer-brand-desc">
              Artistic wedding photography company <br /> in Coimbatore and Chennai.
            </p>

            {/* Instagram Section */}
            <div className="nf-drawer-section nf-drawer-insta-section">
              <h3 className="section-label-drawer">INSTAGRAM</h3>
              <a href="https://instagram.com/TheLumoraWeddings" target="_blank" rel="noreferrer" className="insta-handle-drawer">
                @ TheLumoraWeddings
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ── Global Floating WhatsApp (Every Page) ── */}
      <a 
        href="https://wa.me/919345849846" 
        target="_blank" 
        rel="noreferrer" 
        className="nf-global-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <div className="global-whatsapp-bg">
          <svg viewBox="0 0 448 512" width="32" height="32" fill="white">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.8-5.7 5.6-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </div>
      </a>
    </>
  );
};

export default Navbar;