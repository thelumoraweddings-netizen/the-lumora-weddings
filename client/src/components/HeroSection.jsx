import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroSection.css';

const slides = [
  { id: 1, title: 'Capturing Timeless Moments', subtitle: 'Cinematic storytelling through light and emotion.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=90' },
  { id: 2, title: 'Elegant Portrait Sessions', subtitle: 'Where personality meets artistry in every frame.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1920&q=90' },
  { id: 3, title: 'Luxury Wedding Stories', subtitle: 'Every emotion, every detail, beautifully preserved forever.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=90' },
  { id: 4, title: 'Destination Photography', subtitle: 'Breathtaking locations, unforgettable memories captured.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=90' },
  { id: 5, title: 'Fashion & Editorial', subtitle: 'Bold, expressive, and visually stunning imagery.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=90' },
  { id: 6, title: 'Family Portraits', subtitle: 'Beautiful moments and timeless memories through cinematic art.', image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1920&q=90' },
  { id: 7, title: 'Candid Raw Emotion', subtitle: 'The magic of unposed moments — real, pure, and powerful.', image: 'https://images.unsplash.com/photo-1533148301552-09411f185c15?auto=format&fit=crop&w=1920&q=90' },
  { id: 8, title: 'Soulful Monochrome', subtitle: 'Black and white photography with timeless cinematic depth.', image: 'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=1920&q=90' },
  { id: 9, title: 'Breathtaking Nature', subtitle: 'Landscapes captured in their most inspiring, golden moment.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=90' },
  { id: 10, title: 'Studio Fine Art', subtitle: 'Museum-quality photography crafted with precision and intent.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=90' },
  { id: 11, title: 'Bridal Ethereal', subtitle: 'Turning the bride into a masterpiece of light and lace.', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1920&q=90' },
  { id: 12, title: 'Heritage & Culture', subtitle: 'Celebrating the rich traditions and vibrant colors of life.', image: 'https://images.unsplash.com/photo-1596791249761-ad8533604f14?auto=format&fit=crop&w=1920&q=90' },
  { id: 13, title: 'Urban Cityscapes', subtitle: 'The geometry and energy of cities through a cinematic lens.', image: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=90' },
  { id: 14, title: 'Evening Celebrations', subtitle: "The joy and warmth of life's most cherished milestones.", image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=90' },
  { id: 15, title: 'Street & Documentary', subtitle: 'Gritty, honest, and gorgeous street photography in noir style.', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=90' },
];

const navItems = [
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Booking', path: '/booking' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const HeroSection = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [textKey, setTextKey] = useState(0);
  const wrapperRef = useRef(null);
  const total = slides.length;

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((index + total) % total);
      setTextKey(k => k + 1);
      setAnimating(false);
    }, 600);
  }, [animating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div
      ref={wrapperRef}
      className="hero-section-wrapper"
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      {/* Decorative frame corners */}
      <div className="hero-frame" />

      {/* ── Slides ── */}
      <div className="hero-slides-container">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide-bg ${idx === current ? 'active' : ''}`}
          >
            <div className={`hero-ken-burns ${idx === current ? 'zoom' : ''}`}>
              <img
                src={slide.image}
                alt={slide.title}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Adaptive overlay ── */}
      <div className={`hero-adaptive-overlay ${isDarkMode ? 'dark-overlay' : 'light-overlay'}`} />

      {/* ── Top bar ── */}
      <div className="hero-topbar">
        <Link to="/" className="hero-logo">
          <img src="/logo.png" alt="THE LUMORA WEDDINGS" className="hero-logo-img" />
          <div className="hero-logo-text">
            <span className="hero-brand-name">THE LUMORA WEDDINGS</span>
            <span className="hero-brand-sub">Wedding Artistry</span>
          </div>
        </Link>
        <button onClick={toggleTheme} className="hero-theme-toggle" aria-label="Toggle theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* ── Center content ── */}
      <div className="hero-center-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={textKey}
            style={{ display: 'contents' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className="hero-eyebrow-text"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              THE LUMORA WEDDINGS
            </motion.p>

            <motion.h1
              className="hero-main-title"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.nav
              className="hero-nav-buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {navItems.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hero-nav-btn"
                  style={{ transitionDelay: `${i * 0.04}s` }}
                >
                  {item.name}
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Arrows ── */}
      <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next">
        <ChevronRight size={24} />
      </button>

      {/* ── Dots ── */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Counter ── */}
      <div className="hero-counter">
        <span className="hero-count-current">{String(current + 1).padStart(2, '0')}</span>
        <span className="hero-count-divider">/</span>
        <span className="hero-count-total">{String(total).padStart(2, '0')}</span>
      </div>

      {/* ── Scroll hint ── */}
      <div className="hero-scroll-hint">
        <span className="hero-scroll-line" />
        Scroll
      </div>
    </div>
  );
};

export default HeroSection;