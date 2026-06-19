import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const teamMembers = [
  { name: 'Tilak',         role: 'Cinematographer & Editor',  img: '/images/meet-our-team/tilak-black.jpg' },
  { name: 'Bharathi Raja', role: 'Photographer & designer',   img: '/images/meet-our-team/bharathi-raja-black.jpg' },
  { name: 'Raja Rajan',    role: 'Photographer & designer',   img: '/images/meet-our-team/raja-rajan-black.jpg' },
  { name: 'Hari',          role: 'Cinematographer & Editor',  img: '/images/meet-our-team/hari-krishnan-black.jpg' },
  { name: 'Siva',          role: 'Photographer',              img: '/images/meet-our-team/siva-black.jpg' },
  { name: 'Vaishnavi',     role: 'Administrator',             img: '/images/meet-our-team/Vaishu Black.png' },
];

const About = () => (
  <div className="page-wrapper">


    {/* ── First Row: Logo & Studio Bio ── */}
    <section className="about-row-section">
      <div className="pg-container">
        <div className="about-split v-center logo-row">
          <motion.div {...vUp(0)} className="pg-about-img-col logo-col">
            <img 
              src="/images/Lumora Logo/Logo for post Dark.png" 
              alt="The Lumora Weddings Logo" 
              className="about-row-logo"
              decoding="async"
              fetchpriority="high"
            />
          </motion.div>
          <motion.div {...vUp(0.15)} className="about-text-col">
            <h2 className="highlight-title">About The Lumora Weddings</h2>
            <p>
              At <strong>The Lumora Weddings</strong>, we believe photography is more than just 
              images—it is the art of preserving emotions and telling stories that last forever. 
              Our vision is to create timeless, elegant, and meaningful photographs that truly 
              reflect the heart and soul of your unique journey. 
            </p>
            <p>
              Crafting cinematic wedding visuals since <strong>2020</strong>, we focus on 
              high-end storytelling for couples who value artistry and authenticity.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Second Row: Koushik Profile ── */}
    <section className="about-row-section bg-alt">
      <div className="pg-container">
        <div className="about-split v-center">
          <motion.div {...vUp(0.15)} className="about-text-col">
            <p className="pg-section-eyebrow">The Visionary</p>
            <h2>About Koushik</h2>
            <p>Some stories deserve more than memories. They deserve to be felt forever.</p>
            <p>I’m Koushik, the founder of The Lumora Weddings, where every wedding is captured with emotion, honesty, and timeless artistry. I believe photography is not just about how a moment looks, but about how it feels – the emotions, the connection, the people, and the love that make each celebration truly unforgettable.</p>
            <p>My approach is natural and cinematic, focused on preserving real moments as they unfold. From quiet glances to joyful tears, every frame is created to hold the emotions of your day in their purest form.</p>
            <p>At The Lumora Weddings, I don’t just capture weddings. I preserve stories that will be cherished for generations.</p>

            <div className="about-stats-row">
              <div className="about-stat">
                <strong>10+</strong>
                <span>Years Of Artistry</span>
              </div>
              <div className="about-stat">
                <strong>300+</strong>
                <span>Weddings Captured</span>
              </div>
            </div>
          </motion.div>
          <motion.div {...vUp(0)} className="pg-about-img-col portrait-col">
            <div className="team-img-wrapper">
              <img 
                src="/images/Koushik Img/DSC00815.jpg.jpeg" 
                alt="Koushik — Lead Photographer" 
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Third Row: Signature Style & Services ── */}
    <section className="about-highlights-section">
      <div className="pg-container">
        <div className="about-highlights-row">
          <motion.div {...vUp(0)} className="highlight-item-large">
            <span className="label">Signature Style</span>
            <p className="val">Candid, Cinematic, Natural, Emotional Storytelling</p>
          </motion.div>
          <motion.div {...vUp(0.1)} className="highlight-item-large">
            <span className="label">Our Services</span>
            <p className="val">Wedding, Baby Photography, Maternity, Events</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Team Section ── */}
    <section className="team-section">
      <div className="pg-container">
        <motion.div {...vUp(0)} className="pg-section-header centered">
          <p className="pg-section-eyebrow">The Creatives</p>
          <h2 className="pg-section-title">Meet Our Team</h2>
          <p className="team-subtitle">
            A carefully chosen group of artists who share one common obsession: 
            capturing love beautifully.
          </p>
        </motion.div>

        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <motion.div key={i} {...vUp(i * 0.1)} className="team-card">
              <div className="team-img-wrapper">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Quote Section ── */}
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