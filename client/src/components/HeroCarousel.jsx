"use client";
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
    title: 'THE HERITAGE COAST',
    subtitle: 'Celebrating vibrant connections against the backdrop of timeless ancient wonders.',
    eyebrow: 'Heritage',
    script: 'love',
    image: '/images/homepage_image/home-1.jpg'
  },
  {
    id: 2,
    title: 'MODERN MINIMALISM',
    subtitle: 'Focusing on the beauty of simplicity and the elegance of clean lines.',
    eyebrow: 'Contemporary',
    script: 'pure',
    image: '/images/homepage_image/home-2.jpg'
  },
  {
    id: 3,
    title: 'RUSTIC CHARM',
    subtitle: 'Embracing the warmth and character of natural elements and organic textures.',
    eyebrow: 'Rustic',
    script: 'warmth',
    image: '/images/homepage_image/home-3.jpg'
  },
  {
    id: 4,
    title: 'URBAN ELEGANCE',
    subtitle: 'Capturing the sophisticated spirit and dynamic energy of the city.',
    eyebrow: 'Urban',
    script: 'city',
    image: '/images/homepage_image/home-4.jpg'
  },
  {
    id: 5,
    title: 'TIMELESS CLASSICS',
    subtitle: 'Honoring the enduring beauty and grace of traditional photography.',
    eyebrow: 'Timeless',
    script: 'eternal',
    image: '/images/homepage_image/home-5.jpg'
  },
  {
    id: 6,
    title: 'WILD & ROMANTIC',
    subtitle: 'Finding the magic in untamed landscapes and passionate storytelling.',
    eyebrow: 'Romantic',
    script: 'magic',
    image: '/images/homepage_image/home-6.jpg'
  },
  {
    id: 7,
    title: 'CINEMATIC SOUL',
    subtitle: 'Telling your story through a cinematic lens with depth and emotion.',
    eyebrow: 'Editorial',
    script: 'soul',
    image: '/images/homepage_image/home-7.jpg'
  },
  {
    id: 8,
    title: 'ETHEREAL LIGHT',
    subtitle: 'Chasing the golden hour to capture the most dreamlike moments.',
    eyebrow: 'Natural',
    script: 'light',
    image: '/images/homepage_image/home-8.jpg'
  },
  {
    id: 9,
    title: 'PUREST EMOTION',
    subtitle: 'Candid moments that speak louder than words ever could.',
    eyebrow: 'Genuine',
    script: 'grace',
    image: '/images/homepage_image/home-9.jpg'
  },
  {
    id: 10,
    title: 'ARTISTIC VISION',
    subtitle: 'Where photography meets fine art to create lasting legacies.',
    eyebrow: 'Fine Art',
    script: 'spirit',
    image: '/images/homepage_image/home-10.jpg'
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
  const isSlider = total > 1;

  return (
    <div className="hero-fullscreen-wrapper">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={isSlider}
        speed={1800}
        autoplay={isSlider ? { delay: 6000, disableOnInteraction: false } : false}
        pagination={isSlider ? { el: '.hero-pagination', clickable: true } : false}
        navigation={isSlider ? { nextEl: '.hero-nav-next', prevEl: '.hero-nav-prev' } : false}
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
                  <AnimatePresence mode="wait" initial={true}>
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

                        <motion.div className="hero-btn-group" {...fadeSlide(1.1)}>
                          <Link to="/booking" className="hc-btn hc-btn--primary">
                            <span>Book Your Session</span>
                            <ArrowRight size={18} />
                          </Link>
                        </motion.div>


                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {isSlider && (
        <>
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
        </>
      )}

      <div className="hero-scroll-hint">
        <span className="hero-scroll-track" />
        <span className="scroll-text">Scroll</span>
      </div>
    </div>
  );
};

export default HeroCarousel;