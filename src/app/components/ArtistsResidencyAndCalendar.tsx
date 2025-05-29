"use client";
import { useState, useEffect, useRef, ReactNode, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Calendar from "@/app/components/Calendar";
import EventItem from "./EventItem";
import { PrismicRichText } from "./PrismicRichText";
import slugify from "@sindresorhus/slugify";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useFiltroStore } from "@/app/stores/useFiltroStore";
import { useThemeStore } from "../stores/useThemeStore";

type ArtistsResidencyAndCalendarProps = {
  home: any;
  selectedType: any;
  setSelectedType: any;
  activeButton: any;
  filteredLocalidades: any;
  filteredAgentes: any;
  existingLocalidadeDocs: any;
  children?: ReactNode;
  setActiveButton: any;
};

export default function ArtistsResidencyAndCalendar({
  home,
  selectedType,
  setSelectedType,
  activeButton,
  filteredLocalidades,
  filteredAgentes,
  existingLocalidadeDocs,
  children,
  setActiveButton,
}: ArtistsResidencyAndCalendarProps) {
  const pathname = usePathname();
  const [initialFontSize, setInitialFontSize] = useState("14vh");
  const [isH2Visible, setIsH2Visible] = useState(false);
  const [scrollRangeStart, setScrollRangeStart] = useState(0.8);

  const filtro = useFiltroStore((state) => state.filtro);
  const setFiltro = useFiltroStore((state) => state.setFiltro);

  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const setSecondaryColor = useThemeStore((state) => state.setSecondaryColor);

  const searchParams = useSearchParams();
  const [localidadeDoc, setLocalidadeDoc] = useState(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  // Sync filtro Zustand state with the URL param "localidade"
  useEffect(() => {
    const match = pathname.match(/^\/filtro\/([^/]+)/);
    if (match) {
      const uid = match[1];
      setFiltro(uid);
    } else {
      setFiltro(""); // clear if not on /filtro/[uid]
    }

    if (pathname === '/') {
      setPrimaryColor("#fffff");
      setSecondaryColor("#808080")
    }

  }, [pathname]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const marginTop = useTransform(scrollYProgress, [0, 0.5], ["0px", "62px"]);
  const fontSize = useTransform(scrollYProgress, [0, 1], [
    initialFontSize,
    "20px",
  ]);
  const h2XPosition = useTransform(scrollYProgress, [scrollRangeStart, 1], [
    "-130%",
    "0%",
  ]);
  const calendarXPosition = useTransform(scrollYProgress, [0.5, 1], [
    "100%",
    "0%",
  ]);

  useMotionValueEvent(h2XPosition, "change", (latest) => {
    setIsH2Visible(latest > "-100%");
  });

  useEffect(() => {
    const chosenFilter = searchParams.get("localidade");

    if (chosenFilter) {
      const selectedDoc = existingLocalidadeDocs.find(
        (doc) => doc.uid === chosenFilter
      );
      setLocalidadeDoc(selectedDoc);
    } else {
      setLocalidadeDoc(null);
    }
  }, [searchParams, existingLocalidadeDocs]);

  useEffect(() => {
    const updateLayout = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const isMobile = width < 768;

      const fontSize = isMobile ? height * 0.08 : height * 0.27;
      setInitialFontSize(`${fontSize}px`);
      setScrollRangeStart(isMobile ? 0.4 : 0.8);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Filter agenda
  const agenda = useMemo(() => home?.data?.agenda ?? [], [home]);

  const filteredAgenda = useMemo(() => {
    return agenda.filter((item) =>
      selectedType ? item.tipo === selectedType : true
    );
  }, [agenda, selectedType]);

  const usedLocalidadeUIDs = new Set(
    filteredAgenda.map((item) => slugify(item.localidade))
  );
  const usedAgenteUIDs = new Set(
    filteredAgenda.map((item) => slugify(item.agente)).filter(Boolean)
  );

  return (
    <div
      ref={containerRef}
      className="font-ramboia h-[200vh] flex flex-col justify-between text-start mx-[14px] md:mx-[42px] relative"
    >
      {/* Sticky H2 */}
      <div
        ref={textRef}
        className="sticky top-0 h-screen flex items-start justify-start"
      >
        <motion.h2
          className="font-bold italic leading-[1.120] sm:leading-[1.1] md:leading-none mr-[45px] select-none"
          style={{
            fontSize,
            transformOrigin: "top left",
            marginTop,
          }}
        >
          Residências artísticas nos espaços da justiça
        </motion.h2>
      </div>

      {/* Bio / Apoios + Calendar */}
      <div className="h-screen block lg:flex justify-between z-10">
        {/* Left Side */}
        {filtro === "" && (
          <div className="w-full lg:w-1/2">
            {activeButton === "Sobre" && (
              <motion.div
                className="text-[1.95rem] font-medium font-ramboia mt-[88px] pr-[21px] sticky top-[60px]"
                style={{
                  x: h2XPosition,
                  pointerEvents: isH2Visible ? "auto" : "none",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {home?.data.bio && (
                  <PrismicRichText
                    field={home?.data.bio}
                    components={{
                      paragraph: ({ children }) => <h3>{children}</h3>,
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeButton === "Apoios" && localidadeDoc && (
              <motion.div className="text-[1.2rem] font-medium font-ramboia mt-24 pr-[21px] sticky top-[60px]">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.125 }}
                    className="mb-8"
                  >
                    <div className="flex flex-wrap gap-4">
                      {Array.from({ length: 10 }).map((_, index) => {
                        const key = `imagem_${index + 1}`;
                        const image = localidadeDoc.data[key];

                        return (
                          image?.url && (
                            <Image
                              key={key}
                              src={image.url}
                              alt={image.alt || `Imagem ${index + 1}`}
                              width={100}
                              height={80}
                              className="my-4 grayscale"
                              style={{ height: "80px", width: "auto" }}
                            />
                          )
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

        {/* Render children only when filtro is not empty */}
        {children && (
          <motion.div className={`w-full lg:w-1/2 ${filtro !== "" ? "block" : "hidden"}`}>{children}</motion.div>
        )}

        {/* Right Side: Calendar */}
        {filteredLocalidades.length > 0 && filteredAgentes.length > 0 && (
          <motion.div className="w-full lg:w-1/2" style={{ x: calendarXPosition }}>
            <Calendar
              home={home}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              agenda={filteredAgenda}
              localidades={filteredLocalidades}
              agentes={filteredAgentes}
              setActiveButton={setActiveButton}
            />
          </motion.div>
        )}
      </div>

      {/* Events */}
      <AnimatePresence>
        {home?.data?.Eventos?.map((event, index) => (
          <motion.div
            key={event.id ?? `event-${index}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.125 }}
          >
            <EventItem event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
