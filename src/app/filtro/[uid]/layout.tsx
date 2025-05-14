"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

export default function FiltroLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const scrollContainerRef = useRef(null);
  const lenisRef = useRef<Lenis | null>(null);

  const pixelSteps = 35;
  const maxPixel = 20;
  const animationDuration = 1200;

  // Smooth scroll setup
  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current,
      smoothWheel: true,
      easing: (t) => t,
      duration: 1.0,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      normalizeWheel: true,
      infinite: false,
    });

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const preventDefault = (e: Event) => {
      if (lenisRef.current?.isScrolling) e.preventDefault();
    };

    const el = scrollContainerRef.current;
    el.addEventListener("wheel", preventDefault, { passive: false });
    el.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      el.removeEventListener("wheel", preventDefault);
      el.removeEventListener("touchmove", preventDefault);
    };
  }, [isMounted]);

  // Mount trigger
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pixelation animation
  const [pixelSize, setPixelSize] = useState(maxPixel);

  useEffect(() => {
    if (!isMounted) return;

    let step = 0;
    const stepDuration = animationDuration / pixelSteps;

    const animate = () => {
      const progress = step / pixelSteps;
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentPixel = Math.round(maxPixel * (1 - eased));

      setPixelSize(currentPixel);

      step++;
      if (step <= pixelSteps) {
        setTimeout(animate, stepDuration);
      } else {
        // Cleanly remove filter
        setShowFilter(false);
      }
    };

    animate();
  }, [isMounted]);

  return (
    <>
      {/* Pixelation SVG Filter */}
      {showFilter && (
        <svg width="0" height="0">
          <filter id="pixelate">
            <feFlood result="flood" />
            <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite" />
            <feMorphology
              in="composite"
              operator="dilate"
              radius={pixelSize}
              result="morph"
            />
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </svg>
      )}

      <div>
        {isMounted && (
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 70 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.125 }}
              ref={scrollContainerRef}
              className="max-h-[calc(100vh-75px)] overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] overscroll-contain pb-[15px] touch-pan-y"
              style={{
                filter: showFilter ? "url(#pixelate)" : "none",
                willChange: "filter",
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
