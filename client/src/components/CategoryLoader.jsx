import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CategoryLoader.css';

const CategoryLoader = ({ categoryName, message = "Curating Gallery" }) => {
  return (
    <motion.div
      className="cat-loader-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cat-loader-bg">
        <div className="cat-loader-grain" />
      </div>

      <div className="cat-loader-content">
        {/* Animated Rings */}
        <div className="cat-loader-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="cat-loader-icon">
             <img src="/logo.png" alt="Loading" />
          </div>
        </div>

        {/* Text */}
        <div className="cat-loader-text">
          <motion.span 
            className="cat-loader-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.span>
          <motion.h2 
            className="cat-loader-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {categoryName}
          </motion.h2>
        </div>

        {/* Progress Line */}
        <div className="cat-loader-progress-wrap">
          <motion.div 
            className="cat-loader-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.5, 
              ease: [0.4, 0, 0.2, 1],
              repeat: Infinity
            }}
          />
        </div>
        
        <p className="cat-loader-note">Optimizing visual assets...</p>
      </div>

      {/* Decorative corners */}
      <div className="cat-loader-corner top-left" />
      <div className="cat-loader-corner bottom-right" />
    </motion.div>
  );
};

export default CategoryLoader;
