"use client";

import { useState, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";


export default function FullWidthWord({ lenisScrollY }) {
  const [fontSize, setFontSize] = useState("0px");
  const [scale, setFontScale] = useState(1);

  // Scale and margin transform based on lenisScrollY motion value
  const fontSizeScale = useTransform(lenisScrollY, [0, 300], [1, scale]);
  const marginLeft = useTransform(lenisScrollY, [0, 300], ["18px", "10px"]);

  // Update font size and scale on window resize
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
        <motion.h1
          className="font-cc font-bold leading-[0.95] whitespace-nowrap top-[10px] fixed select-none"
          style={{
            fontSize,
            scale: fontSizeScale,
            marginLeft,
            transformOrigin: "left top",
            maxWidth: "100vw",
          }}
        >
          MANIF
        </motion.h1>
      </div>
    </div>
  );
}
