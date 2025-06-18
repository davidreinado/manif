"use client";
import { useRouter } from 'next/navigation';

export default function DistrictsFilter({
  districts,
  selectedDistrict,
  hoveredDistrict,
  setHoveredDistrict,
  setSelectedDistrict,
  setActiveButton,
  setFiltro,
  router,
  pathname,
  secondaryColor,
  setSelectedType
}) {
  return (
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
            router.push('/', { scroll: false });
            setTimeout(() => {
              setFiltro("")
            }, 50);
          }
          setSelectedType(null);
          setSelectedDistrict(district);
        };

        return (
          <li key={district}>
            <button
              onClick={() => handleClick(district)}
              onMouseEnter={() => setHoveredDistrict(district)}
              onMouseLeave={() => setHoveredDistrict(null)}
              className={className}
              style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredDistrict ? { color: secondaryColor } : {}}
            >
              {district}
            </button>
          </li>
        );
      })}
    </ul>
  );
}