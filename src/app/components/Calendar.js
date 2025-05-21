"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { PrismicRichText } from "./PrismicRichText";
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import slugify from "@sindresorhus/slugify";
import { useRouter } from 'next/navigation';

export default function Calendar({ home, selectedType, setSelectedType, agenda, localidades: localidadesPages = [], agentes: agentesPages = [], setFiltro, setActiveButton }) {
  const [currentPath, setCurrentPath] = useState('');
  const districts = [...new Set(home.data.agenda.map(item => item.distrito))];
  const years = [...new Set(home.data.agenda.map(item => item.ano))];
  const months = [...new Set(home.data.agenda.map(item => item.mes))];

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [clickedType, setClickedType] = useState(null);
  const [selectedCombinedFilter, setSelectedCombinedFilter] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const typeOptions = {
    "Residências": "Artistas",
    "Obras": "Exposições",
    "Mediação": "Mediação"
  };


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

  const [hoveredCombinedFilter, setHoveredCombinedFilter] = useState(null); // ✅ ADD THIS HERE

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
  }, [
    home.data.agenda,
    selectedYear,
    selectedMonth,
    selectedDistrict,
    selectedType,
    selectedCombinedFilter,
  ]);

  const scrollContainerRef = useRef(null);
  const lenisRef = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

    useEffect(() => {
    console.log("tipo é " + selectedType)
  }, [selectedType]);

  useEffect(() => {
    if (!isClient || !scrollContainerRef.current) return;

    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        wrapper: scrollContainerRef.current,
        content: scrollContainerRef.current,
        smoothWheel: true,
        duration: 1.2,
        easing: (t) => t,
        // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureDirection: 'vertical',
        smoothTouch: true,
        touchMultiplier: 2,
        infinite: false,
      });

      const raf = (time) => {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Update Lenis when content changes
    lenisRef.current?.resize();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isClient, filteredAgenda]);

  const toggleDistrict = (district) => {
    setSelectedDistrict(prev => prev === district ? null : district);
  };

  const toggleType = (type) => {
    setClickedType(prev => {
      const newType = prev === type ? null : type;
      setSelectedType(newType);
      setSelectedCombinedFilter(null);
      return newType;
    });
  };

  const toggleMonth = (month) => {
    setSelectedMonth(prev => prev === month ? null : month);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setActiveButton("Sobre");
    setFiltro(slug);
    router.push(`/filtro/${slug}`, undefined, { shallow: true });
  };

  if (!isClient) return null;

  return (
    <div className="w-full py-[14px] pl-0 md:pl-[21px] flex flex-col lg:flex-row">
      <div className="w-full lg:w-[20%] mb-4 lg:mb-0 lg:pr-[21px]">
        <div className="hidden sticky top-0 pt-[14px] h-[calc(100vh-8px)] md:flex flex-col">
          <div className='h-[50%] mt-0'>
            <ul>
              {districts.map((district) => {
                const isSelected = selectedDistrict === null || selectedDistrict === district;
                const isHovered = hoveredDistrict === district;
                const isOtherHovered = hoveredDistrict && hoveredDistrict !== district;

                const className = `
    text-link text-[1.6rem] w-full text-left px-2 py-1 text-cc
    ${isSelected && !hoveredDistrict ? 'text-black font-bold active' : ''}
    ${isHovered ? 'text-black font-bold' : ''}
    ${isOtherHovered ? 'text-[#808080]' : ''}
    ${!isSelected && !hoveredDistrict ? 'text-[#808080] hover:text-black' : ''}
  `;
                return (
                  <li key={district}>
                    <button
                      onClick={() => toggleDistrict(district)}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className={className}
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
    text-link text-[1.6rem] w-full text-left px-2 text-cc mb-[20px]
    ${isSelected && !hoveredType ? 'text-black font-bold active' : ''}
    ${isHovered ? 'text-black font-bold' : ''}
    ${isOtherHovered ? 'text-[#808080]' : ''}
    ${!isSelected && !hoveredType ? 'text-[#808080] hover:text-black' : ''}
  `;

                return (
                  <li key={value}>
                    <button
                      onClick={() => toggleType(value)}
                      onMouseEnter={() => setHoveredType(value)}
                      onMouseLeave={() => setHoveredType(null)}
                      className={className}
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

      <div className="w-full lg:w-[80%] flex flex-col pt-[14px]">
        <div className="flex mb-[15px] gap-[20px] ">
          <div className="flex flex-wrap gap-[20px]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedMonth(null);
                }}
                className={`font-cc text-[1.8rem] uppercase ${selectedYear === year ? 'text-black' : 'text-[#808080] hover:text-black'}`}
              >
                {year}
              </button>
            ))}
          </div>
          {selectedYear && (
            <div className="flex flex-wrap gap-[20px]">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => toggleMonth(month)}
                  className={`text-[1.8rem] font-cc uppercase ${selectedMonth === month ? 'text-[#808080] font-bold active' : 'text-black hover:text-[#808080]'}`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedYear && localidadesUIDs.length > 0 && (
          <div className="flex gap-[20px] max-w-full overflow-x-scroll whitespace-nowrap mb-[14px] items-center">
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
    text-link text-[1.6rem] font-cc px-2 py-1 whitespace-nowrap leading-[1.4]
    ${isSelected && !hoveredCombinedFilter ? 'active' : ''}
    ${isHovered ? 'active' : ''}
    ${isOtherHovered ? 'text-[#808080]' : ''}
    ${!isSelected && !hoveredCombinedFilter ? 'text-link text-[#808080] hover:text-black' : ''}
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
                  window.history.replaceState({}, '', `?localidade=${slug}`);
                  setFiltro("");
                } else {
                  setFiltro(slug);
                }
              };

              return (
                <div key={`${type}-${label}`}>
                  {isAgente && hasPage ? (
                    <Link
                      href={`/filtro/${slug}`}
                      scroll={false} // Prevent default scroll behavior
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={className}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default navigation
                        setActiveButton("Sobre");
                        setFiltro(slug);
                        // Use Next.js router to navigate
                        router.push(`/filtro/${slug}`, undefined, { shallow: true });
                      }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <button
                      onClick={handleClick}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={className}
                    >
                      {label}
                    </button>
                  )}
                </div>
              );
            })}

          </div>
        )}

        <section
          ref={scrollContainerRef}
          className="mb-8 h-[calc(100vh-130px)] overflow-y-auto scroll-container"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${selectedMonth}-${selectedDistrict}-${selectedType}-${selectedCombinedFilter?.label}`}
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
                      <EventItem event={event} />
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
        </section>
      </div>
    </div>
  );
}

function EventItem({ event }) {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex flex-wrap md:flex-nowrap gap-x-[14px] gap-y-[0px]">
        <div className="w-1/2 md:w-[25%] order-1 md:order-1 flex flex-col">
          <span className="font-cc font-bold text-[1.8rem] lowercase">
            {event.data_inicial} {event.mes}
            {event.data_final && `-${event.data_final}`}
          </span>
          <span className="font-ramboia text-[1.2rem]">{event.horas}</span>
        </div>

        <div className="w-1/2 md:w-[25%] order-2 md:order-3 flex flex-col justify-between">
          {event.local && (
            <PrismicRichText
              field={event.local}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-[1.2rem] font-ramboia">{children}</p>
                ),
              }}
            />
          )}
        </div>

        <div className="w-full md:w-[50%] order-3 md:order-2 flex flex-col">
          <PrismicRichText
            field={event.titulo}
            components={{
              paragraph: ({ children }) => (
                <h3 className="font-medium text-[1.8rem] py-[4px] leading-[1.1] mb-2">{children}</h3>
              ),
            }}
          />
          {event.subtitulo && (
            <PrismicRichText
              field={event.subtitulo}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-[1.2rem] font-ramboia mb-2">{children}</p>
                ),
              }}
            />
          )}
          {/* {event.agente && (
            <p className="text-[1.2rem] mt-auto">
              {event.agente}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}