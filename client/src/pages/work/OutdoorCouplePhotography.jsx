import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// ArrowLeft removed
// Link removed
import './WorkPages.css';

const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const OutdoorCouplePhotography = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImages = {
    left: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG07947.jpg',
    center: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08357.jpg',
    right: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08378.jpg',
  };
  
  const galleryImages = [
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08392.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08409.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08422.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08434.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08448.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08490.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08504.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08551.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08572.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08596.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08620.jpg',
    '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08688.jpg',
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
        <h1 className="story-title-cinematic">Outdoor Couple Photography — <br />Moments Framed Under Open Skies</h1>

        <div className="story-grid-narrative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="story-body-main"
          >
            <p>
              There’s something magical about love when it’s framed by the natural world. 
              This session brought us into the heart of the landscape, where the golden hour 
              and the rustling breeze created the perfect canvas for emotion.
            </p>
            <p>
              Capturing these moments was about more than just a background — it was about 
              the connection between two souls in a space that feels as infinite as their journey.
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
                <img src={src} alt="Couple Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default OutdoorCouplePhotography;
