"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { ImagePixelated } from "react-pixelate"; // Correct named import

/**
 * Props for `FullWidthImage`.
 */
export type FullWidthImageProps =
  SliceComponentProps<Content.FullWidthImageSlice>;

const FullWidthImage: FC<FullWidthImageProps> = ({ slice }) => {
  const images = slice.primary.imagem || [];
  const [pixelSize, setPixelSize] = useState(24); // Start pixelated

  useEffect(() => {
    const interval = setInterval(() => {
      setPixelSize((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 4; // Decrease in steps
      });
    }, 120); // Controls smoothness

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full"
    >
      <Swiper spaceBetween={20} loop className="w-full">
        {images.map((imgItem, index) => (
          <SwiperSlide key={index} className="w-full">
            {imgItem.imagem?.url && (
              <div className="relative w-full">
                <ImagePixelated
                  src={imgItem.imagem.url}
                  width={imgItem.imagem.dimensions?.width || 1200}
                  height={imgItem.imagem.dimensions?.height || 800}
                  pixelSize={pixelSize}
                  centered
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
