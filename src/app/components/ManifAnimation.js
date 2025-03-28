"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";

export default function FullWidthWord() {
    const [fontSize, setFontSize] = useState("0");
    const [scale, setFontScale] = useState(0);
    const wordRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            smooth: true,        // Enable smooth scrolling
            lerp: 0.03,          // Extremely slow interpolation (no fast jumps)
            duration: 4,         // Extremely slow scroll duration (long time to scroll)
            easing: (t) => t,    // Linear easing (no easing curve)

        });

        const onScroll = (time) => {
            lenis.raf(time); // Update Lenis on each frame
        };

        const raf = (time) => {
            onScroll(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy(); // Clean up Lenis on unmount
        };
    }, []);

    // Use Framer Motion's useScroll with Lenis
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const fontSizeScale = useTransform(
        scrollYProgress,
        [0, 0.5], // Adjust scroll range for faster/slower animation
        [1, scale]
    );

    const marginLeft = useTransform(
        scrollYProgress,
        [0, 0.5],
        ["18px", "10px"]
    );

    useEffect(() => {
        const updateFontSize = () => {
            const width = window.innerWidth;
            const wordWidth = wordRef.current?.offsetWidth || 0;
            let newFontSize = width * 0.40;

            if (wordWidth > width) {
                newFontSize = (width / wordWidth) * newFontSize;
            }

            let paddingFontSize = newFontSize - 45;
            setFontScale((20 * 100 / paddingFontSize) / 100);
            setFontSize(`${paddingFontSize}px`);
        };

        updateFontSize();
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    return (
        <div ref={containerRef} className="w-screen h-[100vh]"> {/* Adjust height as needed */}
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