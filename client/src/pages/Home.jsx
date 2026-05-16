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
import GoogleReviews from '../components/GoogleReviews';
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
  '/images/BABYSHOWERR CC/ridhu cc/1.jpg',
  '/images/BABYSHOWERR CC/ridhu cc/2.jpg',
  '/images/ENGAGEMENT CC/AJAY CC/image_1.jpg',
  '/images/ENGAGEMENT CC/AJAY CC/image_2.jpg',
  '/images/MATERNITY CC/RIDHU CC/image_1.jpg',
  '/images/MATERNITY CC/RIDHU CC/image_2.jpg',
  '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG07947.jpg',
  '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08357.jpg',
  '/images/RECEPTION CC/JEEVI CC/image_1.jpg',
  '/images/RECEPTION CC/JEEVI CC/image_2.jpg',
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
        duration: 0.7,
        delay: delay * 0.05, // Almost simultaneous
        ease: "easeOut",
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
        <h4 className="stat-mag-num">{count}<span className="stat-suffix">{suffix}</span></h4>
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
                img: '/images/homepage_image/image_1.jpg', 
                cat: 'WEDDING', 
                title: 'A Celebration of Love & Traditions',
                link: '/work/pollachi-wedding'
              },
              { 
                img: '/images/homepage_image/image_2.jpg', 
                cat: 'OUTDOOR COUPLE PHOTOGRAPHY', 
                title: 'Moments of joy, laughter, and togetherness, framed under open skies.',
                link: '/work/outdoor-couple'
              },
              { 
                img: '/images/homepage_image/image_3.jpg', 
                cat: 'BABYSHOWER — MATERNITY', 
                title: 'Celebrating the miracle of life and the journey of motherhood.',
                link: '/work/maternity-story'
              },
              { 
                img: '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/tamnail.jpg', 
                cat: 'ENGAGEMENT', 
                title: 'The Promise of Always — A Celebration of Commitment.',
                link: '/work/engagement'
              },
            ]
.map((story, i) => (
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
              speed={700} // Snappier feel
              roundLengths={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, el: '.insta-dots-bottom' }}
              className="insta-swiper"
              touchReleaseOnEdges={true}
              watchSlidesProgress={true}
            >
              {instaPhotos.map((src, i) => (
                <SwiperSlide key={i} className="insta-slide">
                  <a 
                    href="https://www.instagram.com/TheLumoraWeddings" 
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
      <section className="home-section reviews-section" style={{ paddingBottom: '120px' }}>
        <GoogleReviews limit={3} />
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