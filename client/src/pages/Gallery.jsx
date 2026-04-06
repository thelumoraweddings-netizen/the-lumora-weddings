import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryGrid from '../components/CategoryGrid';
import './Gallery.css';

const Gallery = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="page-wrapper">
      {/* Headers removed as per user request — category grid follows directly below */}

      {/* ── Category Grid Section ── */}
      <CategoryGrid />
      
      {/* ── Decorative Section Footer ── */}
      <section className="pg-section-footer" style={{ padding: '0 0 100px', textAlign: 'center' }}>
        <div className="pg-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="gallery-footer-text"
          >
            <p style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--pg-muted)' }}>
              "Photography is the story I fail to put into words." — Destin Sparks
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;