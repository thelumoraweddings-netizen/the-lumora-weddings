import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

import './PortfolioSlider.css';

const categories = [
  {
    title: 'Tamil Wedding',
    slug: 'tamil-wedding',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=90',
    desc: 'Tradition meets cinematic storytelling.',
  },
  {
    title: 'Telugu Wedding',
    slug: 'telugu-wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=90',
    desc: 'Vibrant celebrations of love and culture.',
  },
  {
    title: 'Brahmin Wedding',
    slug: 'brahmin-wedding',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=90',
    desc: 'Sacred rituals beautifully preserved.',
  },
  {
    title: 'Christian Wedding',
    slug: 'christian-wedding',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=90',
    desc: 'Ethereal moments and timeless vows.',
  },
  {
    title: 'Muslim Wedding',
    slug: 'muslim-wedding',
    image: 'https://images.unsplash.com/photo-1533148301552-09411f185c15?auto=format&fit=crop&w=800&q=90',
    desc: 'A fusion of grace and grand heritage.',
  },
  {
    title: 'Engagement',
    slug: 'engagement',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=90',
    desc: 'The beautiful beginning of forever.',
  },
];

/* ── Scroll-triggered zoom via IntersectionObserver ── */
const useScrollZoom = (ref) => {
  useEffect(() => {
    if (!ref.current) return;
    const imgWraps = ref.current.querySelectorAll('.portfolio-card__img-wrap');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.2 }
    );

    imgWraps.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
};

const PortfolioSlider = () => {
  const prevRef    = useRef(null);
  const nextRef    = useRef(null);
  const sectionRef = useRef(null);

  useScrollZoom(sectionRef);

  return (
    <section className="portfolio-slider-section" ref={sectionRef}>

      {/* ── Header ── */}
      <div className="portfolio-slider-header">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="portfolio-slider-title-block"
        >
          <span className="ps-sub-title">Our Work</span>
          <h2 className="ps-main-title">
            Stories Told Through<br />Portrait Artistry
          </h2>
          <p className="ps-desc">
            Our collections showcase soul-stirring portraiture that documents
            the richness of tradition and the purity of emotion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="portfolio-slider-controls"
        >
          <button ref={prevRef} className="ps-arrow ps-arrow--prev" aria-label="Previous">
            <ChevronLeft size={22} />
          </button>
          <button ref={nextRef} className="ps-arrow ps-arrow--next" aria-label="Next">
            <ChevronRight size={22} />
          </button>
        </motion.div>
      </div>

      {/* ── Swiper ── */}
      <div className="portfolio-slider-track">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          freeMode={{ enabled: true, momentum: true }}
          mousewheel={{ forceToAxis: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (swiper.params?.navigation && swiper.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
          slidesPerView="auto"
          spaceBetween={28}
          grabCursor
          className="portfolio-swiper"
          breakpoints={{
            0:    { spaceBetween: 14 },
            768:  { spaceBetween: 22 },
            1200: { spaceBetween: 32 },
          }}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={i} className="portfolio-slide">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/work/${cat.slug}`} className="portfolio-card">

                  {/* Image */}
                  <div className="portfolio-card__img-wrap">
                    <img src={cat.image} alt={cat.title} loading="lazy" />
                    <div className="portfolio-card__hover-overlay">
                      <span className="portfolio-card__view-btn">
                        View Story <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="portfolio-card__content">
                    <div className="portfolio-card__top">
                      <span className="portfolio-card__index">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="portfolio-card__line" />
                    </div>
                    <h3 className="portfolio-card__title">{cat.title}</h3>
                    <p className="portfolio-card__category">{cat.desc}</p>
                  </div>

                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default PortfolioSlider;