"use client";
import { useState, useEffect, useRef } from 'react';
import { PrismicRichText } from "./PrismicRichText";
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from "framer-motion";

export default function Calendar({ home, selectedType, setSelectedType }) {
  const districts = [...new Set(home.data.agenda.map(item => item.distrito))];
  const years = [...new Set(home.data.agenda.map(item => item.ano))];
  const months = [...new Set(home.data.agenda.map(item => item.mes))];

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [selectedAgente, setSelectedAgente] = useState(null);
  const [hoveredAgente, setHoveredAgente] = useState(null);

  const [clickedType, setClickedType] = useState(null);

  const typeOptions = {
    "Residências": "Residências",
    "Obras": "Introdução das obras de arte",
    "Mediação": "Acções de mediação"
  };

  const agentes = [...new Set(
    home.data.agenda
      .filter(item => selectedType ? item.tipo === selectedType : true)
      .map(item => item.agente)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const filteredAgenda = home.data.agenda.filter(item => (
    (selectedYear ? item.ano === selectedYear : true) &&
    ((selectedMonth ?? hoveredMonth) ? item.mes === (hoveredMonth ?? selectedMonth) : true) &&
    (selectedDistrict ? item.distrito === selectedDistrict : true) &&
    (selectedType ? item.tipo === selectedType : true) &&
    ((selectedAgente ?? hoveredAgente) ? item.agente === (hoveredAgente ?? selectedAgente) : true)
  ));

  const agendaByMonth = filteredAgenda.reduce((acc, item) => {
    const month = item.mes;
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});

  const scrollContainerRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current,
      smoothWheel: true
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const toggleDistrict = (district) => {
    setSelectedDistrict(prev => prev === district ? null : district);
  };

  const toggleType = (type) => {
    setClickedType(prev => {
      const newType = prev === type ? null : type;
      setSelectedType(newType);
      setSelectedAgente(null);
      return newType;
    });
  };

  const toggleMonth = (month) => {
    setSelectedMonth(prev => prev === month ? null : month);
  };

  return (
    <div className="w-full py-[14px] pl-[21px] flex flex-col lg:flex-row">
      {/* Filters */}
      <div className="w-full lg:w-[20%] mb-4 lg:mb-0 lg:pr-[21px]">
        <div className="sticky top-0 pt-[14px] h-[calc(100vh-8px)] flex flex-col">
          <div className='h-[50%] mt-0'>
            <ul>
              {districts.map((district) => (
                <li key={district}>
                  <button
                    onClick={() => toggleDistrict(district)}
                    className={`text-link text-[1.6rem] w-full text-left px-2 py-1 text-cc ${selectedDistrict === null || selectedDistrict === district
                        ? 'font-bold active'
                        : 'text-[#756D47] hover:text-black'
                      }`}
                  >
                    {district}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='h-[50%] mt-[8px]'>
            <ul>
              {Object.entries(typeOptions).map(([value, label]) => (
                <li key={value}>
                  <button
                    onClick={() => toggleType(value)}
                    onMouseEnter={() => setSelectedType(value)}
                    onMouseLeave={() => setSelectedType(clickedType)}
                    className={`text-link text-[1.6rem] w-full text-left px-2 py-1 text-cc ${selectedType === null || selectedType === value
                        ? 'font-bold text-black active'
                        : 'text-[#756D47] hover:text-black'
                      }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Agenda Content */}
      <div className="w-full lg:w-[80%] flex flex-col">
        <div className="flex mb-[15px] gap-[20px] pt-[14px]">
          <div className="flex flex-wrap gap-[20px]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedMonth(null);
                }}
                className={`font-cc text-[1.8rem] uppercase text-[#756D47] ${selectedYear === year ? 'text-black' : 'hover:text-black'
                  }`}
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
                  onMouseEnter={() => setHoveredMonth(month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className={`text-[1.8rem] font-cc uppercase text-[#756D47] ${(hoveredMonth ?? selectedMonth) === null || (hoveredMonth ?? selectedMonth) === month
                      ? 'text-black font-bold'
                      : 'hover:text-black'
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Agentes */}
        {selectedYear && (
          <div className="flex gap-[20px] max-w-full overflow-x-scroll whitespace-nowrap mb-[14px]">
            {agentes.map((agente) => (
              <button
                key={agente}
                onClick={() =>
                  setSelectedAgente(prev => prev === agente ? null : agente)
                }
                onMouseEnter={() => setSelectedAgente(agente)}
                onMouseLeave={() => setSelectedAgente(clickedType)}  // Keep clickedType as the reference state
                className={`text-link text-[1.6rem] font-cc text-[#756D47] 
        ${selectedAgente === null || selectedAgente === agente
                    ? 'active text-black font-bold'
                    : 'hover:text-black text-[#756D47]'}`}
              >
                {agente}
              </button>
            ))}
          </div>
        )}


        {/* Agenda List */}
        <section
          ref={scrollContainerRef}
          className="mb-8 h-[calc(100vh-130px)] overflow-y-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${selectedMonth}-${selectedDistrict}-${selectedType}-${selectedAgente}-${hoveredMonth}-${hoveredAgente}`}
            >
              {filteredAgenda.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="space-y-4"
                >
                  {filteredAgenda.map((event, index) => (
                    <motion.div
                      key={event.id ?? `event-${index}`}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -10 },
                      }}
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
                  className="text-black py-8 text-[1.2rem] text-center"
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
    <div className="border-b pb-4 mb-4 border-dotted">
      <div className="flex items-stretch gap-[14px]">
        {/* Date & Time Column */}
        <div className="w-[25%] flex flex-col">
          <span className="font-cc font-bold text-[1.8rem] lowercase">
            {event.data_inicial} {event.mes}
            {event.data_final && `-${event.data_final}`}
          </span>
          <span className="font-ramboia text-[1.2rem]">{event.horas}</span>
        </div>

        {/* Title, Subtitle, Agente Column */}
        <div className="w-[50%] flex flex-col">
          <PrismicRichText
            field={event.titulo}
            components={{
              paragraph: ({ children }) => (
                <h3 className="font-medium text-[1.8rem] leading-[1.1] mb-2">{children}</h3>
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
          {event.agente && (
            <p className="text-[1.2rem] mt-auto">
              {event.agente}
            </p>
          )}
        </div>

        {/* Location Column */}
        <div className="w-[25%] flex flex-col justify-between">
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
      </div>
    </div>
  );
}
