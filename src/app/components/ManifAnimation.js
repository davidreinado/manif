"use client";
import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";

const FullWidthWord = forwardRef((props, ref) => {
  const [fontSize, setFontSize] = useState("0px");
  const [scale, setFontScale] = useState(1);
  const wordRef = useRef(null);
  const lenisRef = useRef(null);
  const lenisScrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.02,
      duration: 0.8,
      easing: (t) => t,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      lenisScrollY.set(lenis.scroll);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [lenisScrollY]);

  const fontSizeScale = useTransform(lenisScrollY, [0, 300], [1, scale]);
  const marginLeft = useTransform(lenisScrollY, [0, 300], ["18px", "10px"]);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      const baseWidth = 1280;
      const baseFontSize = 467;
      const newFontSize = baseFontSize * (width / baseWidth);
      setFontSize(`${newFontSize}px`);

      const scrollScale = (20 * 100) / newFontSize;
      setFontScale(scrollScale / 100);
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div className="w-screen h-[100vh]">
      <div className="w-screen h-screen flex items-start justify-start text-start sticky top-0">
        <motion.a
          href="/"
          ref={wordRef}
          className="font-cc font-bold leading-[0.95] whitespace-nowrap top-[10px] fixed"
          style={{
            fontSize,
            scale: fontSizeScale,
            marginLeft,
            transformOrigin: "left top",
            maxWidth: "100vw",
          }}
        >
          <h1>
          MANIF
          </h1>
        </motion.a>
      </div>
    </div>
  );
});

FullWidthWord.displayName = "FullWidthWord";

export default FullWidthWord;
