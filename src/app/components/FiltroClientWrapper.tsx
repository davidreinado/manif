"use client";
import { useEffect, useState, useRef } from "react";
import Lenis from '@studio-freight/lenis';
import CustomScrollbar from '@/app/components/CustomScrollbar';
import { useThemeStore } from "@/app/stores/useThemeStore"; // Make sure this import is present
import { usePathname } from "next/navigation";

export default function FiltroClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#808080");
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frostyRef = useRef<HTMLDivElement>(null);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 768)
  }, []);

  useEffect(() => {
    console.log(pathname)
    primaryColor == "#FC3370" ? setBackgroundColor("rgba(252,51,112,0.3)") : primaryColor == "#FF5A16" ? setBackgroundColor("rgba(255,90,22,0.3)") : primaryColor == "#FAB617" ? setBackgroundColor("rgba(250,182,23,0.3)") : setBackgroundColor("rgba(256,256,256,0.3)")
  }, [pathname, primaryColor])

  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    const osInstance = scrollContainerRef.current.closest('[data-overlayscrollbars]');
    const nativeScrollContainer = osInstance?.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null;
    if (!nativeScrollContainer) return;

    const lenis = new Lenis({
      wrapper: nativeScrollContainer,
      content: nativeScrollContainer.firstElementChild as HTMLElement,
      smoothWheel: true,
      duration: 1.2,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.4,
      infinite: false,
    });

    const handleScroll = () => {
      if (!frostyRef.current || !nativeScrollContainer) return;
      const scrollTop = nativeScrollContainer.scrollTop;
      const opacity = Math.min(scrollTop / 30, 1);
      frostyRef.current.style.opacity = `${opacity}`;
      frostyRef.current.style.willChange = 'opacity';
    };

    // ✅ Named wrapper for Lenis scroll event
    const onLenisScroll = () => handleScroll();

    nativeScrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    lenis.on('scroll', onLenisScroll);

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      nativeScrollContainer.removeEventListener('scroll', handleScroll);
      lenis.off('scroll', onLenisScroll); // ✅ Now valid
      lenis.destroy();
    };
  }, [isMounted]);


  return (
    <div className="pt-[94px] relative mr-[4px] mt-[14px] lg:mt-[0]">
      {/* Frosty overlay - now properly positioned */}
      <div
        ref={frostyRef}
        className="absolute top-0 left-0 right-0 h-[6rem] z-10
                  backdrop-blur-[1px] pointer-events-none
                  opacity-0 transition-opacity duration-300"
        style={{
          top: '85px', // Adjust for your header
          width: 'calc(100% - 12px)', // Adjust for scrollbar
          WebkitMaskImage: `
      linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%),
      linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)
    `,
          WebkitMaskComposite: 'intersect',
          maskImage: `
      linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%),
      linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)
    `,
          maskComposite: 'intersect',
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          background: backgroundColor,
        }}

      />

      {isMounted && (
        isMobile ? (
          <div ref={scrollContainerRef} className="max-h-[calc(100vh)]">
            <div>{children}</div>
          </div>
        ) : (
          <CustomScrollbar direction="vertical">
            <div ref={scrollContainerRef} className="max-h-[calc(100vh-86px)]">
              <div>{children}</div>
            </div>
          </CustomScrollbar>
        )
      )}
    </div>
  );
}