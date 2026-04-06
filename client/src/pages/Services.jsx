import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Clock, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const services = [
  {
    title: 'Wedding Cinema',
    tagline: 'Timeless Stories',
    price: '2,499',
    icon: <Star size={28} />,
    features: ['Full Day Coverage', '2 Lead Photographers', 'Cinematic Wedding Film', 'Premium Photo Album', 'High-End Retouching'],
  },
  {
    title: 'Baby & Kids',
    tagline: 'Pure Innocence',
    price: '599',
    icon: <Camera size={28} />,
    features: ['Professional Session', 'Themed Backgrounds', 'All Raw Images', '20 High-End Retouches', 'Private Online Gallery'],
  },
  {
    title: 'Maternity & Events',
    tagline: 'Beautiful Beginnings',
    price: '1,299',
    icon: <Clock size={28} />,
    features: ['Concept Photography', 'Outdoor/Indoor Session', 'Family Portraits Included', 'Rapid Turnaround', 'Artistic Post-Production'],
  },
];

const Services = () => (
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
          <p className="pg-hero-eyebrow">Pricing & Plans</p>
          <h1 className="pg-hero-title">Studio <em>Services</em></h1>
          <p className="pg-hero-sub">
            Transparent packages designed to meet your specific needs. From intimate portraits
            to grand weddings, we provide the highest quality service.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── Services Grid ── */}
    <div className="pg-container">
      <div className="services-grid">
        {services.map((svc, i) => (
          <motion.div key={i} {...vUp(i * 0.1)} className="service-card">

            <div className="service-icon-wrap">{svc.icon}</div>

            <div className="service-card-header">
              <span className="service-card-tagline">{svc.tagline}</span>
              <h3>{svc.title}</h3>
            </div>

            <div className="service-price">
              <sup>$</sup>{svc.price}
            </div>

            <ul className="service-features">
              {svc.features.map((feat, j) => (
                <li key={j}>
                  <CheckCircle2 size={15} color="var(--pg-gold)" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link to="/booking" className="pg-btn-primary" style={{ justifyContent: 'center' }}>
              Choose Plan
            </Link>

          </motion.div>
        ))}
      </div>
    </div>

    {/* ── Custom Quote ── */}
    <section className="services-custom">
      <div className="pg-container">
        <motion.div {...vUp(0)}>
          <h2>Need a custom quote?</h2>
          <p>
            Every project is unique. If our standard packages don't fit your vision,
            contact us for a personalized proposal for your commercial or destination project.
          </p>
          <Link to="/contact" className="pg-btn-outline">Request Consultation</Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Services;