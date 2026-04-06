import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const MuslimWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImage = 'https://images.unsplash.com/photo-1533148301552-09411f185c15?auto=format&fit=crop&w=1920&q=90';

  const photos = [
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596791249761-ad8533604f14?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  ];

  // mosaic layout: wide=spans 2 cols, tall=spans 2 rows
  const mosaicConfig = [
    { wide: true },
    {},
    { tall: true },
    { wide: true },
    {},
    {},
    { wide: true },
  ];

  return (
    <div className="work-page muslim-wedding-v4">

      {/* ── GRAND HERO ── */}
      <header className="mw-hero">
        <motion.div
          className="mw-hero-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
        <div className="mw-hero-overlay" />
        <div className="mw-hero-arch" />

        <div className="mw-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="mw-back-btn">
              <ArrowLeft size={14} /> Heritage
            </Link>

            <span className="mw-hero-eyebrow">Majestic Nikah Ceremony</span>
            <span className="mw-hero-ornament">✦ ✦ ✦</span>

            <h1 className="mw-hero-title">
              A Royal<br /><em>Union</em>
            </h1>

            <p className="mw-hero-sub">
              The heritage of Mumbai meets the elegance of Zoya & Farhan.
            </p>

            <div className="mw-hero-meta">
              <span><MapPin size={13} /> Mumbai, India</span>
              <span><Calendar size={13} /> July 2025</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── HERITAGE ── */}
      <section className="container">
        <div className="mw-heritage">
          <motion.div {...viewFadeUp(0)} className="mw-heritage-text">
            <h2>The Echo of<br />Tradition</h2>
            <p>
              Muslim weddings are masterpieces of grace and hospitality. Zoya and Farhan's
              Nikah was a grand affair, where the royal heritage of Persian architecture
              met the vibrant spirit of modern Mumbai.
            </p>
            <p>
              Every frame captures the deep-seated respect, the intimate exchange of
              qabul, and the festive brilliance of the Valima ceremony.
            </p>
          </motion.div>

          <motion.div {...viewFadeUp(0.15)} className="mw-heritage-img">
            <img src={photos[0]} alt="The Bride" />
          </motion.div>
        </div>
      </section>

      {/* ── MOSAIC GALLERY ── */}
      <section className="mw-gallery">
        <div className="container">
          <motion.div {...viewFadeUp(0)} className="mw-gallery-header">
            <h2>Gallery Collection</h2>
            <p>Subtle details and grand memories beautifully preserved.</p>
          </motion.div>

          <div className="mw-mosaic">
            {photos.slice(1).map((src, i) => {
              const cfg = mosaicConfig[i] || {};
              return (
                <motion.div
                  key={i}
                  className={`mw-mosaic-item ${cfg.wide ? 'wide' : ''} ${cfg.tall ? 'tall' : ''}`}
                  {...viewFadeUp(i * 0.08)}
                >
                  <img src={src} alt={`Moment ${i + 1}`} />
                  <span className="mw-mosaic-label">Moment {i + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mw-footer">
        <Link to="/work/engagement" className="mw-nav-card">
          <div className="mw-nav-bg" style={{ backgroundImage: `url(${photos[5]})` }} />
          <div className="mw-nav-overlay" />
          <div className="mw-nav-content">
            <span>Up Next</span>
            <h2>Engagement <Star size={30} /></h2>
          </div>
        </Link>
      </footer>

    </div>
  );
};

export default MuslimWedding;