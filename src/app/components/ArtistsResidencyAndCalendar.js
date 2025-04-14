"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Calendar from "@/app/components/Calendar";

export default function ArtistsResidencyAndCalendar({home}) {
  const [initialFontSize, setInitialFontSize] = useState("10vh");
  const [isH2Visible, setIsH2Visible] = useState(false);
  // const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const marginTop = useTransform(scrollYProgress, [0, 0.5], ["0px", "40px"]);
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
        <div className="w-1/2 ">
        <motion.h2
          className="text-[1.95rem] font-medium font-ramboia mt-24 pr-[21px] sticky top-[60px]"
          style={{
            x: h2XPosition,
            pointerEvents: isH2Visible ? "auto" : "none",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          O projecto MANIF – Coimbra nasce num processo de escuta activa, olhar e pensamento atento, crítico e construtivo sobre o Lugar da Justiça no nosso território, e na urgência demonstrada pelo seu corpo interno de profissionais em tecer novas pontes de encontro transversais a outras áreas do conhecimento e reforçar alicerces no diálogo com toda a sociedade. A heterogeneidade das comunidades, a crise ambiental e climática, o crescente espaço de questionamento público sobre as diferentes formas de Ser e Estar no mundo global e glocal, impelem a exigência de tornar estes espaços de representação, decisão e julgamento, em lugares inequivocamente transparentes e abertos.
        </motion.h2>
        </div>

        <motion.div
          className="w-1/2"
          style={{
            x: calendarXPosition,
          }}
        >
          <Calendar home={home} />
        </motion.div>
      </div>
    </div>
  );
}