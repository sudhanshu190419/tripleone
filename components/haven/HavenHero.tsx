"use client";

import type { RefObject } from "react";
import { CalendarIcon, MapPinIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/havenIcons";
import { popularTags } from "@/components/homeData";

type HavenHeroProps = {
  ready: boolean;
  focusIndex: number | null;
  setFocusIndex: (value: number | null) => void;
  stickyActive: boolean;
  searchRef: RefObject<HTMLDivElement | null>;
};

const searchFields = [
  { icon: <MapPinIcon />, label: "Where", placeholder: "Search destinations...", flex: "2" },
  { icon: <CalendarIcon />, label: "Check in", placeholder: "Add dates", flex: "1.4" },
  { icon: <CalendarIcon />, label: "Check out", placeholder: "Add dates", flex: "1.4" },
  { icon: <UsersIcon />, label: "Guests", placeholder: "Add guests", flex: "1.1" },
];

export default function HavenHero({ ready, focusIndex, setFocusIndex, stickyActive, searchRef }: HavenHeroProps) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,56px)] pb-[90px] pt-[130px] text-center">
      <div className="pointer-events-none absolute right-[-4%] top-[8%] h-[34vw] w-[34vw] max-h-[500px] max-w-[500px] rounded-full bg-[radial-gradient(circle,#FDDEC866_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[8%] left-[-6%] h-[28vw] w-[28vw] max-h-[400px] max-w-[400px] rounded-full bg-[radial-gradient(circle,#C8E4D866_0%,transparent_70%)]" />

      <div className="mb-7 inline-flex items-center gap-2 rounded-3xl border border-[#F8D5C4] bg-[#FEF3EE] px-4 py-1.5 text-xs font-semibold tracking-[0.04em] text-[#B85A30]" style={{ opacity: ready ? 1 : 0, transition: "opacity .5s ease .3s" }}>
        <span className="block h-1.5 w-1.5 rounded-full bg-[#E07B54]" />
        4 million+ stays · 220 countries
      </div>

      <h1 className="font-display mb-5 max-w-[780px] text-[clamp(3rem,7.5vw,6.2rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#1C1917]" style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp .8s cubic-bezier(.16,1,.3,1) .15s both" : "none" }}>
        Find your perfect
        <br />
        <em className="text-[#E07B54]">place to stay.</em>
      </h1>

      <p className="mb-12 max-w-[460px] text-[clamp(14px,1.8vw,17px)] font-normal leading-[1.8] text-[#78716C]" style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp .8s ease .4s both" : "none" }}>
        Handpicked villas, cabins & hideaways for travellers who want something memorable.
      </p>

      <div
        ref={searchRef}
        className="w-full max-w-[800px]"
        style={{
          opacity: !ready ? 0 : stickyActive ? 0 : 1,
          animation: ready ? "fadeUp .7s ease .6s both" : "none",
          transition: "transform .5s cubic-bezier(.16,1,.3,1), opacity .28s ease, max-width .5s cubic-bezier(.16,1,.3,1)",
          transform: stickyActive ? "scale(0.9) translateY(-36px)" : "scale(1) translateY(0)",
          maxWidth: stickyActive ? "760px" : "800px",
          pointerEvents: stickyActive ? "none" : "auto",
        }}
      >
        <div className="flex items-stretch gap-0.5 rounded-[64px] border border-[#EDE8E2] bg-white p-[5px] shadow-[0_4px_28px_rgba(0,0,0,0.09)]">
          {searchFields.map((field, index) => (
            <div key={field.label} className="seg min-w-0 cursor-text rounded-[56px] px-4 py-2.5 transition-colors" style={{ flex: field.flex, background: focusIndex === index ? "#FDF5F1" : "transparent", borderRight: index < 3 ? "1px solid #EDE8E2" : "none" }}>
              <div className="flex items-center gap-2">
                <span className="shrink-0" style={{ color: focusIndex === index ? "#E07B54" : "#C4BAB4" }}>
                  {field.icon}
                </span>
                <div className="min-w-0 text-left">
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#1C1917]">{field.label}</div>
                  <input
                    placeholder={field.placeholder}
                    className="w-full truncate bg-transparent text-[13px] text-[#78716C] outline-none"
                    onFocus={() => setFocusIndex(index)}
                    onBlur={() => setFocusIndex(null)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button className="btn-primary ml-1 shrink-0 rounded-[56px] bg-[#E07B54] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C96840]">
            <span className="inline-flex items-center gap-2">
              <SearchIcon />
              <span>Search</span>
            </span>
          </button>
        </div>

        <div className="mt-[18px] flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#C4BAB4]">Popular:</span>
          {popularTags.map((tag) => (
            <button key={tag} className="pill rounded-[20px] border border-[#EDE8E2] bg-white px-3.5 py-1.5 text-xs text-[#78716C] transition-colors hover:bg-[#F5F0EC] hover:text-[#1C1917]">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-[clamp(8px,3%,48px)] top-[35%] hidden rounded-2xl border border-[#EDE8E2] bg-white px-[18px] py-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] md:block" style={{ animation: "float 5s ease-in-out infinite" }}>
        <div className="mb-1 text-[10px] font-semibold tracking-[0.06em] text-[#A8A29E]">JUST BOOKED</div>
        <div className="text-[13px] font-bold text-[#1C1917]">Villa Serenata</div>
        <div className="mt-0.5 text-[11px] text-[#A8A29E]">🌊 Amalfi Coast, Italy</div>
      </div>

      <div className="pointer-events-none absolute right-[clamp(8px,3%,48px)] top-[48%] hidden rounded-2xl border border-[#EDE8E2] bg-white px-[18px] py-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] md:block" style={{ animation: "float 6s ease-in-out infinite 1.8s" }}>
        <div className="mb-1 flex items-center gap-1.5 text-[#E07B54]">
          <StarIcon />
          <span className="text-[13px] font-bold text-[#1C1917]">5.0</span>
          <span className="text-[11px] text-[#A8A29E]">· 89 reviews</span>
        </div>
        <div className="text-[13px] font-bold text-[#1C1917]">Maldives Villa</div>
        <div className="mt-0.5 text-[11px] font-bold text-[#E07B54]">$980 / night</div>
      </div>
    </section>
  );
}