"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";

export default function FullWidthWord() {
    const [fontSize, setFontSize] = useState("0px");
    const [scale, setFontScale] = useState(1);
    const wordRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            smooth: true,
            lerp: 0.03,
            duration: 4,
            easing: (t) => t,
        });

        const onScroll = (time) => lenis.raf(time);
        const raf = (time) => {
            onScroll(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Framer Motion scroll transforms
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Scaling based on scroll
    const fontSizeScale = useTransform(scrollYProgress, [0, 0.5], [1, scale]);
    const marginLeft = useTransform(scrollYProgress, [0, 0.5], ["18px", "10px"]);

    // Responsive font size
    useEffect(() => {
        const updateFontSize = () => {
            const width = window.innerWidth;
            const baseWidth = 1280;
            const baseFontSize = 467;

            // Proportional scale: scale font size based on viewport width
            let newFontSize = baseFontSize * (width / baseWidth);

            // Set font size based on calculated value
            setFontSize(`${newFontSize}px`);

            // Calculate scale for scroll effect (to match your original scroll behavior)
            const scrollScale = 20 * 100 / newFontSize;
            const calculatedScale = scrollScale / 100;

            // Store the scale for the scroll transformation (maintaining behavior across screens)
            setFontScale(calculatedScale);
        };

        updateFontSize();
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    return (
        <div ref={containerRef} className="w-screen h-[100vh]">
            <div className="w-screen h-screen flex items-start justify-start text-start sticky top-0">
                <motion.h1
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
                    MANIF
                </motion.h1>
            </div>
        </div>
    );
}
