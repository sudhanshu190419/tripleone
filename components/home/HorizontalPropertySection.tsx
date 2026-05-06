"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import type { HomeProperty } from "@/components/homeData";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Props {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  properties: HomeProperty[];
  cardWidth?: number;
  gap?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_WIDTH = 280;
const GAP = 20;

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

// ─── Mobile dot indicators ────────────────────────────────────────────────────

function DotIndicators({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  if (total <= 1) return null;
  // Cap visible dots at 5 with a sliding window
  const MAX = 5;
  const start = Math.max(0, Math.min(activeIndex - 2, total - MAX));
  const dots = Array.from({ length: Math.min(total, MAX) }, (_, i) => start + i);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        paddingTop: 12,
      }}
    >
      {dots.map((idx) => {
        const isActive = idx === activeIndex;
        return (
          <span
            key={idx}
            style={{
              width: isActive ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: isActive ? "#6b5f52" : "#D6CFC6",
              transition: "all .3s cubic-bezier(.34,1.2,.64,1)",
              display: "block",
            }}
          />
        );
      })}
    </div>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ── Detect mobile ──────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── Sync scroll state ──────────────────────────────────────────────────────
  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);

    // Calculate active card index for dot indicators
    const effectiveCardWidth = cardWidth + gap;
    const idx = Math.round(scrollLeft / effectiveCardWidth);
    setActiveIndex(Math.max(0, Math.min(idx, properties.length - 1)));
  }, [cardWidth, gap, properties.length]);

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
  const scrollBy = useCallback(
    (dir: "left" | "right") => {
      trackRef.current?.scrollBy({
        left: dir === "left" ? -(cardWidth + gap) : cardWidth + gap,
        behavior: "smooth",
      });
    },
    [cardWidth, gap]
  );

  if (!properties.length) return null;

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
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }

        /* ── Track ── */
        .hs-track {
          display: flex;
          gap: ${gap}px;
          overflow-x: auto;
          padding-top: 12px;
          padding-bottom: 16px;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .hs-track::-webkit-scrollbar { display: none }
        .hs-track { scrollbar-width: none }

        /* ── Card ── */
        .hs-card {
          min-width: ${cardWidth}px;
          max-width: ${cardWidth}px;
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        /* ── View all link ── */
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

        /* ── Mobile overrides (≤ 639 px) ── */
        @media (max-width: 639px) {
          .hs-section-inner {
            border-radius: 24px !important;
            padding: 20px 0 20px !important;
          }
          .hs-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
            padding: 0 20px !important;
            margin-bottom: 16px !important;
          }
          .hs-arrow-group { display: none !important; }
          .hs-track {
  padding-left: 20px !important;
  padding-right: 20px !important;
  scroll-padding-left: 20px !important;
  gap: ${Math.round(gap * 0.8)}px !important;
}
          .hs-card {
            /* ~88 % of viewport so the next card peeks */
            min-width: min(${cardWidth}px, calc(88vw - 40px)) !important;
            max-width: min(${cardWidth}px, calc(88vw - 40px)) !important;
          }
          .hs-mobile-footer {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            padding: 4px 20px 0;
          }
          .hs-view-all-mobile {
            width: 100%;
            justify-content: center;
            font-size: 13px;
          }
        }

        /* ── Tablet (640 – 1023 px) ── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .hs-section-inner {
            padding: 28px 28px !important;
          }
          .hs-track {
            padding-left: 4px !important;
            padding-right: 40px !important;
          }
          .hs-card {
            min-width: min(${cardWidth}px, calc(46vw - 32px)) !important;
            max-width: min(${cardWidth}px, calc(46vw - 32px)) !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1280px] px-0 sm:px-[clamp(20px,5vw,56px)]">
        <div
          className="hs-section-inner rounded-[32px] border border-[#EEE7DF] px-8 py-8"
          style={{
            background: "linear-gradient(180deg, #fafaff 0%, #fafaff 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 30px rgba(28,25,23,0.04)",
          }}
        >
          {/* ── Header row ── */}
          <div
            className="hs-header-row"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {/* Left: section title */}
            <SectionHeader
              eyebrow="Curated Collection"
              title={title}
              subtitle={subtitle}
            />

            {/* Right: arrows (hidden on mobile via CSS) */}
            <div
              className="hs-arrow-group"
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

          {/* ── Scroll track ── */}
          <div style={{ position: "relative" }}>
            <div
              ref={trackRef}
              className="hs-track"
              style={{
                paddingLeft: 0,
                paddingRight: 80,
                overflowY: "visible",
              }}
            >
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="hs-card"
                  style={{
                    animation: `cardIn .45s cubic-bezier(.34,1.2,.64,1) ${
                      index * 0.07
                    }s both`,
                  }}
                >
                  <HavenPropertyCard property={property} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile-only footer: dots + view-all button ── */}
          <div
            className="hs-mobile-footer"
            style={{ display: "none" }} // shown via CSS on mobile
          >
            {/* Dot indicators */}
            <DotIndicators total={properties.length} activeIndex={activeIndex} />

            {/* View all (mobile) */}
            {viewAllHref && (
              <a href={viewAllHref} className="hs-view-all hs-view-all-mobile">
                View all
                <ArrowRight size={13} strokeWidth={2} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}