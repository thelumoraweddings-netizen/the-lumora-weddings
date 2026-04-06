import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { galleryCategories } from '../utils/galleryConfig';
import './CategoryGrid.css';

const CategoryGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="category-section">
      <div className="pg-container">
        <motion.div 
          className="category-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {galleryCategories.map((cat) => (
            <motion.div 
              key={cat.id} 
              className="category-card-wrapper"
              variants={itemVariants}
            >
              <Link to={`/gallery/${cat.id}`} className="category-card">
                <div className="category-card-img">
                  <img src={cat.image} alt={cat.title} loading="lazy" />
                  <div className="category-card-overlay" />
                </div>
                
                <div className="category-card-content">
                  <div className="category-card-info">
                    <span className="category-card-tag">Archive</span>
                    <h3 className="category-card-title">{cat.title}</h3>
                    <p className="category-card-desc">{cat.description}</p>
                  </div>
                  
                  <div className="category-card-footer">
                    <span className="view-link">
                      View Collection <ChevronRight size={14} />
                    </span>
                    <span className="photo-count">{cat.count} Photos</span>
                  </div>
                </div>
                
                {/* Decorative border glow */}
                <div className="category-card-glow" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
