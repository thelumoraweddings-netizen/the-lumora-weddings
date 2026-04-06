import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Sparkles, Share, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const TeluguWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const photos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533148301552-09411f185c15?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596791249761-ad8533604f14?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="work-page telugu-wedding-v4">

      {/* ── SPLIT HERO ── */}
      <header className="tl-hero">
        <div className="tl-hero-left">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="back-btn-shared tl-back-btn">
                <ArrowLeft size={14} /> Portfolio
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="tl-hero-eyebrow">Telugu Wedding Cinema</p>
            <h1 className="tl-hero-title">
              The Colors of<br />
              <em>Vidya & Karthik</em>
            </h1>
            <p className="tl-hero-sub">
              A visual symphony of love, heritage, and explosive joy across three days of celebration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="tl-hero-stats">
              <div className="tl-stat-item">
                <strong>1500+</strong>
                <span>Moments Captured</span>
              </div>
              <div className="tl-stat-item">
                <strong>3 Days</strong>
                <span>Of Celebration</span>
              </div>
            </div>
            <div className="tl-hero-meta" style={{ marginTop: 24 }}>
              <span className="tl-meta-tag"><Sparkles size={13} /> Hyderabad, India</span>
              <span className="tl-meta-tag"><Calendar size={13} /> August 2025</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="tl-hero-right"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          <img src={photos[0]} alt="Telugu Wedding Hero" />
        </motion.div>
      </header>

      {/* ── INTRO ── */}
      <section className="container">
        <div className="tl-intro">
          <motion.div {...viewFadeUp(0)} className="tl-intro-text">
            <h2>The Vibrance of<br />Telugu Traditions</h2>
            <p>
              Telugu weddings are celebrations of unmatched energy and profound rituals.
              From the exuberant Baraat to the quiet intensity of the Mangalasnanam,
              Vidya and Karthik's day was a kaleidoscope of emotions and vibrant colors.
            </p>
            <p>
              Every frame was crafted to honor the richness of the tradition while
              capturing the very human moments of joy, tears, and connection.
            </p>
          </motion.div>

          <motion.div {...viewFadeUp(0.15)} className="tl-intro-img">
            <img src={photos[1]} alt="The Bride" />
          </motion.div>
        </div>
      </section>

      {/* ── HORIZONTAL GALLERY ── */}
      <section className="tl-horizontal-section">
        <div className="tl-horizontal-header">
          <h2>Explosive Moments</h2>
          <p>Documenting the unparalleled energy of the celebration.</p>
        </div>
        <div className="tl-h-track">
          {photos.slice(2, 8).map((src, i) => (
            <motion.div
              key={i}
              className="tl-h-item"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <img src={src} alt={`Scene ${i + 1}`} />
              <div className="tl-h-item-label">Scene {i + 1}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MASONRY GALLERY ── */}
      <section className="tl-masonry-section">
        <div className="container">
          <motion.div {...viewFadeUp(0)} className="tl-section-header">
            <h2>Gallery Collection</h2>
            <p>Every detail and grand gesture beautifully preserved.</p>
          </motion.div>

          <div className="tl-masonry-grid">
            {photos.slice(8).map((src, i) => (
              <motion.div
                key={i}
                className={`tl-m-item ${i % 3 === 0 ? 'tall' : ''}`}
                {...viewFadeUp(i * 0.1)}
              >
                <img src={src} alt="Telugu Detail" />
                <div className="share-overlay"><Share size={14} /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tl-footer">
        <Link to="/work/brahmin-wedding" className="tl-nav-card">
          <div className="tl-nav-bg" style={{ backgroundImage: `url(${photos[5]})` }} />
          <div className="tl-nav-overlay" />
          <div className="tl-nav-content">
            <span>Up Next</span>
            <h2>Brahmin Wedding <ChevronRight size={36} /></h2>
          </div>
        </Link>
      </footer>

    </div>
  );
};

export default TeluguWedding;