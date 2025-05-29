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

export default function Calendar({ home, selectedType, setSelectedType, agenda, localidades: localidadesPages = [], agentes: agentesPages = [], setActiveButton }) {
  // State declarations
  const districts = [...new Set(home.data.agenda.map(item => item.distrito))];
  const years = [...new Set(home.data.agenda.map(item => item.ano))];
  const months = [...new Set(home.data.agenda.map(item => item.mes))];
  const setFiltro = useFiltroStore((state) => state.setFiltro);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [clickedType, setClickedType] = useState(null);
  const [selectedCombinedFilter, setSelectedCombinedFilter] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const typeOptions = {
    "Residências": "Artistas \n Residentes",
    "Obras": "Exposições",
    "Mediação": "Mediação"
  };

  const router = useRouter();
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const frostyRef = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredMonths, setHoveredMonths] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredCombinedFilter, setHoveredCombinedFilter] = useState(null);

  const secondaryColor = useThemeStore((state) => state.secondaryColor);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  const [backgroundColor, setBackgroundColor] = useState("#808080");

  // Filtered data calculations
  const filteredLocalidades = [...new Set(
    home.data.agenda
      .filter(item => selectedType ? item.tipo === selectedType : true)
      .map(item => item.localidade)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const filteredAgentes = [...new Set(
    home.data.agenda
      .filter(item => selectedType ? item.tipo === selectedType : true)
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
    return home.data.agenda.filter((item) => {
      return (
        (selectedYear ? item.ano === selectedYear : true) &&
        (selectedMonth ? item.mes === selectedMonth : true) &&
        (selectedDistrict ? item.distrito === selectedDistrict : true) &&
        (selectedType ? item.tipo === selectedType : true) &&
        (selectedCombinedFilter
          ? selectedCombinedFilter.type === 'agente'
            ? item.agente === selectedCombinedFilter.label
            : item.localidade === selectedCombinedFilter.label
          : true)
      );
    });
  }, [home.data.agenda, selectedYear, selectedMonth, selectedDistrict, selectedType, selectedCombinedFilter]);

  // Lenis initialization with optimized frosty effect
  useEffect(() => {
    setIsMounted(true);

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
            <ul>
              {districts.map((district) => {
                const isSelected = selectedDistrict === null || selectedDistrict === district;
                const isHovered = hoveredDistrict === district;
                const isOtherHovered = hoveredDistrict && hoveredDistrict !== district;

                const className = `
                  text-link text-[1.6rem] w-full text-left py-1 text-cc
                  ${isSelected && !hoveredDistrict ? 'text-black font-bold active' : ''}
                  ${isHovered ? 'text-black font-bold' : ''}
                  ${!isSelected && !hoveredDistrict ? 'hover:text-black' : ''}
                `;

                const handleClick = (district) => {

                  setActiveButton("Sobre");
                  if (pathname !== "/") {
                    router.push('/', { scroll: false }); // Go to home
                    setTimeout(() => {
                      // window.history.replaceState({}, '', `/?localidade=${slug}`);
                      setFiltro("")
                    }, 50); // Wait a short time to ensure route change

                  }


                  toggleType(null)
                  toggleDistrict(district)
                };


                return (
                  <li key={district}>
                    <button
                      onClick={() => handleClick(district)}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className={className}
                      style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredType ? { color: secondaryColor } : {}}

                    >
                      {district}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='h-[50%] mt-[8px] hidden md:block'>
            <ul>
              {Object.entries(typeOptions).map(([value, label]) => {
                const isSelected = selectedType === null || selectedType === value;
                const isHovered = hoveredType === value;
                const isOtherHovered = hoveredType && hoveredType !== value;

                const className = `
                  text-link text-[1.6rem] w-full text-left text-cc mb-[20px] leading-[1.4]
                  ${isSelected && !hoveredType ? 'text-black font-bold active' : ''}
                  ${isHovered ? 'text-black font-bold' : ''}
                  ${!isSelected && !hoveredType ? 'hover:text-black' : ''}
                `;

                return (
                  <li key={value}>
                    <button
                      onClick={() => toggleType(value)}
                      onMouseEnter={() => setHoveredType(value)}
                      onMouseLeave={() => setHoveredType(null)}
                      className={className}
                      style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredType ? { color: secondaryColor } : {}}

                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div className="w-full lg:w-[80%] flex flex-col pt-[20px]">
        {/* Year/Month filters */}
        <div className="flex mb-[12px] gap-[20px] leading-none">
          <div className="flex flex-wrap gap-[20px]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedMonth(null);
                }}
                className={`font-cc text-[1.8rem] uppercase ${selectedYear === year ? 'text-black' : 'hover:text-black'}`}
                style={selectedYear !== year ? { color: secondaryColor } : {}}              >
                {year}
              </button>
            ))}
          </div>
          {selectedYear && (
            <div className="flex flex-wrap gap-[20px]">
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
                    style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredMonths
                      ? { color: secondaryColor } : {}}

                  >
                    {month}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Combined filters */}
        {selectedYear && localidadesUIDs.length > 0 && (
          <CustomScrollbar direction="horizontal">
            <div className="flex gap-[20px] whitespace-nowrap items-center select-none scrollable"
              onMouseDown={() => document.body.style.cursor = 'grabbing'}
              onMouseUp={() => document.body.style.cursor = ''}
              onMouseLeave={() => document.body.style.cursor = ''}>
              {combinedFilters.map(({ type, label }) => {
                const slug = slugify(label);
                const isAgente = type === 'agente';
                const hasPage = isAgente
                  ? agentesUIDs.includes(slug)
                  : localidadesUIDs.includes(slug);

                const isSelected =
                  !selectedCombinedFilter ||
                  (selectedCombinedFilter.label === label && selectedCombinedFilter.type === type);

                const isHovered =
                  hoveredCombinedFilter &&
                  hoveredCombinedFilter.label === label &&
                  hoveredCombinedFilter.type === type;

                const isOtherHovered =
                  hoveredCombinedFilter &&
                  (hoveredCombinedFilter.label !== label || hoveredCombinedFilter.type !== type);

                const className = `
                  text-link text-[1.6rem] font-cc m-0 p-0 whitespace-nowrap leading-[1.4] cursor-pointer
                  ${isSelected && !hoveredCombinedFilter ? 'active' : ''}
                  ${isHovered ? 'active' : ''}
                  ${!isSelected && !hoveredCombinedFilter ? 'text-link hover:text-black' : ''}
                `;

                const handleMouseEnter = () => setHoveredCombinedFilter({ type, label });
                const handleMouseLeave = () => setHoveredCombinedFilter(null);

                const handleClick = () => {
                  const next =
                    selectedCombinedFilter?.label === label &&
                      selectedCombinedFilter?.type === type
                      ? null
                      : { type, label };

                  setSelectedCombinedFilter(next);

                  if (!isAgente && hasPage) {
                    setActiveButton("Apoios");
                    router.push('/', { scroll: false }); // Go to home
                    setTimeout(() => {
                      window.history.replaceState({}, '', `/?localidade=${slug}`);
                      setFiltro("");
                    }, 50); // Wait a short time to ensure route change
                  }
                };

                return (
                  <div key={`${type}-${label}`}>
                    {isAgente && hasPage ? (
                      <Link
                        href={`/filtro/${slug}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        scroll={false}
                        prefetch={true}
                        className={className}
                        style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredCombinedFilter ? { color: secondaryColor } : {}}
                      >
                        {label}
                      </Link>
                    ) : (
                      <button
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={className}
                        style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredCombinedFilter ? { color: secondaryColor } : {}}
                      >
                        {label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </CustomScrollbar>
        )}

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
            <CustomScrollbar direction="vertical">
              <div
                ref={scrollContainerRef}
                className="h-[calc(100vh-102px)] relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedYear}-${selectedMonth}-${selectedDistrict}-${selectedType}-${selectedCombinedFilter?.label}`}
                    className="pr-[7px] pt-[7px]"
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
        <div className="w-1/2 md:w-[20%] order-1 md:order-1 flex flex-col">
          <span className="font-cc font-bold text-[1.8rem] lowercase">
            {event.data_inicial} {event.mes}
            {event.data_final && `-${event.data_final}`}
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