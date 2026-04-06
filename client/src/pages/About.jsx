import React from 'react';
import { motion } from 'framer-motion';
import { Award, Camera, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const values = [
  { icon: <Heart size={22} />, title: 'Passion', desc: 'We pour our heart into every frame, treating each story as our own.' },
  { icon: <ShieldCheck size={22} />, title: 'Excellence', desc: 'Uncompromising quality in every deliverable we create.' },
  { icon: <Camera size={22} />, title: 'Artistry', desc: 'Viewing every moment through a deeply creative lens.' },
  { icon: <Award size={22} />, title: 'Recognition', desc: 'Award-winning quality recognized across the industry.' },
];

const About = () => (
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
          <p className="pg-hero-eyebrow">Established Excellence</p>
          <h1 className="pg-hero-title">Our <em>Studio</em> Story</h1>
          <p className="pg-hero-sub">
            Capturing real & timeless moments of new beginnings.
            Driven by passion, defined by excellence.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── About Split ── */}
    <section className="pg-container">
      <div className="about-split v-center">

        <motion.div {...vUp(0)} className="about-img-col">
          <img src="/images/about.png" alt="About The Lumora Weddings" />
          <div className="about-img-badge">
            Film
            <span>Preserving Emotions</span>
          </div>
        </motion.div>

        <motion.div {...vUp(0.15)} className="about-text-col">
          <p className="pg-section-eyebrow">About Us</p>
          <h2>The Art of Preserving Emotions</h2>
          <p>
            At <strong>The Lumora Weddings</strong>, we believe photography is more than just 
            images—it is the art of preserving emotions and telling stories that last forever. 
            Our vision is to create timeless, elegant, and meaningful photographs that truly 
            reflect your unique journey.Every frame is captured with creativity, precision, 
            and passion to ensure your special moments remain unforgettable.
          </p>
          <p>
            We don't just take pictures; we craft legacies. Experience the difference of a 
            visionary approach to your most precious memories.
          </p>

          <div className="about-highlights">
            <div className="highlight-item">
              <span className="label">Signature Style</span>
              <p className="val">Candid, Cinematic, Natural, Emotional Storytelling</p>
            </div>
            <div className="highlight-item">
              <span className="label">Our Services</span>
              <p className="val">Wedding, Baby Photography, Maternity, Events</p>
            </div>
          </div>

          <div className="about-stats-row">
            <div className="about-stat">
              <strong>10+</strong>
              <span>Years Experience</span>
            </div>
            <div className="about-stat">
              <strong>500+</strong>
              <span>Weddings Captured</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Values ── */}
    <section className="values-section">
      <div className="pg-container">
        <motion.div {...vUp(0)} className="pg-section-header centered">
          <p className="pg-section-eyebrow">Our Core</p>
          <h2 className="pg-section-title">Philosophy & Values</h2>
        </motion.div>

        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div key={i} {...vUp(i * 0.1)} className="value-item">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Quote Content from Image ── */}
    <section className="about-quote-section">
      <div className="pg-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="about-quote-text">
            "Photography is not just our profession, it is our <em>identity</em>."
          </blockquote>
          <p className="about-quote-sub">
            Join the hundreds of clients who have trusted us with their most precious moments. 
            Your legacy begins here.
          </p>
          <Link to="/booking" className="pg-btn-primary">Start Your Story</Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default About;