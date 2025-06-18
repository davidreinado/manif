"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { PrismicRichText } from "./PrismicRichText";
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import slugify from "@sindresorhus/slugify";
import { useFiltroStore } from '@/app/stores/useFiltroStore';
import { useRouter } from 'next/navigation';
import CustomScrollbar from '@/app/components/CustomScrollbar';
import { useThemeStore } from "@/app/stores/useThemeStore"; // Make sure this import is present
import { usePathname } from "next/navigation";
import path from 'path';
import CombinedFilters from "./CombinedFilters"
import TypeOptionsFilter from "./TypeOptionsFilter"
import DistrictsFilter from "./DistrictsFilter"


export default function Calendar({ home, selectedType, setSelectedType, agenda, localidades: localidadesPages = [], agentes: agentesPages = [], setActiveButton }) {
  // State declarations
  const districts = [...new Set(home.data.agenda.map(item => item.distrito))];
  const years = [...new Set(home.data.agenda.map(item => item.ano))];
  const months = [...new Set(home.data.agenda.map(item => item.mes))];
  const setFiltro = useFiltroStore((state) => state.setFiltro);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [clickedType, setClickedType] = useState(null);
  const [selectedCombinedFilter, setSelectedCombinedFilter] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const typeOptions = {
    "Residência": <>Artistas<br />Residentes</>,
    "Exposição": "Exposições",
    "Mediação": "Mediação"
  };

  const router = useRouter();
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const frostyRef = useRef(null);
  const mobileFilterRef = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredMonths, setHoveredMonths] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredCombinedFilter, setHoveredCombinedFilter] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);

  const secondaryColor = useThemeStore((state) => state.secondaryColor);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  const [backgroundColor, setBackgroundColor] = useState("#808080");
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);

  const toggleMobileFilter = () => {
    setIsMobileFilterVisible(prev => !prev);
  };

  const itemMatchesType = (item, selectedType) => {
    if (!selectedType) return true;

    const typeMap = {
      "Residência": item.residencia,
      "Exposição": item.exposicao,
      "Mediação": item.mediacao
    };

    return Boolean(typeMap[selectedType]);
  };


  // Filtered data calculations
  const filteredLocalidades = [...new Set(
    home.data.agenda
      .filter(item => itemMatchesType(item, selectedType))
      .map(item => item.localidade)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const filteredAgentes = [...new Set(
    home.data.agenda
      .filter(item => itemMatchesType(item, selectedType))
      .map(item => item.agente)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const allLocalidades = Array.from(new Set([...filteredLocalidades]));
  const allAgentes = Array.from(new Set([...filteredAgentes]));

  const localidadesUIDs = localidadesPages.map(l => slugify(l.localidade));
  const agentesUIDs = agentesPages.map(a => slugify(a.agente));

  const combinedFilters = selectedType !== null
    ? allAgentes.map(agente => ({ type: 'agente', label: agente }))
    : [
      ...allLocalidades.map(loc => ({ type: 'localidade', label: loc })),
    ];

  const filteredAgenda = useMemo(() => {
    if (!home?.data?.agenda) return [];

    // Função que verifica se o item tem o tipo selecionado em algum dos campos
    const itemMatchesType = (item, selectedType) => {
      if (!selectedType) return true; // se não há filtro por tipo, aceita tudo

      const typeMap = {
        "Residência": item.residencia,
        "Exposição": item.exposicao,
        "Mediação": item.mediacao,
      };

      return Boolean(typeMap[selectedType]);
    };

    return home.data.agenda.filter(item => {
      return (
        (selectedYear ? item.ano === selectedYear : true) &&
        (selectedMonth ? item.mes === selectedMonth : true) &&
        (selectedDistrict ? item.distrito === selectedDistrict : true) &&
        itemMatchesType(item, selectedType) &&
        (selectedCombinedFilter
          ? selectedCombinedFilter.type === 'agente'
            ? item.agente === selectedCombinedFilter.label
            : item.localidade === selectedCombinedFilter.label
          : true)
      );
    });
  }, [home, selectedYear, selectedMonth, selectedDistrict, selectedType, selectedCombinedFilter]);

  // Lenis initialization with optimized frosty effect
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 768)

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    primaryColor == "#FC3370" ? setBackgroundColor("rgba(252,51,112,0.3)") : primaryColor == "#FF5A16" ? setBackgroundColor("rgba(255,90,22,0.3)") : primaryColor == "#FAB617" ? setBackgroundColor("rgba(250,182,23,0.3)") : setBackgroundColor("rgba(256,256,256,0.3)")
  }, [pathname, primaryColor])

  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    const osInstance = scrollContainerRef.current.closest('[data-overlayscrollbars]');
    const nativeScrollContainer = osInstance?.querySelector('[data-overlayscrollbars-viewport]');

    if (!nativeScrollContainer) return;

    const lenis = new Lenis({
      wrapper: nativeScrollContainer,
      content: nativeScrollContainer.firstElementChild,
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => t,
      gestureDirection: 'vertical',
      smoothTouch: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Optimized scroll handler for frosty effect
    const handleScroll = ({ scroll }) => {
      if (!frostyRef.current) return;

      // Direct style manipulation for better performance
      const opacity = Math.min(scroll / 30, 1);
      frostyRef.current.style.opacity = opacity;
      frostyRef.current.style.willChange = 'opacity';
    };

    lenis.on('scroll', handleScroll);
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.off('scroll', handleScroll);
      lenis.destroy();
    };
  }, [isMounted, filteredAgenda]);

  // Handler functions
  const toggleDistrict = (district) => {
    setSelectedDistrict(prev => prev === district ? null : district);
  };

  const toggleType = (type) => {
    const newType = clickedType === type ? null : type;
    setClickedType(newType);
    setSelectedType(newType);
    setSelectedCombinedFilter(null);
    router.push('/', { scroll: false }); // Go to home
  };

  const toggleMonth = (month) => {
    setSelectedMonth(prev => prev === month ? null : month);
  };

  // Render
  return (
    <div className="w-full py-[14px] pl-0 md:pl-[21px] flex flex-col lg:flex-row justify-between">
      {/* Left sidebar */}
      <div className="w-full lg:w-[20%] mb-4 lg:mb-0">
        <div className="hidden sticky top-0 pt-[14px] h-[calc(100vh-8px)] md:flex flex-col">
          <div className='h-[50%] mt-0'>
            <DistrictsFilter
              districts={districts}
              selectedDistrict={selectedDistrict}
              hoveredDistrict={hoveredDistrict}
              setHoveredDistrict={setHoveredDistrict}
              setSelectedDistrict={setSelectedDistrict}
              setActiveButton={setActiveButton}
              setFiltro={setFiltro}
              router={router}
              pathname={pathname}
              secondaryColor={secondaryColor}
              setSelectedType={setSelectedType}
            />
          </div>
          {/* Type Options Filter */}
          <div className='h-[50%] mt-[8px] hidden md:block'>
            <TypeOptionsFilter
              typeOptions={typeOptions}
              selectedType={selectedType}
              hoveredType={hoveredType}
              setHoveredType={setHoveredType}
              setSelectedType={setSelectedType}
              setSelectedCombinedFilter={setSelectedCombinedFilter}
              router={router}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div className="w-full lg:w-[80%] flex flex-col lg:pt-[20px]">

        <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[7px] leading-none mb-[14px]">
          {/* Botões de ano */}
          {years.map((year) => {
            const isSelected = selectedYear === null || selectedYear === year;
            const isHovered = hoveredYear === year;
            const isOtherHovered = hoveredYear && hoveredYear !== year;
            const className = `font-cc text-[1.8rem] uppercase transition-all duration-225 ease-in-out                 
        ${isSelected && !hoveredYear ? 'text-black font-bold active' : ''}
        ${isHovered ? 'text-black font-bold' : ''}
        ${!isSelected && !hoveredYear ? 'hover:text-black' : ''}
      `;

            return (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedMonth(null);
                }}
                onMouseEnter={() => setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
                className={className}
                style={
                  isOtherHovered
                    ? { color: secondaryColor }
                    : !isSelected && !hoveredYear
                      ? { color: secondaryColor }
                      : {}
                }
              >
                {year}
              </button>
            );
          })}


          {/* Botões de mês (aparecem só se o ano estiver selecionado) */}
          {months.map((month) => {
            const isSelected = selectedMonth === null || selectedMonth === month;
            const isHovered = hoveredMonths === month;
            const isOtherHovered = hoveredMonths && hoveredMonths !== month;
            const className = `font-cc text-[1.8rem] uppercase transition-all duration-225 ease-in-out                 
        ${isSelected && !hoveredMonths ? 'text-black font-bold active' : ''}
        ${isHovered ? 'text-black font-bold' : ''}
        ${!isSelected && !hoveredMonths ? 'hover:text-black' : ''}
      `;
            return (
              <button
                key={month}
                onClick={() => toggleMonth(month)}
                onMouseEnter={() => setHoveredMonths(month)}
                onMouseLeave={() => setHoveredMonths(null)}
                className={className}
                style={
                  isOtherHovered
                    ? { color: secondaryColor }
                    : !isSelected && !hoveredMonths
                      ? { color: secondaryColor }
                      : {}
                }
              >
                {month}
              </button>
            );
          })}
        </div>
        <div className='flex flex-col lg:hidden'>
        </div>

        <div className="block lg:hidden w-fit" style={{ background: "#ffff00" }}>
          <button className='text-[1.2rem]' onClick={toggleMobileFilter}>{isMobileFilterVisible ? "-" : "+"} filtros</button>
          <div ref={mobileFilterRef}
            className={`${isMobileFilterVisible ? 'block' : 'hidden'} mt-[7px] transition-all duration-[125]`}>
            <div className='text-[1.2rem] italic'>distritos</div>
            <DistrictsFilter
              districts={districts}
              selectedDistrict={selectedDistrict}
              hoveredDistrict={hoveredDistrict}
              setHoveredDistrict={setHoveredDistrict}
              setSelectedDistrict={setSelectedDistrict}
              setActiveButton={setActiveButton}
              setFiltro={setFiltro}
              router={router}
              pathname={pathname}
              secondaryColor={secondaryColor}
              setSelectedType={setSelectedType}
            />

                        <div className='text-[1.2rem] italic mt-[28px] lg:[mt-0]'>campos de trabalho</div>
<TypeOptionsFilter
              typeOptions={typeOptions}
              selectedType={selectedType}
              hoveredType={hoveredType}
              setHoveredType={setHoveredType}
              setSelectedType={setSelectedType}
              setSelectedCombinedFilter={setSelectedCombinedFilter}
              router={router}
              secondaryColor={secondaryColor}
            />

            <div className='text-[1.2rem] italic mt-[28px] lg:[mt-0] '>apoios e intervinientes</div>
            {/* Combined filters */}
            <CombinedFilters
              localidadesUIDs={localidadesUIDs}
              agentesUIDs={agentesUIDs}
              combinedFilters={combinedFilters}
              selectedCombinedFilter={selectedCombinedFilter}
              hoveredCombinedFilter={hoveredCombinedFilter}
              setHoveredCombinedFilter={setHoveredCombinedFilter}
              setSelectedCombinedFilter={setSelectedCombinedFilter}
              setActiveButton={setActiveButton}
              setFiltro={setFiltro}
              router={router}
              pathname={pathname}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>

        <div className="hidden lg:flex">
          {/* Combined filters */}
          <CombinedFilters
            localidadesUIDs={localidadesUIDs}
            agentesUIDs={agentesUIDs}
            combinedFilters={combinedFilters}
            selectedCombinedFilter={selectedCombinedFilter}
            hoveredCombinedFilter={hoveredCombinedFilter}
            setHoveredCombinedFilter={setHoveredCombinedFilter}
            setSelectedCombinedFilter={setSelectedCombinedFilter}
            setActiveButton={setActiveButton}
            setFiltro={setFiltro}
            router={router}
            pathname={pathname}
            secondaryColor={secondaryColor}
          />
        </div>

        {/* Main content with frosty effect */}
        <div className="relative">
          {/* Frosty overlay */}
          <div
            ref={frostyRef}
            style={{
              WebkitMaskImage: `
      linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%),
      linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)
    `,
              WebkitMaskComposite: 'intersect',
              maskImage: `
      linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%),
      linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)
    `,
              maskComposite: 'intersect',
              WebkitMaskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              background: backgroundColor
            }}
            className="absolute top-0 left-0 right-[7px] h-[6rem] z-10
                      backdrop-blur-[1px] pointer-events-none
                      opacity-0 transition-opacity duration-300 will-change-opacity"
          />

      {isMounted && (
        // isMobile ? (
        //       <div
        //         ref={scrollContainerRef}
        //         className="h-[calc(100vh-109px)] pt-[14px] relative"
        //       >
        //         <AnimatePresence mode="wait">
        //           <motion.div
        //             key={`${selectedYear}-${selectedMonth}-${selectedDistrict}-${selectedType}-${selectedCombinedFilter?.label}`}
        //             className="pr-[18px]"
        //           >
        //             {filteredAgenda.length > 0 ? (
        //               <motion.div
        //                 initial="hidden"
        //                 animate="visible"
        //                 exit="exit"
        //                 variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        //                 className="space-y-4"
        //               >
        //                 {[...filteredAgenda].reverse().map((event, index) => (
        //                   <motion.div
        //                     key={event.id ?? `event-${index}`}
        //                     variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
        //                     transition={{ duration: 0.125, ease: "easeOut" }}
        //                   >
        //                     <EventItem event={event} secondaryColor={secondaryColor} />
        //                   </motion.div>
        //                 ))}
        //               </motion.div>
        //             ) : (
        //               <motion.p
        //                 key="empty"
        //                 initial={{ opacity: 0, y: 10 }}
        //                 animate={{ opacity: 1, y: 0 }}
        //                 exit={{ opacity: 0, y: -10 }}
        //                 transition={{ duration: 0.3 }}
        //                 className="text-black py-8 text-[1.2rem] md:text-[1.6rem]"
        //               >
        //                 Nenhum evento encontrado com os filtros selecionados.
        //               </motion.p>
        //             )}
        //           </motion.div>
        //         </AnimatePresence>
        //       </div>
        // ) : (
            <CustomScrollbar direction="vertical">
              <div
                ref={scrollContainerRef}
                className="h-[calc(100vh-109px)] pt-[14px] relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedYear}-${selectedMonth}-${selectedDistrict}-${selectedType}-${selectedCombinedFilter?.label}`}
                    className="pr-[18px] pt-[7px]"
                  >
                    {filteredAgenda.length > 0 ? (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="space-y-4"
                      >
                        {[...filteredAgenda].reverse().map((event, index) => (
                          <motion.div
                            key={event.id ?? `event-${index}`}
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
                            transition={{ duration: 0.125, ease: "easeOut" }}
                          >
                            <EventItem event={event} secondaryColor={secondaryColor} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-black py-8 text-[1.2rem] md:text-[1.6rem]"
                      >
                        Nenhum evento encontrado com os filtros selecionados.
                      </motion.p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CustomScrollbar>
        // )
      )}
        </div>
      </div>
    </div>
  );
}

function EventItem({ event, secondaryColor }) {
  return (
    <div className="border-b pb-4 mb-4" style={{ borderColor: secondaryColor }} >
      <div className="flex flex-wrap md:flex-nowrap gap-x-[14px] gap-y-[0px]">
        <div className="w-1/2 md:w-[20%] flex flex-col">
          <span className="font-cc font-bold text-[1.8rem] lowercase">
            {(!event.mes_fim || event.mes_fim === event.mes)
              ? `${event.data_inicial}${event.data_final ? `-${event.data_final}` : ''} ${event.mes}`
              : `${event.data_inicial} ${event.mes}${event.data_final ? `-${event.data_final}` : ''}${event.mes_fim ? ` ${event.mes_fim}` : ''}`
            }
          </span>
          <span className="font-ramboia text-[1.2rem] leading-[1.5]">{event.horas}</span>
        </div>

        <div className="w-1/2 md:w-[20%] order-2 md:order-3 flex flex-col justify-between">
          {event.local && (
            <PrismicRichText
              field={event.local}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-[1.2rem] font-ramboia leading-[1.25]">{children}</p>
                ),
              }}
            />
          )}
        </div>

        <div className="w-full md:w-[60%] order-3 md:order-2 flex flex-col">
          <PrismicRichText
            field={event.titulo}
            components={{
              paragraph: ({ children }) => (
                <h3 className="font-medium text-[2.1rem] leading-[1.125] mb-2">{children}</h3>
              ),
            }}
          />
          {event.subtitulo && (
            <PrismicRichText
              field={event.subtitulo}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-[1.2rem] font-ramboia leading-[1.5]">{children}</p>
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}