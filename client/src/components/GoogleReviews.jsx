import React from 'react';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../pages/Testimonials.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const reviews = [
  {
    author_name: "Mariselvam S",
    rating: 5,
    text: "Absolutely loved their work! The shooting style, creativity, and editing quality were on another level. Every photo and video felt emotional and cinematic. Watching the final output was truly heart melting. Highly recommended for wedding photography!"
  },
  {
    author_name: "krishna kumar",
    rating: 5,
    text: "Amazing experience! The studio ambience was classy and peaceful, and the photographers were very friendly and cooperative. Their customer handling was truly impressive."
  },
  {
    author_name: "KARTHIK M",
    rating: 5,
    text: "Excellent studio with a great environment and professional setup. Friendly service and attention to detail make it a wonderful experience. Highly recommended!"
  },
  {
    author_name: "Prabavathi M",
    rating: 5,
    text: "Excellent service and stunning wedding photography. THE LUMORA WEDDINGS captured every moment beautifully. Highly recommended!"
  },
  {
    author_name: "jothika28 jayaraman",
    rating: 5,
    text: "A friendly cameraman and takes very good pics"
  }
];

const GoogleReviews = ({ limit }) => {
  const displayReviews = limit ? reviews.slice(0, limit) : reviews;

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

      <motion.div {...vUp(0.2)}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ paddingBottom: '60px' }}
        >
          {displayReviews.map((review, index) => (
            <SwiperSlide key={index} style={{ height: 'auto' }}>
              <div className="pg-card review-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'grab' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: 'var(--pg-gold)' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <Quote size={32} color="var(--pg-border)" style={{ marginBottom: '20px' }} />
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--pg-cream)', marginBottom: '30px', flex: 1, fontStyle: 'italic' }}>
                  "{review.text.replace(/^["“]|["”]$/g, '')}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--pg-border-soft)', paddingTop: '20px', marginTop: 'auto' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--pg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pg-gold)', fontWeight: 'bold' }}>
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Instrument Sans", sans-serif', fontSize: '14px', fontWeight: '600', color: 'var(--pg-cream)' }}>{review.author_name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--pg-muted)' }}>Verified Review</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default GoogleReviews;
