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
  const lenisScrollY = useMotionValue(0);
  const searchParams = useSearchParams();

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
        return { top: "50.5vh" };
      case "Obras":
        return { top: "60.5vh" };
      case "Mediação":
        return { top: "67.5vh" };
      default:
        return { top: "50.5vh" };
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
        <div className="w-[14px] h-[14px] fixed right-[14px] bottom-[14px] bg-black z-40"></div>
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
    </div>
  );
}
