import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Blog.css';

const vUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
});

const blogPosts = [
  {
    id: 1,
    title: 'The Secret to Perfect Wedding Lighting',
    excerpt: 'Discover how we use natural light and creative shadows to make your wedding photos look like fine art.',
    date: 'March 10, 2024',
    author: 'Studio Lead',
    category: 'Wedding Tips',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Why Black and White Photography is Timeless',
    excerpt: 'Exploring the emotional depth and raw honesty of monochrome imagery in modern portrait photography.',
    date: 'February 28, 2024',
    author: 'Studio Lead',
    category: 'Artistic Vision',
    image: 'https://images.unsplash.com/photo-1544120190-2751b882cca5?auto=format&fit=crop&w=800&q=80',
  },
];

const Blog = () => (
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
          <p className="pg-hero-eyebrow">Journal</p>
          <h1 className="pg-hero-title">The <em>Studio</em> Notes</h1>
          <p className="pg-hero-sub">
            Behind the scenes stories, professional photography tips, and
            reflections on the art of capturing moments.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── Posts Grid ── */}
    <div className="pg-container">
      <div className="blog-grid">
        {blogPosts.map((post, i) => (
          <motion.div key={post.id} {...vUp(i * 0.12)} className="blog-card">

            <div className="blog-card-img">
              <img src={post.image} alt={post.title} loading="lazy" />
              <span className="blog-category-badge">{post.category}</span>
            </div>

            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span><Calendar size={13} /> {post.date}</span>
                <span><User size={13} /> {post.author}</span>
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="blog-card-link">
                Read Full Story <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>
        ))}
      </div>
    </div>

    {/* ── Newsletter ── */}
    <section className="newsletter-section">
      <div className="pg-container">
        <motion.div {...vUp(0)}>
          <h2>Stay Inspired</h2>
          <p>Subscribe to our newsletter for exclusive photography tips and studio updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address…" />
            <button className="pg-btn-primary">Join Now</button>
          </div>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Blog;