"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";
import { SectionHeader } from "@/components/home/SectionHeader";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Property {
  id: string | number;
  [key: string]: unknown;
}

interface Props {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  properties: Property[];
  cardWidth?: number;
  gap?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_WIDTH = 280;
const GAP = 20;
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

// ─── Scroll arrow button ─────────────────────────────────────────────────────

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

function ArrowButton({ direction, onClick, disabled }: ArrowButtonProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1.5px solid #E7E2DC",
        background: disabled ? "#faf8f5" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all .2s ease",
        flexShrink: 0,
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,.06)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = "#f5f1ec";
          (e.currentTarget as HTMLElement).style.borderColor = "#c5bfb8";
          (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = "#fff";
          (e.currentTarget as HTMLElement).style.borderColor = "#E7E2DC";
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }
      }}
    >
      <Icon size={16} strokeWidth={2} color={disabled ? "#c5bfb8" : "#3a3530"} />
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function HorizontalPropertySection({
  title,
  subtitle,
  viewAllHref,
  properties,
  cardWidth = CARD_WIDTH,
  gap = GAP,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Sync scroll state ──────────────────────────────────────────────────────
  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    const ro = new ResizeObserver(syncScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      ro.disconnect();
    };
  }, [syncScrollState, properties]);

  // ── Scroll handlers ────────────────────────────────────────────────────────
  const scrollBy = useCallback((dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  }, [cardWidth, gap]);

  if (!properties.length) return null;

  const showProgress = properties.length > 3;

  return (
    <section
      className="py-4"
      style={{ animation: "sectionFadeIn .5s ease both" }}
    >
      <style>{`
        @keyframes sectionFadeIn {
          from { opacity: 0; transform: translateY(16px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(.97) }
          to   { opacity: 1; transform: translateY(0)   scale(1)   }
        }
        .hs-track {
        justify-content: ${properties.length === 1 ? "center" : "flex-start"};
          display: flex;
  gap: ${gap}px;
  overflow-x: auto;
  padding-top: 12px;
  padding-left: 12px;
  padding-bottom: 16px;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .hs-track::-webkit-scrollbar { display: none }
        .hs-track { scrollbar-width: none }
        .hs-card {
          min-width: ${cardWidth}px;
          max-width: ${cardWidth}px;
          flex-shrink: 0;
          scroll-snap-align: center;
        }
        .hs-view-all {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13.5px;
          font-weight: 500;
          color: #6b5f52;
          text-decoration: none;
          padding: 7px 14px;
          border: 1.5px solid #e0d9d1;
          border-radius: 10px;
          transition: all .2s;
          white-space: nowrap;
        }
        .hs-view-all:hover {
          background: #f5f0ea;
          border-color: #c5bfb8;
          gap: 8px;
        }
        .hs-view-all svg {
          transition: transform .2s cubic-bezier(.34,1.56,.64,1);
        }
        .hs-view-all:hover svg {
          transform: translateX(3px);
        }
        
      `}</style>

      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,56px)]">
        <div className="rounded-[32px] border border-[#EEE7DF] px-8 py-8"
style={{
  background:
    "linear-gradient(180deg, #FFFDFB 0%, #FAF6F1 100%)",
    boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 30px rgba(28,25,23,0.04)",
}}>

        <div
  style={{
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 28,
  }}
>
  {/* Left side */}
  <SectionHeader
    eyebrow="Curated Collection"
    title={title}
    subtitle={subtitle}
  />

  {/* Right side arrows */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0,
    }}
  >
    <ArrowButton
      direction="left"
      onClick={() => scrollBy("left")}
      disabled={!canScrollLeft}
    />

    <ArrowButton
      direction="right"
      onClick={() => scrollBy("right")}
      disabled={!canScrollRight}
    />
  </div>
</div>

        {/* ── Edge-fade + scroll track ── */}
        <div style={{ position: "relative" }}>
          {/* Right edge fade */}
          

          <div
  ref={trackRef}
  className="hs-track"
  style={{
    paddingRight: 80,
    overflowY: "visible",
  }}
>
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="hs-card"
                style={{
                  animation: `cardIn .45s cubic-bezier(.34,1.2,.64,1) ${index * 0.07}s both`,
                }}
              >
                <HavenPropertyCard property={property} index={index} />
              </div>
            ))}
          </div>
        </div>

        

      </div>
      </div>
    </section>
  );
}