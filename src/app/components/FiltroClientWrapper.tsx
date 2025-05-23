"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import Lenis from '@studio-freight/lenis';

export default function FiltroClientWrapper({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const uid = params?.uid as string;
  const [isMounted, setIsMounted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current,
      smoothWheel: true,
      easing: (t) => t,
      duration: 1.0,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const preventDefault = (e: Event) => {
      if (lenis.isScrolling) {
        e.preventDefault();
      }
    };

    const el = scrollContainerRef.current;
    el.addEventListener("wheel", preventDefault, { passive: false });
    el.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      lenis.destroy();
      el.removeEventListener("wheel", preventDefault);
      el.removeEventListener("touchmove", preventDefault);
    };
  }, [isMounted]);

  return (
    <div>
      {isMounted && children && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{  y: 80 }}
            animate={{  y: 80 }}
            exit={{  y: 80 }}
            transition={{ duration: 0.225 }}
            ref={scrollContainerRef}
            className="max-h-[calc(100vh-76px)] overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] overscroll-contain pb-[15px] touch-pan-y"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
