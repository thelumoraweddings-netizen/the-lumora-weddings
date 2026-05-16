import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './GoogleReviews.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const reviews = [
  {
    name: "Mariselvam S",
    rating: 5,
    text: "Absolutely loved their work! The shooting style, creativity, and editing quality were on another level. Every photo and video felt emotional and cinematic. Watching the final output was truly heart melting. Highly recommended for wedding photography!",
    date: "Recent",
    initial: "M",
    color: "#34a853" // Google Green
  },
  {
    name: "krishna kumar",
    rating: 5,
    text: "Amazing experience! The studio ambience was classy and peaceful, and the photographers were very friendly and cooperative. Their customer handling was truly impressive.",
    date: "Recent",
    initial: "K",
    color: "#8c1c3f" // Brand Red/Pink
  },
  {
    name: "KARTHIK M",
    rating: 5,
    text: "Excellent studio with a great environment and professional setup. Friendly service and attention to detail make it a wonderful experience. Highly recommended!",
    date: "Recent",
    initial: "K",
    color: "#ea4335" // Google Red
  },
  {
    name: "Prabavathi M",
    rating: 5,
    text: "Excellent service and stunning wedding photography. THE LUMORA WEDDINGS captured every moment beautifully. Highly recommended!",
    date: "Recent",
    initial: "P",
    color: "#fabb05" // Google Yellow
  },
  {
    name: "jothika28 jayaraman",
    rating: 5,
    text: "A friendly cameraman and takes very good pics",
    date: "Recent",
    initial: "J",
    color: "#7b1fa2" // Purple
  }
];

const GoogleReviews = () => {
  return (
    <div className="pg-container">
      <motion.div {...vUp(0)} className="pg-section-header centered">
        <h2 className="pg-section-title cinematic-header">REAL EXPERIENCES</h2>
      </motion.div>

      <div className="reviews-layout">
        {/* Summary Sidebar */}
        <motion.div {...vUp(0.1)} className="reviews-summary-card">
          <div className="summary-brand">
            <img src="/logo.png" alt="Branding" className="summary-logo" />
            <div className="summary-info">
              <h3>The Lumora Weddings</h3>
              <div className="summary-rating">
                <strong>5.0</strong>
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} color="#fabb05" fill="#fabb05" />
                  ))}
                </div>
              </div>
              <span className="summary-total">5 Google reviews</span>
            </div>
          </div>
          <a 
            href="https://g.page/r/CU6hY52wS4guEBI/review" 
            target="_blank" 
            rel="noreferrer" 
            className="write-review-btn"
          >
            Write a review
          </a>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="reviews-carousel-wrap">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 2.5 }
            }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.review-pagination' }}
            className="reviews-swiper"
          >
            {reviews.map((item, i) => (
              <SwiperSlide key={i} style={{ height: 'auto' }}>
                <div className="review-card">
                  <div className="review-card-header">
                    <div className="user-avatar" style={{ background: item.color }}>
                      {item.initial}
                    </div>
                    <div className="user-meta">
                      <h4>{item.name}</h4>
                      <span>{item.date}</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="google-icon" alt="G" style={{ width: 14 }} />
                  </div>
                  
                  <div className="review-rating">
                    <div className="stars-row">
                      {[...Array(item.rating)].map((_, j) => (
                        <Star key={j} size={14} color="#fabb05" fill="#fabb05" />
                      ))}
                    </div>
                    <CheckCircle2 size={12} color="#1a73e8" className="verified-icon" />
                  </div>

                  <p className="review-text">{item.text.replace(/^["“]|["”]$/g, '')}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="review-pagination"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;
