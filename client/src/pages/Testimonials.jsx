import React, { useState, useEffect } from 'react';
import { Star, Quote, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GoogleReviews from '../components/GoogleReviews';
import './Testimonials.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/reviews');
        if (res.data.success && res.data.reviews) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

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
            <p className="pg-hero-eyebrow">Kind Words</p>
            <h1 className="pg-hero-title">Client <em>Stories</em></h1>
            <p className="pg-hero-sub">
              We take pride in building relationships with our clients and delivering
              work that resonates with their souls.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Google Reviews Section ── */}
      <section className="reviews-section" style={{ padding: '100px 0' }}>
        <GoogleReviews />
      </section>

      {/* ── CTA ── */}
      <section className="testimonials-cta" style={{ borderTop: '1px solid var(--pg-border-soft)', padding: '100px 0' }}>
        <div className="pg-container">
          <motion.div {...vUp(0)} style={{ textAlign: 'center' }}>
            <Heart size={36} color="var(--pg-gold)" style={{ margin: '0 auto 24px', display: 'block' }} />
            <h2 className="pg-section-title" style={{ marginBottom: '16px' }}>Join our family of happy clients.</h2>
            <p style={{ color: 'var(--pg-cream-dim)', fontSize: '16px', marginBottom: '32px' }}>Your story deserves to be told with the same passion and dedication.</p>
            <Link to="/booking" className="pg-btn-primary">Book Your Story</Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Testimonials;