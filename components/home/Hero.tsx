"use client";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useState } from "react";

import {
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/havenIcons";

type HavenHeroProps = {
  ready: boolean;
  searchLocation: string;
  stayType: string;
  setSearchLocation: (value: string) => void;
  setStayType: (value: string) => void;
  focusIndex: number | null;
  setFocusIndex: (value: number | null) => void;
  stickyActive: boolean;
  searchRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
  onSearchFocus: () => void;
};

// Removed the static flex values from here
const searchFields = [
  {
    icon: <MapPinIcon />,
    label: "Destination",
    placeholder: "Search destinations…",
  },
  {
    icon: <UsersIcon />,
    label: "Stay Type",
    placeholder: "Select type",
  },
];

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=70",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=70",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=70",
];

export default function HavenHero({
  ready,
  searchLocation,
  stayType,
  setSearchLocation,
  setStayType,
  focusIndex,
  setFocusIndex,
  stickyActive,
  searchRef,
  heroRef,
  onSearchFocus,
}: HavenHeroProps) {

  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleSearch = () => {
  if (!searchLocation.trim()) {
    alert("Please enter destination");
    return;
  }

  const params = new URLSearchParams();

  params.set("location", searchLocation.trim());

  if (stayType.trim()) {
    params.set("type", stayType.trim());
  }

  router.push(`/search?${params.toString()}`);
};

  return (
    <>
      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes heroBadge {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes carouselScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(0.75);}
        }

        .carousel-strip       { display: flex; animation: carouselScroll 40s linear infinite; width: max-content; }
        .carousel-strip:hover { animation-play-state: paused; }

        .hero-card {
          opacity: 0;
          animation: ${ready ? "cardIn .75s cubic-bezier(.16,1,.3,1) .1s forwards" : "none"};
        }

        .hero-badge {
          opacity: 0;
          animation: ${ready ? "heroBadge .6s cubic-bezier(.16,1,.3,1) .25s forwards" : "none"};
        }
        .hero-h1 {
          opacity: 0;
          animation: ${ready ? "heroFadeUp .75s cubic-bezier(.16,1,.3,1) .4s forwards" : "none"};
        }
        .hero-sub {
          opacity: 0;
          animation: ${ready ? "heroFadeUp .7s ease .55s forwards" : "none"};
        }
        .hero-search {
          opacity: 0;
          animation: ${ready ? "heroFadeUp .7s ease .68s forwards" : "none"};
        }
        .hero-tags {
          opacity: 0;
          animation: ${ready ? "heroFadeUp .6s ease .82s forwards" : "none"};
        }

        .dot-pulse { animation: dotPulse 2s ease-in-out infinite; }

        .search-field-divider + .search-field-divider {
          border-left: 1px solid #E8E0D8;
        }

        .search-btn {
          background: #E07B54;
          transition: background .2s ease, transform .15s ease, box-shadow .2s ease;
        }
        .search-btn:hover {
          background: #C96840;
          transform: scale(1.03);
          box-shadow: 0 6px 20px rgba(224,123,84,.35);
        }
        .search-btn:active { transform: scale(.98); }

        .quick-tag {
          transition: background .18s, color .18s, border-color .18s;
        }
        .quick-tag:hover {
          background: #FEF3EE !important;
          border-color: #F8C4A8 !important;
          color: #B85A30 !important;
        }

        /* sticky-search shrink */
        .hero-search-wrap {
          transition: opacity .28s ease, transform .45s cubic-bezier(.16,1,.3,1);
        }
      `}</style>

      {/* ── Section ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "80vh", paddingTop: "80px" }}>

        {/* ── Background Carousel ─────────────────────────────────────────── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="carousel-strip h-full">
            {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, i) => (
              <div key={i} className="relative h-full shrink-0" style={{ width: "clamp(280px, 28vw, 420px)" }}>
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={i < 4 ? "eager" : "lazy"}
                  style={{ filter: "brightness(0.88) saturate(1.05)" }}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FAF8F5] to-transparent" />

          {/* Multi-layer overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          {/* Vignette sides */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAF8F5]/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAF8F5]/70 to-transparent" />
        </div>

        {/* ── Content – centred vertically ─────────────────────────────────── */}
        <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 sm:px-6">

          {/* ── GLASS CARD ──────────────────────────────────────────────────── */}
          <div
            className="hero-card w-full max-w-[860px] rounded-3xl border border-white/70 bg-white/72 px-8 py-10 text-center shadow-[0_8px_48px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] sm:px-12 sm:py-12"
            style={{ backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }}
          >

            {/* Badge */}
            <div className="hero-badge  mb-7 inline-flex items-center gap-2 rounded-full border border-[#F8D5C4] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B85A30]">
              <span className="dot-pulse block h-1.5 w-1.5 rounded-full bg-[#E07B54]" />
              Curated stays · Memorable escapes
            </div>

            {/* Headline */}
            <h1 className="hero-h1 mb-4 text-[clamp(2.4rem,5.5vw,4rem)] font-bold leading-[1.06] tracking-[-0.025em] text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              TripleOne<br />
              <em className="italic text-[#E07B54]">Your comfort zone.</em>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub mx-auto mb-8 max-w-[460px] text-[clamp(14px,1.8vw,16px)] font-normal leading-[1.8] text-[#57534E]">
              Discover premium villas, hotels &amp; private spaces for your next escape.
            </p>

            {/* ── Search Bar ──────────────────────────────────────────────── */}
            <div
              ref={searchRef}
              className="hero-search-wrap hero-search"
              style={{
                opacity:       stickyActive ? 0 : undefined,
                transform:     stickyActive ? "scale(0.92) translateY(-28px)" : "scale(1) translateY(0)",
                pointerEvents: stickyActive ? "none" : "auto",
              }}
            >
              {/* Bar Container - Column on Mobile, Row on Desktop */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 relative sm:rounded-2xl sm:border sm:border-[#E8E0D8] sm:bg-white sm:shadow-[0_4px_24px_rgba(0,0,0,0.09)]">
                
                {/* Inputs Row - Shares the same line horizontally on both mobile and desktop */}
                <div className="flex flex-col sm:flex-row flex-1 rounded-2xl border border-[#E8E0D8] bg-white shadow-sm sm:rounded-none sm:border-none sm:bg-transparent sm:shadow-none overflow-hidden">
                  {searchFields.map((field, idx) => (
                    <div
                      key={field.label}
                      // Make flex-1 (equal) on mobile, and apply the custom ratios on sm+ screens
                      className={`search-field-divider min-w-0 cursor-text px-3 py-3 sm:px-4 sm:py-3 transition-colors duration-150 w-full sm:flex-1 ${idx === 0 ? "sm:flex-[2]" : "sm:flex-[1.4]"}
                      }`}
                      style={{
                        background: focusIndex === idx ? "#FDF5F1" : "transparent",
                      }}
                      onMouseDown={(e) => {
  if (isMobile) {
    e.preventDefault();
    onSearchFocus();
    return;
  }

  setFocusIndex(idx);
}}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        {/* Icon */}
                        <span
                          className="shrink-0 transition-colors duration-150"
                          style={{ color: focusIndex === idx ? "#E07B54" : "#C4BAB4" }}
                        >
                          {field.icon}
                        </span>
                        {/* Label + input */}
                        <div className="relative min-w-0 text-left w-full">
                          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#1C1917]">
                            {field.label}
                          </div>
                          <input
                            value={
                              field.label === "Destination"
                                ? searchLocation
                                : field.label === "Stay Type"
                                ? stayType
                                : undefined
                            }
                            onChange={(e) => {
                              if (field.label === "Destination") {
                                setSearchLocation(e.target.value);
                              }
                              if (field.label === "Stay Type") {
                                setStayType(e.target.value);
                              }
                            }}
                            placeholder={field.placeholder}
                            className="w-full truncate bg-transparent text-[13px] text-[#78716C] outline-none placeholder:text-[#C4BAB4]"
                            inputMode={isMobile ? "none" : "text"}
                            readOnly={isMobile}
                            onFocus={(e) => {
                              setFocusIndex(idx);
                              

                              if (field.label === "Destination" || field.label === "Stay Type") {
                                onSearchFocus();
                              }
                            }}
                            onBlur={() => {
                              setFocusIndex(null);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search button Container - Stacked Below on Mobile */}
                <div className="flex shrink-0 items-center sm:px-2.5">
                  <button onClick={handleSearch} className="search-btn w-full flex justify-center items-center gap-2 rounded-xl px-5 py-3.5 sm:py-2.5 text-[14px] sm:text-[13px] font-bold text-white">
                    <SearchIcon />
                    <span>Search</span>
                  </button>
                </div>
              </div>

            </div>
            {/* end search */}

          </div>
          {/* end card */}

          {/* ── Scroll nudge ─────────────────────────────────────────────── */}
          <div
            className="mt-10 flex flex-col items-center gap-2"
            style={{
              opacity: ready ? 0.55 : 0,
              transition: "opacity .8s ease 1.4s",
              animation: ready ? "heroFadeUp .6s ease 1.4s both" : "none",
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8A29E]">Scroll</span>
            <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="#A8A29E" strokeWidth="1.4"/>
              <circle cx="8" cy="7" r="2.5" fill="#E07B54">
                <animateTransform attributeName="transform" type="translate"
                  values="0,0;0,8;0,0" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

        </div>
        {/* end content */}

      </section>
    </>
  );
}