import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const BrahminWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImage = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=90';

  const photos = [
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596791249761-ad8533604f14?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533148301552-09411f185c15?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="work-page brahmin-wedding-v4">

      {/* ── ASYMMETRIC HERO ── */}
      <header className="bw-hero">
        <motion.div
          className="bw-hero-img-col"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <img src={heroImage} alt="Brahmin Wedding" />
        </motion.div>

        <div className="bw-hero-text-col">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="back-btn-shared bw-back-btn">
              <ArrowLeft size={14} /> Home
            </Link>

            <p className="bw-hero-eyebrow">Sacred Rituals</p>

            <h1 className="bw-hero-title">
              Brahmin<br />
              <em>Traditions</em>
            </h1>

            <p className="bw-hero-desc">
              A serene collection of moments from a traditional Brahmin wedding.
              Focusing on the purity of rituals and the quiet, sacred beauty of the ceremony.
            </p>

            <div className="bw-hero-meta">
              <div className="bw-meta-row"><Calendar size={14} /> October 2025</div>
              <div className="bw-meta-row"><MapPin size={14} /> Bengaluru, India</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── ARTISTIC SECTION ── */}
      <section className="container">
        <div className="bw-artistic">
          <motion.div {...viewFadeUp(0)} className="bw-artistic-text">
            <h2 className="section-heading">The Purity of<br />Rituals</h2>
            <p className="body-text" style={{ marginTop: 28 }}>
              Brahmin weddings are masterpieces of ancient chants and sacred gestures.
              Our photography approach here was to allow natural light and the
              serenity of the Vedic atmosphere to lead the story.
            </p>
            <p className="body-text" style={{ marginTop: 18 }}>
              From the fragrant Havan to the exchange of garlands, every frame
              aims to preserve the quiet depth and holy significance of the day.
            </p>
          </motion.div>

          <motion.div {...viewFadeUp(0.15)} className="bw-artistic-img">
            <img src={photos[0]} alt="Ritual Detail" />
          </motion.div>
        </div>
      </section>

      {/* ── COLLECTION GRID ── */}
      <section className="bw-collection-section">
        <div className="container">
          <div className="bw-section-header">
            <motion.h2 {...viewFadeUp(0)} className="section-heading">Moment Capture</motion.h2>
            <motion.p {...viewFadeUp(0.1)}>Every detail beautifully preserved.</motion.p>
          </div>

          <div className="bw-collection-grid">
            {photos.slice(1).map((src, i) => (
              <motion.div
                key={i}
                className={`bw-coll-item ${i % 3 === 0 ? 'tall' : ''}`}
                {...viewFadeUp(i * 0.08)}
              >
                <img src={src} alt="Brahmin Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bw-footer">
        <div className="container">
          <div className="bw-footer-inner">
            <p style={{ fontSize: 13, color: '#7a7870' }}>Brahmin Wedding · Bengaluru 2025</p>
            <Link to="/work/christian-wedding" className="bw-next-link">
              <div>
                <span className="bw-next-label">Continue Watching</span>
                <h2 className="bw-next-title">Christian Wedding <ArrowRight size={28} /></h2>
              </div>
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default BrahminWedding;