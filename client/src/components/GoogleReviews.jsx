import React, { useState, useEffect } from 'react';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import '../pages/Testimonials.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const GoogleReviews = ({ limit }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/reviews');
        if (res.data.success && res.data.reviews) {
          setReviews(limit ? res.data.reviews.slice(0, limit) : res.data.reviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [limit]);

  return (
    <div className="pg-container">
      <motion.div {...vUp(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
        <div>
          <h2 className="pg-section-title cinematic-header" style={{ marginBottom: '10px' }}>Real Experiences</h2>
          <p style={{ color: 'var(--pg-muted)', fontSize: '15px' }}>Read what our couples have to say about their journey with us.</p>
        </div>
        <a href="https://g.page/r/CU6hY52wS4guEBI/review" target="_blank" rel="noreferrer" className="pg-btn-primary">
          Write a Review <ExternalLink size={16} />
        </a>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--pg-gold)' }}>Loading Reviews...</div>
      ) : (
        <div className="review-grid">
          {reviews.map((review, index) => (
            <motion.div key={index} {...vUp(index * 0.1)} className="pg-card review-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: 'var(--pg-gold)' }}>
                {[...Array(Math.floor(review.rating || 5))].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <Quote size={32} color="var(--pg-border)" style={{ marginBottom: '20px' }} />
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--pg-cream)', marginBottom: '30px', flex: 1, fontStyle: 'italic' }}>
                "{review.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--pg-border-soft)', paddingTop: '20px' }}>
                {review.profile_photo_url ? (
                  <img src={review.profile_photo_url} alt={review.author_name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--pg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pg-gold)', fontWeight: 'bold' }}>
                    {review.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 style={{ fontFamily: '"Instrument Sans", sans-serif', fontSize: '14px', fontWeight: '600', color: 'var(--pg-cream)' }}>{review.author_name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--pg-muted)' }}>{review.relative_time_description}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleReviews;
