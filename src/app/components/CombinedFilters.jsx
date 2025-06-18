"use client";
import Link from "next/link";
import slugify from "@sindresorhus/slugify";
import CustomScrollbar from '@/app/components/CustomScrollbar';

export default function CombinedFilters({
  localidadesUIDs,
  agentesUIDs,
  combinedFilters,
  selectedCombinedFilter,
  hoveredCombinedFilter,
  setHoveredCombinedFilter,
  setSelectedCombinedFilter,
  setActiveButton,
  setFiltro,
  router,
  pathname,
  secondaryColor
}) {
  return (
    <div>
      {localidadesUIDs.length > 0 && (
        <CustomScrollbar direction="horizontal">
          <div 
            className="flex gap-[20px] pb-[7px] pr-[4px] whitespace-nowrap items-center select-none scrollable w-[calc(100vw-28px)] lg:w-[calc(50vw-172px)]"
            onMouseDown={() => document.body.style.cursor = 'grabbing'}
            onMouseUp={() => document.body.style.cursor = ''}
            onMouseLeave={() => document.body.style.cursor = ''}
          >
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
                router.push('/', { scroll: false });

                if (!isAgente && hasPage) {
                  setActiveButton("Apoios");
                  setTimeout(() => {
                    window.history.replaceState({}, '', `/?localidade=${slug}`);
                    setFiltro("");
                  }, 50);
                }
              };

              return (
                <div key={`${type}-${label}`}>
                  {isAgente && hasPage && pathname !== `/filtro/${slug}` ? (
                    <Link
                      href={`/filtro/${slug}`}
                      onClick={handleClick}
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
    </div>
  );
}