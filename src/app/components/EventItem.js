import { PrismicRichText } from "@prismicio/react";

export default function EventItem({ event }) {

    return (
      <div className="border-b pb-4 mb-4 border-black">
        <div className="flex items-stretch gap-[14px]">
          {/* Date & Time Column */}
          <div className="w-[25%] flex flex-col">
          <span className="font-cc font-bold text-[1.8rem] lowercase">
            {(!event.mes_fim || event.mes_fim === event.mes)
              ? `${event.data_inicial}${event.data_final ? `-${event.data_final}` : ''} ${event.mes}`
              : `${event.data_inicial} ${event.mes}${event.data_final ? `-${event.data_final}` : ''}${event.mes_fim ? ` ${event.mes_fim}` : ''}`
            }
          </span>
            <span className="font-ramboia text-[1.2rem] leading-[1.5]">{event.horas}</span>
          </div>
  
          {/* Title, Subtitle, Agente Column */}
          <div className="w-[50%] flex flex-col">
            <PrismicRichText
              field={event.titulo}
              components={{
                paragraph: ({ children }) => (
                  <h3 className="font-medium text-[1.8rem]">{children}</h3>
                ),
              }}
            />
            {event.subtitulo && (
              <PrismicRichText
                field={event.subtitulo}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-[1.2rem] font-ramboia">{children}</p>
                  ),
                }}
              />
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
  