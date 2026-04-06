import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const ChristianWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroBgRef = useRef(null);

  useEffect(() => {
    const el = heroBgRef.current;
    if (el) {
      setTimeout(() => el.classList.add('loaded'), 100);
    }
  }, []);

  const heroImage = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1920&q=90';

  const photos = [
    'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520080356166-512cb53c5f59?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="work-page christian-wedding-v4">

      {/* ── CINEMATIC HERO ── */}
      <header className="cw-hero">
        <div
          ref={heroBgRef}
          className="cw-hero-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="cw-hero-overlay" />

        <div className="cw-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="cw-back-btn">
              <ArrowLeft size={14} /> Portfolio
            </Link>

            <span className="cw-hero-eyebrow">A Celebration of Vows</span>

            <h1 className="cw-hero-title">
              Ethereal<br /><em>Grace</em>
            </h1>

            <p className="cw-hero-sub">
              The beautiful union of Sarah & David at the coast.
            </p>

            <div className="cw-hero-meta">
              <span><MapPin size={13} /> Kochi, Kerala</span>
              <span><Calendar size={13} /> September 2025</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── INTRO ── */}
      <section className="cw-intro">
        <div className="container">
          <div className="cw-intro-grid">
            <motion.div {...viewFadeUp(0)} className="cw-intro-img">
              <img src={photos[0]} alt="The Bride" />
            </motion.div>

            <motion.div {...viewFadeUp(0.15)} className="cw-intro-text">
              <h2>Timeless<br />Elegance</h2>
              <p>
                Sarah and David's wedding was a masterpiece of light and love.
                Captured against the serene backdrop of the Arabian Sea, the ceremony
                was a delicate balance of modern sophistication and heartfelt tradition.
              </p>
              <p>
                Every detail — from the intricate lace of the gown to the sun-drenched
                reception — was documented to preserve the pure emotion of their promise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="cw-gallery-section">
        <div className="container">
          <motion.div {...viewFadeUp(0)} className="cw-gallery-header">
            <h2>Gallery Collection</h2>
            <p>Subtle details and grand memories beautifully preserved.</p>
          </motion.div>

          <div className="cw-masonry">
            {photos.slice(1).map((src, i) => (
              <motion.div
                key={i}
                className={`cw-m-item ${i === 0 ? 'wide' : ''} ${i === 2 ? 'tall' : ''}`}
                {...viewFadeUp(i * 0.1)}
              >
                <img src={src} alt="Christian Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="cw-testimonial">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Quote className="quote-icon" size={40} />
            <blockquote>
              "The way you captured the light and our emotions was exactly how we felt — truly ethereal."
            </blockquote>
            <cite>— Sarah & David</cite>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="cw-footer">
        <Link to="/work/muslim-wedding" className="cw-nav-card">
          <div className="cw-nav-bg" style={{ backgroundImage: `url(${photos[3]})` }} />
          <div className="cw-nav-content">
            <span>Up Next</span>
            <h2>Muslim Wedding <ArrowRight size={32} /></h2>
          </div>
        </Link>
      </footer>

    </div>
  );
};

export default ChristianWedding;