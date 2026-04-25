"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";


import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";



interface CarouselProps {
  images: { src: string; alt: string }[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
    .swiper {
      width: 100%;
      padding-bottom: 50px;
    }

   .swiper-slide {
  width: 260px !important;
}

    .swiper-slide img {
      display: block;
      width: 100%;
    }

    .swiper-3d .swiper-slide-shadow-left {
      background-image: none;
    }

    .swiper-3d .swiper-slide-shadow-right {
      background: none;
    }
  `;

  return (
    <section className="w-full space-y-4">
      <style>{css}</style>

      <div className="mx-auto w-full max-w-6xl rounded-[24px] p-2">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px]">
          
          

          <div className="flex flex-col items-center text-center pb-10 pt-4">
  <span className="mb-3 text-[12px] uppercase tracking-[0.24em] text-[#A67C52] font-semibold">
    Stay Inspired
  </span>

  <h3 className="max-w-2xl text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] leading-[1.1]">
    A glimpse into our spaces, stories & stays
  </h3>

  <p className="mt-4 max-w-xl text-[15px] md:text-base text-[#78716C] leading-relaxed">
    Explore real moments, curated interiors, and
    the experience of staying with Haven.
  </p>
</div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
              speed={1000}
                spaceBetween={20}
                autoplay={{
  delay: 0,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
  reverseDirection: false,
}}
                effect={"coverflow"}
                grabCursor={false}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 60,
                  modifier: 1.8,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[
                  EffectCoverflow,
                  Autoplay,
                  Pagination,
                  Navigation,
                ]}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-[260px] h-[460px] rounded-[24px] overflow-hidden shadow-lg">
                      <Image
                        src={image.src}
                        width={500}
                        height={700}
                        className="w-full h-full object-cover rounded-[24px]"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};