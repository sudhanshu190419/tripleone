"use client";

import React from "react";
import Image from "next/image";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  autoplayDelay?: number;
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 25000,
}) => {
  // duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <section className="w-full overflow-hidden py-12">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee ${autoplayDelay}ms linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#A67C52]">
            Stay Inspired
          </span>

          <h3 className="max-w-2xl text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-[#1C1917] leading-[1.1]">
            A glimpse into our spaces, stories & stays
          </h3>

          <p className="mt-4 max-w-xl text-sm sm:text-[15px] md:text-base text-[#78716C] leading-relaxed px-2">
            Explore real moments, curated interiors, and the experience of
            staying with Haven.
          </p>
        </div>

        {/* Infinite Carousel */}
        <div className="marquee-wrapper overflow-hidden">
          <div className="marquee-track gap-3 sm:gap-4 lg:gap-5">
            {duplicatedImages.map((image, index) => (
  <a
    key={index}
    href="https://www.instagram.com/_tripleone__/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative block w-[180px] h-[320px] sm:w-[220px] sm:h-[391px] md:w-[260px] md:h-[462px] lg:w-[300px] lg:h-[533px] shrink-0 overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] shadow-lg cursor-pointer"
  >
    <Image
      src={image.src}
      alt={image.alt}
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
      sizes="300px"
    />
  </a>
))}
          </div>
        </div>
      </div>
    </section>
  );
};