import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Instagram, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
// import PortfolioSlider from '../components/PortfolioSlider';
import './Home.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const featured = [
  { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', cat: 'Wedding',  title: 'Timeless Romance' },
  { img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', cat: 'Portrait', title: 'Golden Hour' },
  { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', cat: 'Fashion',  title: 'Urban Elegance' },
];

const services = [
  { title: 'Wedding',         desc: 'Complete coverage of your most beautiful day.' },
  { title: 'Baby Photography', desc: 'Capturing the pure innocence of your little ones.' },
  { title: 'Maternity',       desc: 'Celebrating the beautiful journey of motherhood.' },
  { title: 'Events',          desc: 'Preserving memories from every grand occasion.' },
];

const testimonials = [
  { 
    name: 'Sowmiyamanivasaga...', 
    date: '3 months ago',
    initial: 'S',
    color: '#8c1c3f',
    rating: 5,
    text: 'Giving the Marriage photography is never a east choice. I am really happy and grateful to this team for making the occasion absolutely unforgettable.' 
  },
  { 
    name: 'Dinesh T', 
    date: '6 months ago',
    initial: 'D',
    color: '#34a853',
    rating: 5,
    text: 'We found this photography team through Google, and based on the reviews, we contacted them. The response was prompt from the very start and the work was exceptional.' 
  },
  { 
    name: 'Harini Vaidyanathan', 
    date: '7 months ago',
    initial: 'H',
    color: '#7b1fa2',
    rating: 5,
    text: 'Wonderful work. Quality is very good. Very punctual. We had a very good experience and would highly recommend them to anyone.' 
  },
  { 
    name: 'Sofia Rossi', 
    date: '1 year ago',
    initial: 'SR',
    color: '#ea4335',
    rating: 5,
    text: 'Moody, artistic, and absolutely breathtaking. The lighting and composition were beyond world-class—exactly what I needed for my professional story.' 
  },
];

const instaPhotos = [
  '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01815.jpg',
  '/images/BABYSHOWERR CC/KEERTHIGA CC/IMG01822.jpg',
  '/images/BABYSHOWERR CC/ridhu cc/5.jpg',
  '/images/ENGAGEMENT CC/AJAY CC/image_5.jpg',
  '/images/home_image/image_14.jpg',
  '/images/MATERNITY CC/RIDHU CC/image_7.jpg',
  '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08357.jpg',
];

const StatItem = ({ target, label, bg, suffix = '+', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]); // Subtle parallax movement

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 3,
        delay: delay * 0.1, // Staggered count-up
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, target, delay]);

  return (
    <motion.div 
      ref={ref} 
      className="stat-mag-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: delay * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
    >
      <motion.span 
        className="stat-mag-bg"
        style={{ 
          y: isInView ? y : 0,
          willChange: 'transform'
        }}
      >
        {bg}
      </motion.span>
      <div className="stat-mag-content">
        <h4 className="stat-mag-num">{count}{suffix}</h4>
        <p className="stat-mag-label">{label}</p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: 'var(--pg-black)', overflowX: 'hidden' }}>

      {/* ── Full-screen hero ── */}
      <HeroCarousel />




      {/* ── Storytelling Section (Replaces Services) ── */}
      <section className="home-section storytelling-section">
        <div className="pg-container">
          <motion.div {...vUp(0)} className="story-header-centered">
            <h2 className="story-main-title">YOUR LOVE, OUR PASSION, TIMELESS FRAMES</h2>
            <p className="story-body-text">
              Welcome to <strong>THE LUMORA WEDDINGS</strong>, where elegance meets emotion. We specialize in capturing weddings with a refined, cinematic approach that transforms fleeting moments into timeless memories. Your wedding is not just a day—it’s a masterpiece of love, and we are here to preserve it with grace and artistry.
            </p>
          </motion.div>

          {/* Stories Grid (4 Cards) */}
          <div className="stories-magazine-grid">
            {[
              { 
                img: '/images/home_image/image_1.jpg', 
                cat: 'WEDDING', 
                title: 'A Celebration of Love & Traditions',
                link: '/work/pollachi-wedding'
              },
              { 
                img: '/images/home_image/image_2.jpg', 
                cat: 'OUTDOOR COUPLE PHOTOGRAPHY', 
                title: 'Moments of joy, laughter, and togetherness, framed under open skies.',
                link: '/work/outdoor-couple'
              },
              { 
                img: '/images/home_image/image_3.jpg', 
                cat: 'BABYSHOWER — MATERNITY', 
                title: 'Celebrating the miracle of life and the journey of motherhood.',
                link: '/work/maternity-story'
              },
              { 
                img: '/images/ENGAGEMENT CC/AJAY CC/image_5.jpg', 
                cat: 'ENGAGEMENT', 
                title: 'The Promise of Always — A Celebration of Commitment.',
                link: '/work/engagement'
              },
            ].map((story, i) => (
              <motion.div key={i} {...vUp(i * 0.1)} className="story-mag-card">
                <Link to={story.link || '#'} className="story-mag-link-wrap">
                  <div className="story-mag-img">
                    <img src={story.img} alt={story.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="story-mag-details">
                    <span className="story-mag-cat">{story.cat}</span>
                    <h3 className="story-mag-title">{story.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Cinematic Visual Stats Section ── */}
      <section className="home-stats-section">
        <div className="pg-container">
          <div className="stats-magazine-row">
            {[
              { target: 350, label: 'WEDDINGS CAPTURED', bg: '350' },
              { target: 10,  label: 'YEARS OF EXPERIENCE', bg: '10' },
              { target: 700, label: 'EVENTS COVERED', bg: '700' },
            ].map((stat, i) => (
              <StatItem key={i} target={stat.target} label={stat.label} bg={stat.bg} suffix={stat.suffix || '+'} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Section ── */}
      <section className="home-section insta-slider-section">
        <div className="pg-container">
          <motion.div {...vUp(0)} className="insta-slider-header">
            <p className="insta-slider-eyebrow">Follow us on instagram</p>
            <h2 className="insta-slider-title">@TheLumoraWeddings</h2>
          </motion.div>

          <div className="insta-slider-wrap">
            {/* Top Pagination Dots */}
            <div className="insta-dots-top" />

            <Swiper
              modules={[Autoplay, Pagination]}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              speed={1000}
              roundLengths={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, el: '.insta-dots-bottom' }}
              className="insta-swiper"
            >
              {instaPhotos.map((src, i) => (
                <SwiperSlide key={i} className="insta-slide">
                  <a 
                    href="https://www.instagram.com/p/DUacWGEAYOF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="insta-link-wrap"
                  >
                    <img src={src} alt={`Instagram ${i + 1}`} loading="lazy" decoding="async" />
                    <div className="insta-slide-overlay">
                      <span className="insta-click-btn">Click Here</span>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Bottom Pagination Dots */}
            <div className="insta-dots-bottom" />
          </div>
        </div>
      </section>

      {/* ── Google Reviews Overhaul ── */}
      <section className="home-section reviews-section">
        <div className="pg-container">
          <motion.div {...vUp(0)} className="pg-section-header centered">
            <h2 className="pg-section-title cinematic-header">TESTIMONIALS</h2>
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
                  <span className="summary-total">7 Google reviews</span>
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/place/NEGATIVE+FILM+PHOTOGRAPHY/@11.034902,76.9756171,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8596cb5437e81:0x579b38682aaa5777!8m2!3d11.0348967!4d76.978192!16s%2Fg%2F11zksz4mq3?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D" 
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
                {testimonials.map((item, i) => (
                  <SwiperSlide key={i}>
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

                      <p className="review-text">{item.text}</p>
                      <button className="read-more-btn">Read more</button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="review-pagination"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-section">
        <div className="pg-container">
          <motion.div {...vUp(0)} className="cta-banner">
            <h2>Ready to capture your story?</h2>
            <p>Book a consultation today and let's discuss your vision.</p>
            <Link to="/booking" className="pg-btn-primary">Book Now</Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;