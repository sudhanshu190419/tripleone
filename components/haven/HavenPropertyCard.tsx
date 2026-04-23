"use client";

import { useRef, useState } from "react";
import { HeartIcon, MapPinIcon, StarIcon } from "@/components/havenIcons";
import { categoryGradients, categories, type HomeProperty } from "@/components/homeData";
import { useInView } from "@/components/havenHooks";

type HavenPropertyCardProps = {
  property: HomeProperty;
  index: number;
};

export default function HavenPropertyCard({ property, index }: HavenPropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [start, end] = categoryGradients[property.category] ?? categoryGradients.all;
  const icon = categories.find((cat) => cat.id === property.category)?.icon ?? "🏠";

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(26px)",
        transition: `opacity .55s ease ${index * 0.07}s, transform .55s ease ${index * 0.07}s`,
      }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="overflow-hidden rounded-[20px] bg-white"
        style={{
          boxShadow: hovered ? "0 18px 50px rgba(0,0,0,0.12)" : "0 2px 14px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "box-shadow .35s ease, transform .35s ease",
        }}
      >
        <div className="relative h-[220px] overflow-hidden" style={{ background: `linear-gradient(145deg, ${start}, ${end})` }}>
          <div className="absolute left-[14%] top-[18%] h-[90px] w-[90px] rounded-full bg-white/20" />
          <div className="absolute bottom-[12%] right-[16%] h-[120px] w-[120px] rounded-full bg-white/15" />
          <div className="absolute left-1/2 top-1/2 text-4xl" style={{ transform: "translate(-50%,-50%)" }}>
            {icon}
          </div>

          {property.tag ? (
            <div className="absolute left-3.5 top-3.5 rounded-[20px] bg-white px-3 py-1 text-[11px] font-bold text-[#1C1917] shadow-[0_1px_6px_rgba(0,0,0,0.1)]">
              {property.tag}
            </div>
          ) : null}

          <button
            onClick={(event) => {
              event.stopPropagation();
              setLiked((current) => !current);
            }}
            className="absolute right-3.5 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-none bg-white text-[#A8A29E] shadow-[0_1px_6px_rgba(0,0,0,0.12)]"
            style={{ transform: liked ? "scale(1.18)" : "scale(1)", transition: "transform .2s" }}
            aria-label={`Toggle favorite for ${property.title}`}
          >
            <HeartIcon active={liked} />
          </button>
        </div>

        <div className="px-[18px] pb-5 pt-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="m-0 flex-1 pr-2 text-sm font-bold leading-[1.35] text-[#1C1917]">{property.title}</h3>
            <span className="flex shrink-0 items-center gap-1 text-[#E07B54]">
              <StarIcon />
              <span className="text-[13px] font-bold text-[#1C1917]">{property.rating}</span>
            </span>
          </div>

          <div className="mb-2 flex items-center gap-1 text-xs text-[#A8A29E]">
            <MapPinIcon />
            {property.location}
          </div>

          <div className="mb-3.5 text-[11px] text-[#C4BAB4]">{property.nights}</div>

          <div className="flex items-center justify-between border-t border-[#F5F0EC] pt-3.5">
            <div>
              <span className="text-base font-bold text-[#1C1917]">${property.price}</span>
              <span className="ml-1 text-xs text-[#A8A29E]">/night</span>
            </div>
            <span className="text-[11px] text-[#C4BAB4]">{property.reviews} reviews</span>
          </div>
        </div>
      </article>
    </div>
  );
}