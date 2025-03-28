"use client";
import { useState, useRef, useEffect } from "react";
import ManifAnimation from "@/app/components/ManifAnimation"
import ArtistsResidencyAndCalendar from "@/app/components/ArtistsResidencyAndCalendar"
import { motion } from "framer-motion";

export default function Cerebro() {
    const navRef = useRef(null);
    const [activeButton, setActiveButton] = useState(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const getNavPosition = () => {
        switch(activeButton) {
            case 'Sobre':
                return { left: '14px' };
            case 'Residentes':
                return { left: '25%' };
            default:
                return { left: '14px' };
        }
    };

    useEffect(() => {
        const checkScrollPosition = () => {
            // Check if we're at the bottom of the page
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
            setIsAtBottom(isBottom);
        };

        // Add scroll event listener
        window.addEventListener('scroll', checkScrollPosition);
        
        // Check immediately in case we're already at the bottom
        checkScrollPosition();

        // Cleanup
        return () => window.removeEventListener('scroll', checkScrollPosition);
    }, []);

    return (
        <div>
            <div>
                <div className="w-[14px] h-[14px] fixed right-[14px] top-[14px] bg-black z-10"></div>
                <div className="w-[14px] h-[14px] fixed right-[14px] top-[calc(50vh-7px)] bg-black z-10"></div>
                <div className="w-[14px] h-[14px] fixed left-[14px] top-[calc(50vh-7px)] bg-black z-10"></div>
                
                <div 
                    ref={navRef} 
                    className="w-[14px] h-[14px] fixed bottom-[14px] bg-black z-10 transition-all duration-500"
                    style={getNavPosition()}
                ></div>
                
                <div className="w-[14px] h-[14px] fixed right-[14px] bottom-[14px] bg-black z-10"></div>
                <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] top-[calc(50vh+7px)] bg-black z-10"></div>
                <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] bottom-[14px] bg-black z-10"></div>
                <div className="w-[14px] h-[14px] fixed left-[calc(50vw-7px)] top-[14px] bg-black z-10"></div>
            </div>

            <ManifAnimation />
            <ArtistsResidencyAndCalendar />
            
            {/* Only show buttons when at bottom */}
            {isAtBottom && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed w-1/2 pl-[40px] bottom-[8px] flex items-start justify-start left-0 transform z-40 text-[1.6rem] text-[#808080]"
                >
                    <div className="w-[50%]">
                    <button 
                        className={`text-link ${activeButton == null || activeButton == "Sobre" ? "active" : ""}`}
                        onClick={() => handleButtonClick('Sobre')}
                        onMouseEnter={() => handleButtonClick('Sobre')}
                    >
                        Sobre
                    </button>
                    </div>

                    <div className="w-[50%]">
                    <button 
                        className={`text-link ${activeButton != null && activeButton == "Residentes" && "active"}`}
                        onClick={() => handleButtonClick('Residentes')}
                        onMouseEnter={() => handleButtonClick('Residentes')}

                    >
                        Residentes
                    </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}