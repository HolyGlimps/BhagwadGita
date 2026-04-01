import { useEffect, useState, useCallback } from 'react';

export const useFadeInOnScroll = () => {
  const [isVisible, setIsVisible] = useState(true);

  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setElement(node);
    }
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return { ref, isVisible };
};