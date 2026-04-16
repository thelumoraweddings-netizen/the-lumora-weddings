import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Calendar, MapPin, Quote, Share2, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WorkPages.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const PollachiWedding = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImages = {
    left: '/images/homepage_image/image_2.jpg',
    center: '/images/homepage_image/image_1.jpg',
    right: '/images/homepage_image/image_3.jpg',
  };
  
  // Dynamic Gallery - Easily add more images here
  const galleryImages = [
    '/images/homepage_image/image_4.jpg',
    '/images/homepage_image/image_5.jpg',
    '/images/homepage_image/image_6.jpg',
    '/images/homepage_image/image_7.jpg',
    '/images/homepage_image/image_8.jpg',
    '/images/homepage_image/image_1.jpg',
    '/images/homepage_image/image_2.jpg',
    '/images/homepage_image/image_3.jpg',
    '/images/homepage_image/image_4.jpg',
    '/images/homepage_image/image_5.jpg',
    '/images/homepage_image/image_6.jpg',
    '/images/homepage_image/image_7.jpg',
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
        <h1 className="story-title-cinematic">Wedding — A Celebration of<br />Love & Tradition</h1>

        <div className="story-grid-narrative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="story-body-main"
          >
            <p>
              Some weddings feel like a beautiful story unfolding naturally. This enchanting celebration 
              brought together two families and two cultures, creating moments filled with laughter, 
              emotion, and heartfelt traditions.
            </p>
            <p>
              For us, capturing this wedding was about more than pictures — it was about preserving emotions, 
              laughter, and memories that the families will treasure forever.
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
                <img src={src} alt="Wedding Moment" />
              </motion.div>
            ))}
          </div>
          
          {/* Spacing bottom */}
        </div>
      </section>

    </div>
  );
};

export default PollachiWedding;
