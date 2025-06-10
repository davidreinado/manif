import Link from "next/link";
import slugify from "@sindresorhus/slugify";
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import CustomScrollbar from '@/app/components/CustomScrollbar';

// Dentro do componente:

// E os outros estados que faltam

export default function MobileFiltro(localidadesUIDs, combinedFilters, selectedCombinedFilter, hoveredCombinedFilter, setHoveredCombinedFilter, setSelectedCombinedFilter, setActiveButton, setFiltro) {

    const router = useRouter();
    const pathname = usePathname();

    localidadesUIDs.length > 0 && (
        <CustomScrollbar direction="horizontal">
            <div className="flex gap-[20px] pb-[7px] whitespace-nowrap items-center select-none scrollable"
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
                        router.push('/', { scroll: false }); // Go to home

                        if (!isAgente && hasPage) {
                            setActiveButton("Apoios");
                            setTimeout(() => {
                                window.history.replaceState({}, '', `/?localidade=${slug}`);
                                setFiltro("");
                            }, 50); // Wait a short time to ensure route change
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
    )

}