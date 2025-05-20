"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import ArtistsResidencyAndCalendar from "@/app/components/ArtistsResidencyAndCalendar";
import { motion } from "framer-motion";
import FullWidthWord from "@/app/components/ManifAnimation";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

// ✅ Define the props type
interface CerebroProps {
  home: any;
  filteredLocalidades: any[];
  filteredAgentes: any[];
  existingLocalidadeDocs: any[];
  children: ReactNode;
}

// ✅ Add the props type to the component
export default function Cerebro({
  home,
  filteredLocalidades,
  filteredAgentes,
  existingLocalidadeDocs,
  children,
}: CerebroProps) {
  const navRef = useRef(null);
  const typeRef = useRef(null);
  const lenisControlRef = useRef(null);
  const searchParams = useSearchParams();

  const [activeButton, setActiveButton] = useState("Sobre");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLocalidade, setSelectedLocalidade] = useState(null);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

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


  useEffect(() => {
    const filter = searchParams.get('localidade');

    setSelectedLocalidade(filter);

    if (filter) {
      setActiveButton("Apoios");
    }
    else {
      setActiveButton("Sobre");
    }
  }, [searchParams]); // ✅ react to actual pathname changes


  // ✅ Automatically activate "Apoios" if selectedLocalidade is not null
  useEffect(() => {
    if (selectedLocalidade) {
      setActiveButton("Apoios");
    }
  }, [selectedLocalidade]);

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
        return { top: "calc(50vh + 7px)" };
      case "Obras":
        return { top: "calc(50vh + 36px)" };
      case "Mediação":
        return { top: "calc(50vh + 114px)" };
      default:
        return { top: "calc(50vh + 7px)" };
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
          ref={navRef}
          className="w-[14px] h-[14px] fixed bottom-[14px] bg-black z-40 transition-all duration-500"
          style={getNavPosition()}
        ></div>
        <div className="w-[14px] h-[14px] fixed right-[14px] bottom-[14px] bg-black z-40"></div>
        <div
          ref={typeRef}
          className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] bg-black z-40 transition-all duration-500"
          style={getTypePosition()}
        ></div>
        <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] bottom-[14px] bg-black z-40"></div>
        <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] top-[14px] bg-black z-40"></div>
      </div>

      {/* Animation & Calendar */}
      <FullWidthWord ref={lenisControlRef} />

      <Suspense fallback={null}>
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
              className={`text-link ${activeButton === "Sobre" ? "active text-black" : ""
                }`}
              onClick={() => handleButtonClick("Sobre")}
              onMouseEnter={() => handleButtonClick("Sobre")}
            >
              Sobre
            </button>
          </div>
          <div className="w-[50%]">
            <button
              className={`text-link ${activeButton === "Apoios" ? "active text-black" : ""
                }`}
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
