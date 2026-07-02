import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  // 100% force initial state to false for transparent background!
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrolled(position > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Wait just a tiny bit before checking initial position to avoid any weirdness
    requestAnimationFrame(() => {
      handleScroll();
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollPosition, isScrolled };
};
