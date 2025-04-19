"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Calendar from "@/app/components/Calendar";
import EventItem from "./EventItem"; // Assuming you have an EventItem component
import { PrismicRichText } from "./PrismicRichText";

export default function ArtistsResidencyAndCalendar({
  home,
  selectedType,
  setSelectedType,
  activeButton,
}) {
  const [initialFontSize, setInitialFontSize] = useState("10vh");
  const [isH2Visible, setIsH2Visible] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const marginTop = useTransform(scrollYProgress, [0, 0.5], ["0px", "52px"]);
  const fontSize = useTransform(scrollYProgress, [0, 1], [initialFontSize, "20px"]);
  const h2XPosition = useTransform(scrollYProgress, [0.8, 1], ["-130%", "0%"]);
  const calendarXPosition = useTransform(scrollYProgress, [0.5, 1], ["100%", "0%"]);

  useMotionValueEvent(h2XPosition, "change", (latest) => {
    setIsH2Visible(latest > "-100%");
  });

  useEffect(() => {
    const updateFontSize = () => {
      const height = window.innerHeight / 4;
      setInitialFontSize(`${height * 1}px`);
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div ref={containerRef} className="font-ramboia h-[200vh] flex flex-col justify-between text-start mx-[42px] relative">
      <div ref={textRef} className="sticky top-0 h-screen flex items-start justify-start">
        <motion.h3
          className="font-bold italic leading-none mr-[45px]"
          style={{
            fontSize,
            transformOrigin: "top left",
            marginTop,
          }}
        >
          Residências artísticas nos espaços da justiça
        </motion.h3>
      </div>

      <div className="h-screen flex justify-between z-10">
        {/* Left Side: Text or Apoios */}
        <div className="w-1/2">
          {activeButton === "Sobre" && (
            <motion.div
              className="text-[1.95rem] font-medium font-ramboia mt-24 pr-[21px] sticky top-[60px]"
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
                    paragraph: ({ children }) => (
                      <h3>{children}</h3>
                    ),
                  }}
                />
              )}
            </motion.div>
          )}

          {activeButton === "Apoios" && home?.data.Apoios?.length > 0 && (
            <motion.div className="text-[1.2rem] font-medium font-ramboia mt-24 pr-[21px] sticky top-[60px]">
              <AnimatePresence>
                {home.data.Apoios.map((apoio, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.125 }}
                    className="mb-8"
                  >
                    <div className="flex w-full gap-[14px]">
                      {apoio.texto?.map((para, idx) => (
                        <p key={idx} className="mb-2 whitespace-pre-wrap">
                          {para.text}
                        </p>
                      ))}

                      {apoio.texto_2?.map((para, idx) => (
                        <p key={idx} className="mb-2 whitespace-pre-wrap">
                          {para.text}
                        </p>
                      ))}
                    </div>
                    <div className="flex">
                      {[...Array(12)].map((_, i) => {
                        const img = apoio[`imagem_${i + 1}`];
                        return img?.url ? (
                          <img
                            key={i}
                            src={img.url}
                            alt={img.alt || ""}
                            className="my-4 h-[80px] grayscale"
                          />
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right Side: Calendar */}
        <motion.div className="w-1/2" style={{ x: calendarXPosition }}>
          <Calendar home={home} selectedType={selectedType} setSelectedType={setSelectedType} />
        </motion.div>
      </div>

      {/* Event Items Section */}
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
