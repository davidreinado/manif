"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import FullWidthWord from "@/app/components/ManifAnimation";
import { motion, useMotionValue } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ArtistsResidencyAndCalendar from "./ArtistsResidencyAndCalendar";

interface CerebroProps {
  home: any;
  filteredLocalidades: any[];
  filteredAgentes: any[];
  existingLocalidadeDocs: any[];
  children: ReactNode;
}

export default function Cerebro({
  home,
  filteredLocalidades,
  filteredAgentes,
  existingLocalidadeDocs,
  children,
}: CerebroProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const copyRef = useRef(null);
  const lenisScrollY = useMotionValue(0);
  const searchParams = useSearchParams();
  const [showCopiedBox, setShowCopiedBox] = useState(false);

  const [activeButton, setActiveButton] = useState("Sobre");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocalidade, setSelectedLocalidade] = useState<string | null>(null);

  // Initialize Lenis only once
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.02,
      duration: 0.8,
      easing: (t) => t,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      lenisScrollY.set(lenis.scroll);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setShowCopiedBox((prev) => !prev);
    };

    const btn = copyRef.current;
    if (btn) {
      btn.addEventListener("click", handleClick);
    }

    return () => {
      if (btn) {
        btn.removeEventListener("click", handleClick);
      }
    };
  }, []);


  // Check scroll position for bottom detection
  useEffect(() => {
    const checkScrollPosition = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setIsAtBottom(isBottom);
    };

    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  // Sync selectedLocalidade with search params
  useEffect(() => {
    const filter = searchParams.get("localidade");
    setSelectedLocalidade(filter);

    if (filter) {
      setActiveButton("Apoios");
    } else {
      setActiveButton("Sobre");
    }

  }, [searchParams]);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const getNavPosition = () => {
    switch (activeButton) {
      case "Sobre":
        return { left: "14px" };
      case "Apoios":
        return { left: "25%" };
      default:
        return { left: "14px" };
    }
  };

  const getTypePosition = () => {
    switch (selectedType) {
      case "Residências":
        return { top: "calc(50vh + 4px)" };
      case "Exposição":
        return { top: "calc(50vh + 67px)" };
      case "Mediação":
        return { top: "calc(50vh + 110px)" };
      default:
        return { top: "calc(50vh + 4px)" };
    }
  };

  return (
    <div>
      {/* Layout dots */}
      <div>
        <div className="w-[14px] h-[14px] fixed right-[14px] top-[14px] bg-black z-40"></div>
        <div className="w-[14px] h-[14px] fixed right-[14px] top-[calc(50vh-7px)] bg-black z-40"></div>
        <div className="w-[14px] h-[14px] fixed left-[14px] top-[calc(50vh-7px)] bg-black z-40"></div>
        <div
          className="w-[14px] h-[14px] fixed bottom-[14px] bg-black z-40 transition-all duration-500"
          style={getNavPosition()}
        ></div>
        <div className="w-[14px] h-[14px] fixed right-[14px] bottom-[14px] z-40">
          <button ref={copyRef}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 7C0 2.98858 2.97065 0 7 0C11.0293 0 14 2.98858 14 7C14 11.0114 11.0293 14 7 14C2.97065 14 0 11.0114 0 7ZM12.6253 7C12.6253 3.69178 10.2709 1.3105 6.9842 1.3105C3.69752 1.3105 1.35892 3.69178 1.35892 7C1.35892 10.3082 3.71332 12.6895 7 12.6895C10.2867 12.6895 12.6411 10.3082 12.6411 7H12.6253ZM8.88036 5.06621C8.53273 4.71461 8.04289 4.34703 7.18962 4.34703C5.75169 4.34703 4.78781 5.38584 4.78781 6.96804C4.78781 8.55023 5.8465 9.63699 7.39503 9.63699C8.32731 9.63699 8.73815 9.26941 9.03837 8.88584C9.3544 8.4863 9.57562 8.19863 9.86004 8.19863C10.1129 8.19863 10.3183 8.37443 10.3183 8.77397C10.3183 9.33333 10.0813 10.0046 9.73363 10.3402C9.386 10.6758 8.59594 11.0274 7.36343 11.0274C4.80361 11.0274 3.08126 9.46119 3.08126 7.11187C3.08126 4.76256 4.78781 3.00457 7.30023 3.00457C8.37472 3.00457 9.18059 3.35616 9.57562 3.73973C9.97065 4.12329 10.1603 4.79452 10.1603 5.21005C10.1603 5.59361 9.97065 5.73744 9.73363 5.73744C9.41761 5.73744 9.19639 5.44977 8.84876 5.09817L8.88036 5.06621Z" fill="black" />
            </svg>
          </button>
        </div>
        <div
          className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] bg-black z-40 transition-all duration-500"
          style={getTypePosition()}
        ></div>
        <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] bottom-[14px] bg-black z-40"></div>
        <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] top-[14px] bg-black z-40"></div>
      </div>

      {/* Animation & Calendar */}
      <FullWidthWord lenisScrollY={lenisScrollY} />

      <Suspense>
        {/* Replace with your actual ArtistsResidencyAndCalendar component */}
        <ArtistsResidencyAndCalendar
          home={home}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          activeButton={activeButton}
          filteredAgentes={filteredAgentes}
          filteredLocalidades={filteredLocalidades}
          existingLocalidadeDocs={existingLocalidadeDocs}
          setActiveButton={setActiveButton}
        >
          {children}
        </ArtistsResidencyAndCalendar>
      </Suspense>

      {/* Bottom Buttons */}
      {isAtBottom && selectedLocalidade != null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed w-1/2 pl-[40px] bottom-[8px] flex items-start justify-start left-0 transform z-40 text-[1.6rem] text-[#756D47]"
        >
          <div className="w-[50%]">
            <button
              className={`text-link ${activeButton === "Sobre" ? "active text-black" : ""}`}
              onClick={() => handleButtonClick("Sobre")}
              onMouseEnter={() => handleButtonClick("Sobre")}
            >
              Sobre
            </button>
          </div>
          <div className="w-[50%]">
            <button
              className={`text-link ${activeButton === "Apoios" ? "active text-black" : ""}`}
              onClick={() => handleButtonClick("Apoios")}
              onMouseEnter={() => handleButtonClick("Apoios")}
            >
              Apoios
            </button>
          </div>
        </motion.div>
      )}

      {showCopiedBox && (
        <motion.div
          initial={{ scale: 0, opacity: 0, transformOrigin: "bottom right" }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.125, ease: "easeOut" }}
          className="fixed bottom-[28px] right-[28px] w-[calc(100vw-55px)] md:w-[calc(50vw-35px)] h-[calc(50vh-35px)] md:h-[calc(25vh-35px)] bg-black text-white z-50 p-[14px] font-ramboia text-[1.2rem] flex origin-bottom-right"
        >
          <div className="w-[50%]"></div>
          <div className="flex flex-col w-[100%] md:w-[50%] text-end h-full">
            <p>Filipa Morgado, <i>direção</i></p>
            <p>Gonçalo Fialho, <i>design</i></p>
            <p>David Reis, <i>programador</i></p>
            <p className="mt-auto">© 2025. All rights reserved</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
