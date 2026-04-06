import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Testimonials.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const reviews = [
  { name: 'Eleanor & Thomas', event: 'Heritage Wedding',  text: 'A truly breathtaking experience. The Lumora captured the essence of our wedding in a way we never thought possible. The cinematic approach is just on another level.', rating: 5, tag: 'Wedding' },
  { name: 'Julian Vane',      event: 'Luxury Portrait',   text: 'Minimalism at its finest. The studio lighting and the attention to detail in post-production made my portraits look like they belonged in a high-end gallery.', rating: 5, tag: 'Portrait' },
  { name: 'Aria Editorial',   event: 'Fashion Campaign',  text: 'Professional, punctual, and highly creative. The photographers at The Lumora have an incredible eye for shadows and composition.', rating: 5, tag: 'Commercial' },
  { name: 'Sarah Jenkins',    event: 'Family Session',    text: 'The team was so patient with our kids and captured the most beautiful candid moments. These are photos we will treasure forever.', rating: 5, tag: 'Family' },
];

const Testimonials = () => (
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

    {/* ── Reviews Grid ── */}
    <div className="pg-container">
      <div className="testimonials-page-grid">
        {reviews.map((rev, i) => (
          <motion.div key={i} {...vUp(i * 0.1)} className="testimonial-full-card">

            <div className="tfc-top">
              <div className="tfc-quote-icon"><Quote size={20} /></div>
              <span className="tfc-tag">{rev.tag}</span>
            </div>

            <p className="tfc-text">"{rev.text}"</p>

            <div className="tfc-footer">
              <div className="tfc-avatar">{rev.name.charAt(0)}</div>
              <div>
                <div className="tfc-name">{rev.name}</div>
                <div className="tfc-stars">
                  {[...Array(rev.rating)].map((_, j) => (
                    <Star key={j} size={12} fill="var(--pg-gold)" color="var(--pg-gold)" />
                  ))}
                </div>
                <div className="tfc-event">{rev.event}</div>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>

    {/* ── CTA ── */}
    <section className="testimonials-cta">
      <div className="pg-container">
        <motion.div {...vUp(0)}>
          <Heart size={36} color="var(--pg-gold)" style={{ margin: '0 auto 24px', display: 'block' }} />
          <h2>Join our family of happy clients.</h2>
          <p>Your story deserves to be told with the same passion and dedication.</p>
          <Link to="/booking" className="pg-btn-primary">Book Your Story</Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Testimonials;