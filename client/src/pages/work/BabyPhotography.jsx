import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const BabyPhotography = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImages = {
    left: '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01815.jpg',
    center: '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01822.jpg',
    right: '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG02076.jpg',
  };
  
  const galleryImages = [
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01549.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01581.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01620.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01628.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01658.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01709.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01721.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01724.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01728.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01739.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01757.jpg',
    '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01791.jpg',
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
        <h1 className="story-title-cinematic">Baby Photography — <br />Capturing Life's Newest Arrivals</h1>

        <div className="story-grid-narrative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="story-body-main"
          >
            <p>
              There is no time more precious than the first days and months of life. 
              Our baby photography sessions are designed to capture the pure innocence, 
              the tiny details, and the quiet magic of your newest family member.
            </p>
            <p>
              Every smile, every breath, and every sleepy moment is a memory waiting 
              to be preserved in a timeless, cinematic way.
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
                <img src={src} alt="Baby Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default BabyPhotography;
