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

const Engagement = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroImages = {
    left: '/images/ENGAGEMENT CC/AJAY CC/image_5.jpg',
    center: '/images/ENGAGEMENT CC/AJAY CC/image_1.jpg',
    right: '/images/ENGAGEMENT CC/AJAY CC/image_7.jpg',
  };
  
  const galleryImages = [
    '/images/ENGAGEMENT CC/AJAY CC/image_2.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_3.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_4.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_6.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_8.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_9.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_10.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_11.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_12.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_13.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_14.jpg',
    '/images/ENGAGEMENT CC/AJAY CC/image_15.jpg',
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
        <h1 className="story-title-cinematic">The Engagement Story — <br />A Promise of Forever</h1>

        <div className="story-grid-narrative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="story-body-main"
          >
            <p>
              Engagements are the most intimate of celebrations. The initial promise,
              the shy smiles, and the unfettered joy of a new chapter beginning. 
              This story highlights the quiet grace and glowing anticipation of a couple 
              starting their beautiful journey together.
            </p>
            <p>
              Capturing this moment was about preserving the radiance, the strength, 
              and the overwhelming love that defines this very special time of 
              commitment and heartfelt connection.
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
                <img src={src} alt="Engagement Moment" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Engagement;