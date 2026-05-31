import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const isAdmin = () => window.location.pathname.startsWith('/admin');

    const startLenis = () => {
      if (isAdmin()) return; // never run Lenis on admin pages

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame(raf);
    };

    const stopLenis = () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Start on mount if not admin
    startLenis();

    // Watch for client-side navigation (React Router changes history)
    const handleNavigation = () => {
      if (isAdmin()) {
        stopLenis();
      } else if (!lenisRef.current) {
        startLenis();
      }
    };

    window.addEventListener('popstate', handleNavigation);

    // Observe URL changes via a fast polling approach for pushState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleNavigation();
    };
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleNavigation();
    };

    return () => {
      stopLenis();
      window.removeEventListener('popstate', handleNavigation);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
