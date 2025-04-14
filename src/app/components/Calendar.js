"use client";
import { useState, useEffect, useRef } from 'react';
import { PrismicRichText } from "./PrismicRichText";
import Lenis from '@studio-freight/lenis';

export default function Calendar({ home }) {
  // Extract all unique data
  const districts = [...new Set(home.data.agenda.map(item => item.distrito))];
  const years = [...new Set(home.data.agenda.map(item => item.ano))];
  const months = [...new Set(home.data.agenda.map(item => item.mes))];

  // State for filters
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Type mapping
  const typeOptions = {
    "Residências": "Residentes",
    "Obras": "Introdução das obras de arte",
    "Mediação": "Acções de mediação"
  };

  // Filter and group agenda items
  const filteredAgenda = home.data.agenda.filter(item => (
    (selectedYear ? item.ano === selectedYear : true) &&
    (selectedMonth ? item.mes === selectedMonth : true) &&
    (selectedDistrict ? item.distrito === selectedDistrict : true) &&
    (selectedType ? item.tipo === selectedType : true)
  ));

  const agendaByMonth = filteredAgenda.reduce((acc, item) => {
    const month = item.mes;
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});

  // Lenis smooth scroll setup
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

  // Toggle functions for filters
  const toggleDistrict = (district) => {
    setSelectedDistrict(prev => prev === district ? null : district);
  };

  const toggleType = (type) => {
    setSelectedType(prev => prev === type ? null : type);
  };

  const toggleMonth = (month) => {
    setSelectedMonth(prev => prev === month ? null : month);
  };

  return (
    <div className="w-full py-[14px] pl-[21px] flex flex-col lg:flex-row">
      {/* Filters Sidebar */}
      <div className="w-full lg:w-[20%] mb-4 lg:mb-0 lg:pr-[21px]">
        <div className="sticky top-0 pt-[14px] space-y-6 h-[calc(100vh-14px)] flex flex-col">
          {/* District Filter */}
          <div className='h-[50%]'>
            <ul className="space-y-1">
              {districts.map((district) => (
                <li key={district}>
                  <button
                    onClick={() => toggleDistrict(district)}
                    className={`text-sm w-full text-left px-2 py-1 rounded ${
                      selectedDistrict === null || selectedDistrict === district
                        ? 'font-bold'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {district}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Type Filter */}
          <div className='h-[50%]'>
            <ul className="space-y-1">
              {Object.entries(typeOptions).map(([value, label]) => (
                <li key={value}>
                  <button
                    onClick={() => toggleType(value)}
                    className={`text-sm w-full text-left px-2 py-1 rounded ${
                      selectedType === null || selectedType === value
                        ? 'font-bold'
                        : 'text-gray-500 hover:text-gray-700'
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

      {/* Calendar Content */}
      <div className="w-full lg:w-[80%] flex flex-col">
        <div className="flex mb-[15px] gap-[20px] pt-[14px]">
          {/* Year Filter */}
          <div>
            <div className="flex flex-wrap gap-[20px]">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedMonth(null); // Reset month when year changes
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedYear === year
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          {selectedYear && (
            <div>
              <div className="flex flex-wrap gap-[20px]">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => toggleMonth(month)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedMonth === null || selectedMonth === month
                        ? 'bg-black text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <section
          ref={scrollContainerRef}
          className="mb-8 h-[calc(100vh-80px)] overflow-y-auto"
        >
          {Object.keys(agendaByMonth).length > 0 ? (
            Object.entries(agendaByMonth).map(([month, items]) => (
              <div key={month} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{month} {items[0].ano}</h2>
                <div className="space-y-4">
                  {items.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 py-8 text-center">
              Nenhum evento encontrado com os filtros selecionados.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

// Event item component remains the same
function EventItem({ event }) {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-start">
        <div className="w-24 flex-shrink-0">
          <span className="font-medium">
            {event.data_inicial}
            {event.data_final && `-${event.data_final}`}
          </span>
        </div>
        <div className="flex-1">
          <PrismicRichText
            field={event.titulo}
            components={{
              paragraph: ({ children }) => <h3 className="font-medium">{children}</h3>
            }}
          />
          {event.subtitulo && (
            <PrismicRichText
              field={event.subtitulo}
              components={{
                paragraph: ({ children }) => <p className="text-sm text-gray-600">{children}</p>
              }}
            />
          )}
          {event.local && (
            <PrismicRichText
              field={event.local}
              components={{
                paragraph: ({ children }) => <p className="text-sm mt-1">{children}</p>
              }}
            />
          )}
          {event.agente && (
            <p className="text-xs mt-1">Com: {event.agente}</p>
          )}
        </div>
      </div>
    </div>
  );
}