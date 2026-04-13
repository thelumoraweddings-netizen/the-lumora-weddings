import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Portfolio.css';

const weddingVideos = [
  { 
    id: "tnOvpl9mdVc", 
    title: "GOWTHAM ❤️ PRABHAVATHY", 
    subtitle: "WEDDING TEASER",
    category: "wedding&reception"
  },
  { 
    id: "E3I8vrSFkwQ", 
    title: "RADHA ❤️ KESAVAMOORTHY", 
    subtitle: "MATERNITY",
    category: "babyshower&maternity"
  },
  { 
    id: "J91PdCSxw1o", 
    title: "RADHA ❤️ KESAVAMOORTHY", 
    subtitle: "SEEMANTHAM",
    category: "babyshower&maternity"
  },
  { 
    id: "tNbW46nZYPc", 
    title: "DIVYA BHARATHY ❤️ PAUL", 
    subtitle: "MATERNITY",
    category: "babyshower&maternity"
  },
  { 
    id: "cCDHfrPLzD8", 
    title: "GOWTHAM ❤️ PRABHAVATHY", 
    subtitle: "PRE WEDDING",
    category: "save the date"
  },
  { 
    id: "3D4FSPXNzFk", 
    title: "ROSHITHA ❤️ VIGNESH", 
    subtitle: "WEDDING TEASER",
    category: "wedding&reception"
  }
];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'save the date', label: 'Save the Date' },
    { key: 'wedding&reception', label: 'Wedding & Reception' },
    { key: 'babyshower&maternity', label: 'Babyshower & Maternity' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? weddingVideos 
    : weddingVideos.filter(video => video.category === selectedCategory);
  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <section className="pg-hero">
        <div className="pg-container">
          <motion.div
            className="pg-hero-inner"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="pg-hero-eyebrow">Visual Narrative</p>
            <h1 className="pg-hero-title">Wedding <em>Films</em></h1>
            <p className="pg-hero-sub">
              Cinematic storytelling that captures the essence of your love, 
              preserving every heartbeat and whispered promise in motion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Explore Films ── */}
      <section className="explore-films-section">
        <div className="pg-container">
          <motion.div
            className="explore-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="explore-title">Explore Our Films</h2>
            <div className="category-buttons">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Video Grid ── */}
      <section className="video-grid-section">
        <div className="pg-container">
          <div className="video-grid">
            {filteredVideos.map((video, idx) => (
              <motion.div 
                key={video.id} 
                className="video-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <div className="video-player-wrapper">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-info">
                  <div className="video-meta">
                    <span className="video-number">0{idx + 1}</span>
                    <span className="video-line"></span>
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-subtitle">{video.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA — Wedding Films */}
      <section className="portfolio-cta-section">
        <div className="pg-container">
          <div className="portfolio-cta-banner">
            <p className="portfolio-cta-eyebrow">Subscribe</p>
            <h2 className="portfolio-cta-heading">Watch More on YouTube</h2>
            <p className="portfolio-cta-text">
              Discover our cinematic wedding films, behind-the-scenes moments, and storytelling
              inspiration on YouTube. Hit subscribe to stay connected and never miss a new release.
            </p>
            <a
              href="https://www.youtube.com/@negativefilmphotography"
              target="_blank"
              rel="noreferrer"
              className="portfolio-cta-button pg-btn-primary"
            >
              <span className="portfolio-cta-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                </svg>
              </span>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Portfolio;