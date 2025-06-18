"use client";
import React from 'react'; // Add this import

export default function TypeOptionsFilter({
  typeOptions,
  selectedType,
  hoveredType,
  setHoveredType,
  setSelectedType,
  setSelectedCombinedFilter,
  router,
  secondaryColor
}) {
  // Define type options with mobile/desktop variants where needed
  const responsiveTypeOptions = {
    "Residência": {
      desktop: <>Artistas<br />Residentes</>,
      mobile: "Artistas Residentes",
      default: "Residência"
    },
    "Exposição": "Exposições",
    "Mediação": "Mediação"
  };

  return (
    <ul className="flex gap-x-[14px] lg:block">
      {Object.entries(typeOptions).map(([value, label]) => {
        const isSelected = selectedType === null || selectedType === value;
        const isHovered = hoveredType === value;
        const isOtherHovered = hoveredType && hoveredType !== value;

        const className = `
          text-link text-[1.6rem] w-full text-left text-cc mb-0 lg:mb-[20px] leading-[1.4]
          ${isSelected && !hoveredType ? 'text-black font-bold active' : ''}
          ${isHovered ? 'text-black font-bold' : ''}
          ${!isSelected && !hoveredType ? 'hover:text-black' : ''}
        `;

        const toggleType = (type) => {
          const newType = selectedType === type ? null : type;
          setSelectedType(newType);
          setSelectedCombinedFilter(null);
          router.push('/', { scroll: false });
        };

        // Determine if this option needs responsive treatment
        const optionConfig = responsiveTypeOptions[value];
        const isResponsive = typeof optionConfig === 'object' && !React.isValidElement(optionConfig);

        return (
          <li key={value}>
            <button
              onClick={() => toggleType(value)}
              onMouseEnter={() => setHoveredType(value)}
              onMouseLeave={() => setHoveredType(null)}
              className={className}
              style={isOtherHovered ? { color: secondaryColor } : !isSelected && !hoveredType ? { color: secondaryColor } : {}}
            >
              {isResponsive ? (
                <>
                  <span className="hidden lg:inline">{optionConfig.desktop}</span>
                  <span className="lg:hidden">{optionConfig.mobile}</span>
                </>
              ) : (
                label
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}