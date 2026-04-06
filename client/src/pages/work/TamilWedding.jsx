import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Calendar, MapPin, Quote, ArrowRight, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.2, delay },
});

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const TamilWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImage = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=90';

  const ritualsPhotos = [
    'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595191603743-959249e21727?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  ];

  const muhurthamPhotos = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80',
  ];

  const receptionPhotos = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="work-page tamil-wedding-v4">

      {/* ── HERO ── */}
      <header className="tw-hero">
        <motion.div
          className="tw-hero-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
        <div className="tw-hero-grain" />
        <div className="tw-hero-overlay" />

        <div className="tw-hero-content">
          <div className="tw-hero-top">
            <motion.div {...fadeIn(0.4)}>
              <Link to="/" className="back-btn-shared tw-back-btn">
                <ArrowLeft size={14} /> Back to Portfolio
              </Link>
            </motion.div>
            <motion.div {...fadeIn(0.6)}>
              <span className="tw-hero-badge">Tamil Wedding Cinema</span>
            </motion.div>
          </div>

          <div className="tw-hero-bottom">
            <motion.div {...fadeUp(0.7)}>
              <h1 className="tw-hero-title">
                The Sacred Union of<br />
                <em>Aditya & Ananya</em>
              </h1>
            </motion.div>
            <motion.div {...fadeIn(1.1)} className="tw-hero-meta">
              <div className="tw-meta-item"><Calendar size={13} /> November 2025</div>
              <div className="tw-meta-item"><MapPin size={13} /> Madurai Temple City</div>
              <div className="tw-meta-item"><Camera size={13} /> Leica M11</div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── NARRATIVE ── */}
      <section className="container">
        <div className="tw-narrative">
          <motion.div {...viewFadeUp(0)} className="tw-narrative-text">
            <h2 className="section-heading">A Heritage<br />Revisited</h2>
            <p className="body-text" style={{ marginTop: 28 }}>
              In the heart of Madurai, where ancient stones breathe history, two souls
              committed to a journey of a lifetime. This Tamil wedding was a breathtaking
              tapestry of deep-rooted rituals, vibrant silks, and raw, soulful emotions.
            </p>
            <p className="body-text" style={{ marginTop: 18 }}>
              Our cinematic approach was to document the silence between the rituals —
              the shared glances, the nervous smiles, and the profound depth of the
              Vedic chants.
            </p>
          </motion.div>

          <motion.div {...viewFadeUp(0.15)}>
            <div className="tw-quote-block">
              <Quote className="tw-quote-icon" size={28} />
              <p>"The photography perfectly captured the essence of our traditions and the depth of our emotions."</p>
              <span className="author">— The Bride's Father</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PHASE 1: RITUALS ── */}
      <section className="tw-phase bg-dim">
        <div className="container">
          <div className="tw-phase-header">
            <span className="tw-phase-num">Part 01</span>
            <h2 className="tw-phase-title">Sunrise & Sacred Rituals</h2>
            <div className="tw-phase-line" />
          </div>
          <div className="tw-masonry">
            {ritualsPhotos.map((src, i) => (
              <motion.div
                key={i}
                className={`tw-masonry-item ${i === 1 ? 'tall' : ''}`}
                {...viewFadeUp(i * 0.1)}
              >
                <img src={src} alt="Ritual Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WIDE FOCUS ── */}
      <motion.div
        className="tw-focus-shot"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img src={muhurthamPhotos[3]} alt="Thali Kattu" />
        <div className="tw-focus-label">The Infinite Moment of Thali Kattu</div>
      </motion.div>

      {/* ── PHASE 2: MUHURTHAM ── */}
      <section className="tw-phase">
        <div className="container">
          <div className="tw-phase-header">
            <span className="tw-phase-num">Part 02</span>
            <h2 className="tw-phase-title">The Sacred Muhurtham</h2>
            <div className="tw-phase-line" />
          </div>
          <div className="tw-grid-6">
            {muhurthamPhotos.map((src, i) => (
              <motion.div
                key={i}
                className="tw-masonry-item"
                {...viewFadeUp(i * 0.08)}
              >
                <img src={src} alt="Muhurtham Detail" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHASE 3: CELEBRATION ── */}
      <section className="tw-phase bg-dim">
        <div className="container">
          <div className="tw-phase-header">
            <span className="tw-phase-num">Part 03</span>
            <h2 className="tw-phase-title">Evening Celebrations</h2>
            <div className="tw-phase-line" />
          </div>
          <div className="tw-masonry">
            {receptionPhotos.map((src, i) => (
              <motion.div
                key={i}
                className="tw-masonry-item"
                {...viewFadeUp(i * 0.1)}
              >
                <img src={src} alt="Reception" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tw-footer">
        <div className="container">
          <div className="tw-footer-inner">
            <div className="tw-share-btns">
              <button className="tw-share-btn"><Share2 size={14} /> Share Story</button>
              <button className="tw-share-btn"><Heart size={14} /> Save</button>
            </div>
            <Link to="/work/telugu-wedding" className="tw-next-link">
              <div>
                <span className="tw-next-label">Explore Next</span>
                <h2 className="tw-next-title">Telugu Wedding <ArrowRight size={26} /></h2>
              </div>
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default TamilWedding;