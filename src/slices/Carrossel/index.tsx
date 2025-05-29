"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import Image from "next/image";
import 'swiper/css';

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
<Swiper
  spaceBetween={14}
  loop
  speed={800} // 🔄 smoother transition (default is 300)
  autoplay={{ delay: 4500, disableOnInteraction: false }}
  modules={[Autoplay]}
  className="w-full mb-[7px]"
>
        {images.map((imgItem, index) => (
          <SwiperSlide key={index} className="w-full">
            {imgItem.imagem?.url && (
              <div className="relative w-full cursor-move">
                <Image
                  src={imgItem.imagem.url}
                  width={imgItem.imagem.dimensions?.width || 1200}
                  height={imgItem.imagem.dimensions?.height || 800}
                  alt={imgItem.imagem.alt || `Carrossel ${index + 1}`}
                />
                {imgItem.copyright && (
                  <p className="text-xs mt-2">
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
