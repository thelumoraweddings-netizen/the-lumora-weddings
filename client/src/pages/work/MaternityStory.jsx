import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const MaternityStory = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImages = {
    left: '/images/MATERNITY CC/RIDHU CC/image_1.jpg',
    center: '/images/MATERNITY CC/RIDHU CC/image_7.jpg',
    right: '/images/MATERNITY CC/RIDHU CC/image_17.jpg',
  };
  
  const galleryImages = [
    '/images/MATERNITY CC/RIDHU CC/image_2.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_3.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_4.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_5.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_6.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_8.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_9.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_10.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_11.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_12.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_13.jpg',
    '/images/MATERNITY CC/RIDHU CC/image_14.jpg',
  ];

  return (
    <div className="work-page pollachi-wedding-v2">
      {/* ── PANORAMIC BANNER ── */}
      <section className="panoramic-banner">
        <div className="pb-left">
          <motion.div 
            className="pb-img"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ backgroundImage: `url(${heroImages.left})` }}
          />
        </div>
        <div className="pb-center">
          <motion.div 
            className="pb-img"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6 }}
            style={{ backgroundImage: `url(${heroImages.center})` }}
          />
          <Link to="/" className="pb-back-btn">
            <ArrowLeft size={16} /> Back to Stories
          </Link>
        </div>
        <div className="pb-right">
          <motion.div 
            className="pb-img"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ backgroundImage: `url(${heroImages.right})` }}
          />
        </div>
      </section>

      {/* ── STORY INTRO (MINIMALIST) ── */}
      <section className="story-intro-container container">
        <h1 className="story-title-cinematic">Babyshower — Maternity — <br />Celebrating the Miracle of Life</h1>

        <div className="story-grid-narrative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="story-body-main"
          >
            <p>
              The journey to motherhood is one of the most beautiful and singular 
              experiences in life. This story highlights the quiet grace and glowing 
              anticipation of a family waiting for its newest member.
            </p>
            <p>
              Capturing this moment was about preserving the radiance, the strength, 
              and the overwhelming love that defines this very special time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="tw-phase bg-dim">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
          <div className="tw-masonry">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                className="tw-masonry-item"
                {...viewFadeUp(i * 0.1)}
              >
                <img src={src} alt="Maternity Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default MaternityStory;
