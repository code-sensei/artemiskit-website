import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollProgressOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const calculateProgress = useCallback(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far through the element we've scrolled
    // 0 = element just entered viewport from bottom
    // 1 = element just left viewport from top
    const elementTop = rect.top;
    const elementHeight = rect.height;

    // Start counting when element enters viewport
    const startPoint = windowHeight;
    // End counting when element leaves viewport
    const endPoint = -elementHeight;

    const totalDistance = startPoint - endPoint;
    const currentPosition = startPoint - elementTop;

    const calculatedProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
    setProgress(calculatedProgress);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    if (!isInView) return;

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, calculateProgress]);

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return {
    ref: setRef,
    progress,
    isInView,
  };
}

// Hook for tracking overall page scroll progress
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.max(0, Math.min(1, scrollProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
