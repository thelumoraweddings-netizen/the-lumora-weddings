import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { galleryCategories } from '../utils/galleryConfig';
import CategoryLoader from '../components/CategoryLoader';
import './CategoryGallery.css';

const CategoryGalleryPage = () => {
  const { categoryId, subId } = useParams();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const category = galleryCategories.find(c => c.id === categoryId);
  const subCategory = category?.subCategories?.find(s => s.id === subId);
  
  // Decide which data to use: specific sub-category or the main category
  const activeData = subCategory || category;
  const isGridView = category?.subCategories && !subId;

  // Scroll to top and validate category
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!category) {
      navigate('/');
    }
  }, [category, navigate, subId]);

  if (!category) return null;

  // Generate image paths (only if not in grid view)
  const images = (!isGridView && activeData) 
    ? (activeData.customNames 
      ? activeData.customNames.map(name => `/images/${activeData.folder}/${name}`)
      : Array.from({ length: activeData.count }, (_, i) => {
          const num = i + 1;
          const fileName = `${activeData.prefix || ''}${num}.jpg`;
          return `/images/${activeData.folder}/${fileName}`;
        }))
    : [];

  // Image Pre-loading Logic
  useEffect(() => {
    if (isGridView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let loadedCount = 0;
    const targetCount = Math.min(images.length, 8); 
    
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= targetCount) {
          setTimeout(() => setLoading(false), 800);
        }
      };
      img.onerror = () => {
        loadedCount++; 
        if (loadedCount >= targetCount) setLoading(false);
      };
    });

    return () => clearTimeout(safetyTimer);
  }, [categoryId, subId, images.length, isGridView]);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const showNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="page-wrapper category-gallery-page">
      <AnimatePresence>
        {loading && (
          <CategoryLoader categoryName={activeData.title || activeData.name} />
        )}
      </AnimatePresence>

      <motion.div 
        className="pg-container"
        initial={{ opacity: 0, y: 30 }}
        animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* Header Section */}
        <header className="cat-gallery-header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subId ? (
              <Link to={`/gallery/${categoryId}`} className="back-link">
                <ArrowLeft size={16} /> Back to Projects
              </Link>
            ) : (
              <Link to="/" className="back-link">
                <ArrowLeft size={16} /> Back to Home
              </Link>
            )}
          </motion.div>
          
          <motion.div
            className="cat-gallery-title-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="cat-eyebrow">{subId ? activeData.name : 'Collection'}</span>
            <h1 className="cat-title">{activeData.title || activeData.name}</h1>
            <p className="cat-desc">{activeData.description}</p>
            
            {subId && activeData.content && (
              <motion.div 
                className="cat-long-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <div className="cat-content-divider" />
                <p className="cat-content-text">{activeData.content}</p>
              </motion.div>
            )}
          </motion.div>
        </header>

        {/* Level 1: Sub-Category Grid */}
        {isGridView ? (
          <div className="project-zigzag-list">
            {category.subCategories.map((sub, idx) => (
              <motion.div
                key={sub.id}
                className="project-zigzag-item"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="zigzag-image-container">
                  <Link to={`/gallery/${categoryId}/${sub.id}`} className="zigzag-image-link">
                    <div className="zigzag-image-reveal">
                      <img src={sub.image} alt={sub.name} />
                    </div>
                  </Link>
                </div>
                
                <div className="zigzag-content">
                  <div className="zigzag-content-inner">
                    <div className="zigzag-meta">
                      <span className="zigzag-number">0{idx + 1}</span>
                      <div className="zigzag-line" />
                    </div>
                    <h3 className="zigzag-client-name">{sub.name}</h3>
                    <p className="zigzag-description">{sub.description}</p>
                    <Link to={`/gallery/${categoryId}/${sub.id}`} className="zigzag-cta">
                      <span>Explore Story</span>
                      <div className="cta-line" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Level 2: Masonry Grid */
          <div className="gallery-masonry-container">
            <div className="gallery-masonry">
              <AnimatePresence mode="popLayout">
                {images.map((src, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: (i % 12) * 0.05 }}
                    className="gallery-item"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="gallery-img-wrap">
                      <img src={src} alt={`${activeData.title} moment ${i+1}`} loading="lazy" />
                      <div className="gallery-img-overlay">
                        <span className="expand-text">View Fullscreen</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="pg-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="pg-lightbox-close" onClick={closeLightbox}>
              <X size={32} />
            </button>

            <button className="pg-lightbox-arrow prev" onClick={showPrev}>
              <ChevronLeft size={24} />
            </button>
            <button className="pg-lightbox-arrow next" onClick={showNext}>
              <ChevronRight size={24} />
            </button>

            <motion.div
              className="pg-lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={images[selectedIndex]} alt="Fullscreen" />
              <div className="pg-lightbox-info">
                <h3>{activeData.title || activeData.name}</h3>
                <p>Frame {selectedIndex + 1} of {images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryGalleryPage;

