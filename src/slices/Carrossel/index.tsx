'use client';

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'; // Swiper styles

/**
 * Props for `FullWidthImage`.
 */
export type FullWidthImageProps =
  SliceComponentProps<Content.FullWidthImageSlice>;

/**
 * Component for "FullWidthImage" Slices.
 */
const FullWidthImage: FC<FullWidthImageProps> = ({ slice }) => {
  const images = slice.primary.imagem || [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full"
    >
      <Swiper
        spaceBetween={20}
        autoHeight
        loop
        className="w-full"
      >
        {images.map((imgItem, index) => (
          <SwiperSlide key={index} className="w-full">
            {imgItem.imagem?.url && (
              <div className="relative w-full">
                <Image
                  src={imgItem.imagem.url}
                  alt={imgItem.imagem.alt || ''}
                  width={imgItem.imagem.dimensions?.width || 1200}
                  height={imgItem.imagem.dimensions?.height || 800}
                  className="w-full h-auto object-contain cursor-crosshair"
                />
                {imgItem.copyright && (
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    © {imgItem.copyright}
                  </p>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FullWidthImage;
