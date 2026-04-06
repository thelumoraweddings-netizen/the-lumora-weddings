"use client";
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './HeroCarousel.css';

import { HOME_IMAGES } from '../utils/homeImages';

const SLIDE_DATA = [
  { 
    id: 1, 
    title: 'THE MEADOW RUN',
    subtitle: 'A bold journey begins amidst the sweeping hills and timeless horizons.',
    eyebrow: 'Wedding Cinema',
    script: 'love',
    image: '/images/home_image/image_3.jpg'
  },
  { 
    id: 2, 
    title: 'THE ART OF THE MOMENT',
    subtitle: 'Beyond the pose: Your story, captured cinematically.',
    eyebrow: 'Wedding Films',
    script: 'love',
    image: '/images/home_image/image_4.jpg'
  },
  { 
    id: 3, 
    title: 'THE HERITAGE COAST',
    subtitle: 'Celebrating vibrant connections against the backdrop of timeless ancient wonders.',
    eyebrow: 'Heritage',
    script: 'love',
    image: '/images/home_image/image_5.jpg'
  },
  { 
    id: 4, 
    title: 'THE ETERNAL GLOW',
    subtitle: 'Capturing the golden essence of your most cherished celebrations.',
    eyebrow: 'Golden Hour',
    script: 'grace',
    image: '/images/home_image/image_6.jpg'
  },
  { 
    id: 5, 
    title: 'WHISPERS OF LOVE',
    subtitle: 'Intimate storytelling that speaks louder than words.',
    eyebrow: 'Intimacy',
    script: 'soul',
    image: '/images/home_image/image_7.jpg'
  },
  { 
    id: 6, 
    title: 'GRAND TRADITIONS',
    subtitle: 'Honoring heritage through a modern, sophisticated lens.',
    eyebrow: 'Legacy',
    script: 'bond',
    image: '/images/home_image/image_14.jpg'
  }
];

const clipReveal = {
  hidden:  { clipPath: 'inset(0 0 100% 0)', opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const scriptFade = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: { opacity: 0.08, scale: 1, transition: { duration: 2.2, ease: "easeOut" } },
  exit:    { opacity: 0, scale: 1.1, transition: { duration: 1 } }
};

const fadeSlide = (delay = 0) => ({
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -10, transition: { duration: 0.4 } },
});

const HeroCarousel = () => {
  const swiperRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = SLIDE_DATA.length;

  return (
    <div className="hero-fullscreen-wrapper">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={1800}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ el: '.hero-pagination', clickable: true }}
        navigation={{ nextEl: '.hero-nav-next', prevEl: '.hero-nav-prev' }}
        onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
        className="hero-fullscreen-swiper"
      >
        {SLIDE_DATA.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="hero-slide-fullscreen">
                <div className={`hero-bg-img ${isActive ? 'zoomed' : ''}`}>
                  <img src={slide.image} alt={slide.title} decoding="async" />
                </div>
                <div className="hero-overlay-base" />
                <div className="hero-overlay-gradient" />
                
                <div className="hero-text-container">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div key={`text-${slide.id}`} className="hero-text-inner">
                        {/* Background Script Text */}
                        <motion.span 
                          className="hero-script-bg"
                          variants={scriptFade}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {slide.script}
                        </motion.span>

                        <motion.div className="hero-slide-eyebrow" {...fadeSlide(0.3)}>
                          <span className="hero-eyebrow-line" />
                          <span className="hero-eyebrow-label">{slide.eyebrow}</span>
                        </motion.div>

                        <div className="hero-title-wrap">
                          <motion.h1
                            className="hero-title"
                            variants={clipReveal}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={0.5}
                          >
                            {slide.title}
                          </motion.h1>
                        </div>

                        <motion.p className="hero-subtitle" {...fadeSlide(0.8)}>
                          {slide.subtitle}
                        </motion.p>


                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-nav-prev hero-nav-btn"><ChevronLeft size={20} /></button>
      <button className="hero-nav-next hero-nav-btn"><ChevronRight size={20} /></button>
      
      <div className="hero-pagination-wrapper">
        <div className="hero-pagination" />
      </div>

      <div className="hero-slide-counter">
        <span className="hero-count-curr">0{activeIdx + 1}</span>
        <span className="hero-count-sep">/</span>
        <span className="hero-count-total">0{total}</span>
      </div>

      <div className="hero-scroll-hint">
        <span className="hero-scroll-track" />
        <span className="scroll-text">Scroll</span>
      </div>
    </div>
  );
};

export default HeroCarousel;