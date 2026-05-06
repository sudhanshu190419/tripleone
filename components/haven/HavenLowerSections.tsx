"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@/components/havenIcons";
import { marqueeItems, processSteps, stats } from "@/components/homeData";
import { useCounter, useInView } from "@/components/havenHooks";
import { PROPERTY_LOCATION_COLLECTION } from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";

type ProcessStep = (typeof processSteps)[number];

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as import("react").RefObject<HTMLElement>);
  const count = useCounter(value, inView);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `all .6s ease ${index * 0.12}s`,
      }}
    >
      <div className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none text-[#1C1917]">
        {count}
        {suffix}
      </div>
      <div className="mt-1.5 text-[13px] tracking-[0.03em] text-[#A8A29E]">{label}</div>
    </div>
  );
}

function DestinationCard({
  destination,
  index,
  onClick,
}: {
  destination: {
    name: string;
    sub: string;
    image: string;
  };
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref as unknown as import("react").RefObject<HTMLElement>);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="relative w-[220px] md:w-[260px] shrink-0 aspect-[4/5] overflow-hidden rounded-[18px] group text-left"
    >
  
  <img
    src={destination.image}
    alt={destination.name}
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {/* overlay */}
  {/* Base overlay */}
<div className="absolute inset-0 bg-black/35" />

{/* Hover overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

<div className="absolute bottom-4 left-4 z-10">
  <div className="text-white font-semibold text-[15px]">
    {destination.name}
  </div>
  <div className="text-white/70 text-[11px]">
    {destination.sub}
  </div>
</div>

<div className="absolute bottom-4 right-4 z-10 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
    Explore
  </span>
</div>
    </button>
  );
}

function ProcessStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <article
      ref={ref}
      className="step rounded-[20px] border border-[#EDE8E2] bg-white p-7 pb-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: `all .6s ease ${index * 0.12}s`,
      }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-[#FEF3EE] text-[21px]">{step.icon}</div>
        <span className="font-display text-[28px] font-bold leading-none text-[#EDE8E2]">{step.number}</span>
      </div>
      <h3 className="mb-2 text-[15px] font-bold tracking-[-0.01em] text-[#1C1917]">{step.title}</h3>
      <p className="text-[13px] leading-[1.75] text-[#A8A29E]">{step.description}</p>
    </article>
  );
}

export default function HavenLowerSections() {
  const router = useRouter();
  const { items: locations, loading: locationsLoading } = usePropertyTaxonomy(PROPERTY_LOCATION_COLLECTION);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef);

  const destinationCards = useMemo(
    () =>
      locations.map((location, index) => {
        const [primary, secondary] = location.name.split(/,\s*/);
        const fallbackImages = [
          "https://images.unsplash.com/photo-1587474260584-136574528ed5",
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
          "https://images.unsplash.com/photo-1600532761550-1c3a6d4e4c0b",
          "https://images.unsplash.com/photo-1627894483216-2138af692e32",
        ];

        return {
          name: primary || location.name,
          sub: secondary || "Browse stays",
          image: fallbackImages[index % fallbackImages.length],
          locationName: location.name,
        };
      }),
    [locations]
  );

  return (
    <>
    
      <div className="overflow-hidden border-y border-[#EDE8E2] bg-white py-4">
        <div className="marquee flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3.5 px-6 text-[13px] italic text-[#A8A29E] font-display">
              <span className="inline-block h-1 w-1 rounded-full bg-[#E07B54]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,56px)] pt-16 pb-12 sm:py-16">
        <div ref={titleRef} className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-9" style={{ opacity: titleInView ? 1 : 0, transform: titleInView ? "translateY(0)" : "translateY(22px)", transition: "all .55s ease" }}>
          <div>
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#E07B54]">Inspiration</div>
           <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#1C1917]">
  Explore stays
  <br />
  <span className="text-[#E07B54]">by destination</span>
</h2>
<p className="mt-4 max-w-md text-[15px] leading-[1.8] text-[#78716C]">
  Discover premium stays curated for comfort, privacy and unforgettable experiences.
</p>
          </div>

          <button
  onClick={() => router.push("/search")}
  className="btn-outline inline-flex items-center gap-2 rounded-[32px] border-[1.5px] border-[#1C1917] bg-white px-6 py-[11px] text-[13px] font-bold text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-[#FAF8F5]"
>
            Explore all
            <ArrowRightIcon />
          </button>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {locationsLoading ? (
            <div className="col-span-full rounded-[18px] border border-dashed border-[#EDE8E2] bg-white px-5 py-10 text-center text-sm text-[#A8A29E]">
              Loading locations...
            </div>
          ) : destinationCards.length > 0 ? (
            destinationCards.map((destination, index) => (
              <DestinationCard
                key={destination.locationName}
                destination={destination}
                index={index}
                onClick={() => router.push(`/search?location=${encodeURIComponent(destination.locationName)}`)}
              />
            ))
          ) : (
            <div className="col-span-full rounded-[18px] border border-dashed border-[#EDE8E2] bg-white px-5 py-10 text-center text-sm text-[#A8A29E]">
              Add locations in admin settings to show them here.
            </div>
          )}
        </div>
      </section>

      

     

      
    </>
  );
}