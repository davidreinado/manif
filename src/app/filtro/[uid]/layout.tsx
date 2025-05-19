"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Lenis from '@studio-freight/lenis';

export default function FiltroLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const lenisRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current,
      smoothWheel: true,
      easing: (t) => t, // Linear easing
      duration: 1.0, // Added duration back for better control
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: true,
      wheelMultiplier: 1.2, // Slightly faster wheel
      touchMultiplier: 1.5, // Slightly faster touch
      normalizeWheel: true, // Better cross-browser consistency
      infinite: false,
    });

    // Modified RAF function without aggressive boundary stopping
    const raf = (time) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Add passive event listeners for better performance
    const wheelOpt = { passive: false };
    const touchOpt = { passive: false };
    
    const preventDefault = (e) => {
      if (lenisRef.current && lenisRef.current.isScrolling) {
        e.preventDefault();
      }
    };

    scrollContainerRef.current.addEventListener('wheel', preventDefault, wheelOpt);
    scrollContainerRef.current.addEventListener('touchmove', preventDefault, touchOpt);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('wheel', preventDefault);
        scrollContainerRef.current.removeEventListener('touchmove', preventDefault);
      }
    };
  }, [isMounted]);

  return (
    <div>
      {isMounted && (
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 70 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.225 }}
            ref={scrollContainerRef}
            className="max-h-[calc(100vh-75px)] overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] overscroll-contain pb-[15px] touch-pan-y"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}