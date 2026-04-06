import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const Loader = ({ onLoaded }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(onLoaded, 900);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Corner frame */}
          <div className="loading-frame" />

          <motion.div
            className="loading-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo */}
            <motion.div
              className="loading-logo-box"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src="/logo.png" alt="THE LUMORA WEDDINGS" className="loading-logo" />
            </motion.div>

            {/* Brand name */}
            <motion.h2
              className="loading-brand-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
            >
              THE LUMORA <span>WEDDINGS</span>
            </motion.h2>

            {/* Sub */}
            <motion.p
              className="loading-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.8 }}
            >
              Cinematic Storytelling
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="loading-bar-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.div
                className="loading-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;