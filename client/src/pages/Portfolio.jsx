import React from 'react';
import { motion } from 'framer-motion';
import './Portfolio.css';

const weddingVideos = [
  { 
    id: "tnOvpl9mdVc", 
    title: "GOWTHAM ❤️ PRABHAVATHY", 
    subtitle: "WEDDING TEASER"
  },
  { 
    id: "E3I8vrSFkwQ", 
    title: "RADHA ❤️ KESAVAMOORTHY", 
    subtitle: "MATERNITY"
  },
  { 
    id: "J91PdCSxw1o", 
    title: "RADHA ❤️ KESAVAMOORTHY", 
    subtitle: "SEEMANTHAM"
  },
  { 
    id: "tNbW46nZYPc", 
    title: "DIVYA BHARATHY ❤️ PAUL", 
    subtitle: "MATERNITY"
  },
  { 
    id: "cCDHfrPLzD8", 
    title: "GOWTHAM ❤️ PRABHAVATHY", 
    subtitle: "PRE WEDDING"
  },
  { 
    id: "3D4FSPXNzFk", 
    title: "ROSHITHA ❤️ VIGNESH", 
    subtitle: "WEDDING TEASER"
  }
];

const Portfolio = () => {
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

      {/* ── Video Grid ── */}
      <section className="video-grid-section">
        <div className="pg-container">
          <div className="video-grid">
            {weddingVideos.map((video, idx) => (
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
                    loading="lazy"
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

    </div>
  );
};

export default Portfolio;