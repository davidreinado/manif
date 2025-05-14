"use client";

import { useState, useEffect, useRef } from "react";
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
import { useMemo } from "react";
import { createClient } from "@/prismicio";
import { usePathname } from 'next/navigation';
import { useSearchParams } from "next/navigation";

export default function ArtistsResidencyAndCalendar({
  home,
  selectedType,
  setSelectedType,
  activeButton,
  filteredLocalidades,
  filteredAgentes,
  selectedLocalidade,
  existingLocalidadeDocs,
  children,
  setActiveButton
}) {
  const pathname = usePathname();
  const [initialFontSize, setInitialFontSize] = useState("10vh");
  const [isH2Visible, setIsH2Visible] = useState(false);
  const [scrollRangeStart, setScrollRangeStart] = useState(0.8);
  const [filtro, setFiltro] = useState("");
  const searchParams = useSearchParams();
  const [localidadeDoc, setLocalidadeDoc] = useState(null);




  const containerRef = useRef(null);
  const textRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const marginTop = useTransform(scrollYProgress, [0, 0.5], ["0px", "52px"]);
  const fontSize = useTransform(scrollYProgress, [0, 1], [initialFontSize, "20px"]);
  const h2XPosition = useTransform(scrollYProgress, [scrollRangeStart, 1], ["-130%", "0%"]);
  const calendarXPosition = useTransform(scrollYProgress, [0.5, 1], ["100%", "0%"]);

  useMotionValueEvent(h2XPosition, "change", (latest) => {
    setIsH2Visible(latest > "-100%");
  });

  // useEffect(() => {
  //   console.log('Filtro changed:', filtro);
  //   console.log('localidadeDoc:', localidadeDoc);
  //   console.log('selectedLocalidade:', localidadeDoc);
  // }, [filtro]);

  useEffect(() => {
    console.log('Path changed:', pathname);
    if (!pathname.includes('/filtro')) {
      setFiltro("");
    }
  }, [pathname]);

  useEffect(() => {
    const chosenFilter = searchParams.get('localidade');

    if (chosenFilter) {
      const selectedDoc = existingLocalidadeDocs.find(
        (doc) => doc.uid === chosenFilter)
      setLocalidadeDoc(selectedDoc);
    }
    else {
      setLocalidadeDoc(null)
    }
  }, [searchParams]); // ✅ react to actual pathname changes

  useEffect(() => {
    const updateLayout = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const isMobile = width < 768;

      const fontSize = isMobile ? height * 0.08 : height * 0.2187;
      setInitialFontSize(`${fontSize}px`);
      setScrollRangeStart(isMobile ? 0.4 : 0.8);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // 🔽 Filter agenda
  const agenda = useMemo(() => home?.data?.agenda ?? [], [home]);

  const filteredAgenda = useMemo(() => {
    return agenda.filter((item) =>
      selectedType ? item.tipo === selectedType : true
    );
  }, [agenda, selectedType]);

  const usedLocalidadeUIDs = new Set(filteredAgenda.map((item) => slugify(item.localidade)));
  const usedAgenteUIDs = new Set(
    filteredAgenda.map((item) => slugify(item.agente)).filter(Boolean)
  );

  // // 🔄 Check existing UIDs and filter data
  // useEffect(() => {
  //   const checkUIDs = async () => {
  //     const client = createClient(); // configure appropriately for client-side

  //     const existingLocalidadeUIDs = [];
  //     const existingAgenteUIDs = [];


  //     await Promise.all(
  //       Array.from(usedLocalidadeUIDs).map(async uid => {
  //         try {
  //           const doc = await client.getByUID("local", uid);
  //           if (doc) {
  //             existingLocalidadeUIDs.push(doc);
  //           }
  //         } catch (error) {
  //           // Do nothing if doc not found or error occurs
  //         }
  //       })
  //     );

  //     await Promise.all(
  //       Array.from(usedAgenteUIDs).map(async uid => {
  //         try {
  //           const doc = await client.getByUID("filtro", uid);
  //           if (doc) {
  //             existingAgenteUIDs.push(doc);
  //           }
  //         } catch (error) {
  //           // Do nothing if doc not found or error occurs
  //         }
  //       })
  //     );

  //     const localidadeUIDs = existingLocalidadeUIDs.map(doc => doc.uid);
  //     const agendaUIDs = existingAgenteUIDs.map(doc => doc.uid);

  //     const localidades = filteredAgenda.filter((item) =>
  //       localidadeUIDs.includes(slugify(item.localidade))
  //     ) ?? [];

  //     const agentes = filteredAgenda.filter((item) =>
  //       agendaUIDs.includes(slugify(item.agente))
  //     ) ?? [];

  //     setFilteredLocalidades(localidades);
  //     setFilteredAgentes(agentes);
  //   };

  //   if (filteredAgenda.length > 0 && filteredLocalidades.length == 0) {
  //     checkUIDs();
  //   }
  // }, [filteredAgenda]);

  return (
    <div
      ref={containerRef}
      className="font-ramboia h-[200vh] flex flex-col justify-between text-start mx-[14px] md:mx-[42px] relative"
    >
      {/* Sticky H2 */}

      <div ref={textRef} className="sticky top-0 h-screen flex items-start justify-start">
        <motion.h2
          className="font-bold italic leading-[1.120] sm:leading-[1.1] md:leading-none mr-[45px]"
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
        {filtro == "" && (
          <div className="w-full lg:w-1/2">
            {activeButton === "Sobre" && (
              <motion.div
                className="text-[1.95rem] font-medium font-ramboia mt-[100px] md:mt-24 pr-[21px] sticky top-[60px]"
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
                            <img
                              key={key}
                              src={image.url}
                              alt={image.alt || `Imagem ${index + 1}`}
                              className="my-4 h-[80px] grayscale"
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

        {children && filtro != "" && (<motion.div className="w-full lg:w-1/2">
          {children}
        </motion.div>)}


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
              setFiltro={setFiltro}
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
