"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FilterBar, { FilterValues } from "@/components/haven/FilterBar";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";
import type { HomeProperty } from "@/components/homeData";
import Image from "next/image";

type Property = HomeProperty;

type SearchResultsClientProps = {
  properties: Property[];
  initialFilters: FilterValues;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PRICE_RANGES: Record<string, (p: number) => boolean> = {
  "Under ₹2,000":   (p) => p < 2000,
  "₹2,000–₹5,000":  (p) => p >= 2000 && p <= 5000,
  "₹5,000–₹10,000": (p) => p >= 5000 && p <= 10000,
  "₹10,000+":       (p) => p > 10000,
};

const SORT_FNS: Record<string, (a: Property, b: Property) => number> = {
  "Price: low to high": (a, b) => a.price - b.price,
  "Price: high to low": (a, b) => b.price - a.price,
  "Top rated":          (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
};

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

// Curated destination imagery — extend as you add more cities
const HERO_IMAGES: Record<string, string> = {
  udaipur:   "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=2400&q=85&auto=format&fit=crop",
  jaipur:    "https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=2400&q=85&auto=format&fit=crop",
  goa:       "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=2400&q=85&auto=format&fit=crop",
  manali:    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=2400&q=85&auto=format&fit=crop",
  rishikesh: "https://images.unsplash.com/photo-1591018653069-9b5e1f10b1cd?w=2400&q=85&auto=format&fit=crop",
};
const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&q=85&auto=format&fit=crop";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SearchResultsClient({
  properties,
  initialFilters,
}: SearchResultsClientProps) {
  const [filters, setFilters]       = useState<FilterValues>(initialFilters);
  const [isFiltering, setFiltering] = useState(false);
  const rafRef                      = useRef<number>(0);

  const filteredProperties = useMemo(() => {
    const locNorm  = norm(filters.location);
    const typeNorm =
  filters.type &&
  filters.type !== "null" &&
  filters.type !== "undefined"
    ? norm(filters.type)
    : "";
    const budgetFn =
  filters.budget &&
  filters.budget !== "null" &&
  filters.budget !== "undefined"
    ? PRICE_RANGES[filters.budget]
    : null;

const sortFn =
  filters.sort &&
  filters.sort !== "null" &&
  filters.sort !== "undefined"
    ? SORT_FNS[filters.sort]
    : null;

    const filtered = properties.filter((p) => {
      const locMatch  = !locNorm  || norm(p.location).includes(locNorm) || locNorm.includes(norm(p.location));
      const typeMatch = !typeNorm || norm(p.category).includes(typeNorm);
      const budgMatch = !budgetFn || budgetFn(p.price);
      return locMatch && typeMatch && budgMatch;
    });

    return sortFn ? [...filtered].sort(sortFn) : filtered;
  }, [filters, properties]);

  const handleFilterChange = useCallback(
  (next: React.SetStateAction<FilterValues>) => {
    setFiltering(true);
    setFilters(next);

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() =>
      requestAnimationFrame(() => setFiltering(false))
    );
  },
  []
);

  const locationLabel = useMemo(
    () => filters.location?.trim().split(/,\s*/)[0] || "your destination",
    [filters.location],
  );

  const heroImage = useMemo(() => {
  const key = norm(locationLabel);
  const cityKey = Object.keys(HERO_IMAGES).find((city) =>
    key.includes(city)
  );

  return cityKey ? HERO_IMAGES[cityKey] : FALLBACK_HERO;
}, [locationLabel]);

  const resultCount     = filteredProperties.length;
  const hasActiveFilter = !!(filters.type || filters.budget || filters.sort);

  const activeChips = useMemo(() => {
    const chips: { key: keyof FilterValues; label: string }[] = [];
    if (filters.type)   chips.push({ key: "type",   label: filters.type   as string });
    if (filters.budget) chips.push({ key: "budget", label: filters.budget as string });
    if (filters.sort)   chips.push({ key: "sort",   label: filters.sort   as string });
    return chips;
  }, [filters]);

  const clearChip = (key: keyof FilterValues) =>
    handleFilterChange({ ...filters, [key]: "" });

  return (
    <>
      <style>{`
        @keyframes havenFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .haven-fade-up { animation: havenFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes havenCardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .haven-card { animation: havenCardIn 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1);    }
        }
        .haven-hero-img { animation: heroZoom 1800ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateY(20px); letter-spacing: 0; }
          to   { opacity: 1; transform: translateY(0);    letter-spacing: -0.02em; }
        }
        .haven-hero-title { animation: heroTitleIn 1100ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both; }

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .haven-hero-meta { animation: heroFadeIn 900ms cubic-bezier(0.22, 1, 0.36, 1) 500ms both; }

        .haven-serif {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-feature-settings: "liga", "dlig";
        }
      `}</style>

      <div className="min-h-screen bg-[#FBFAF8] text-[#1C1917]">

        {/* Hero*/}
        <section className="relative h-[38vh] min-h-[320px] w-full overflow-hidden sm:h-[46vh] sm:min-h-[420px] lg:h-[58vh] lg:max-h-[560px]">
          {/* Image */}
          <Image
  key={heroImage}
  src={heroImage}
  alt={`${locationLabel} landscape`}
  fill
  priority
  className="haven-hero-img object-cover"
  sizes="100vw"
/>

          {/* Gradient overlays for legibility */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,16,12,0.30) 0%, rgba(20,16,12,0.10) 35%, rgba(20,16,12,0.40) 80%, rgba(20,16,12,0.65) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 30% 70%, rgba(0,0,0,0.25), transparent 70%)",
            }}
          />

          {/* Top eyebrow row */}
          <div className="haven-hero-meta absolute left-0 right-0 top-0 z-10 px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12">
            <div className="mx-auto flex max-w-[1320px] items-center justify-between text-white/85">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-white/50" />
                <span className="text-[10.5px] font-medium uppercase tracking-[0.32em]">
                  Haven · Curated Stays
                </span>
              </div>
              <span className="hidden text-[10.5px] uppercase tracking-[0.28em] text-white/65 sm:block">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
            <div className="mx-auto max-w-[1320px]">
              <p className="haven-hero-meta text-[10.5px] font-medium uppercase tracking-[0.32em] text-white/75">
                Destination
              </p>
              <h1 className="haven-hero-title haven-serif mt-3 text-[clamp(2.8rem,7vw,5.6rem)] font-medium leading-[0.95] text-white">
                <span className="text-white/70">Stays in</span>{" "}
                <span className="italic">{locationLabel}</span>
              </h1>

              <div className="haven-hero-meta mt-5 flex items-center gap-4 text-white/80">
                <span className="text-[12px] uppercase tracking-[0.24em]">
                  {resultCount.toString().padStart(2, "0")} {resultCount === 1 ? "Stay" : "Stays"}
                </span>
                <span className="h-3 w-px bg-white/30" />
                <span className="haven-serif text-[15px] italic text-white/85">
                  Hand-picked by our editors
                </span>
              </div>
            </div>
          </div>

          {/* Bottom blend into page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#FBFAF8]"
          />
        </section>

        <div className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-8 lg:px-12">

          {/*Filter Bar */}
          <div className="mt-2">
            <FilterBar filters={filters} setFilters={handleFilterChange} />
          </div>

          {/* Active Chips */}
          {hasActiveFilter && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => clearChip(chip.key)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#1C1917]/12 bg-white px-3 py-1.5 text-[12px] text-[#1C1917]/75 transition-all duration-200 hover:border-[#1C1917]/30 hover:text-[#1C1917]"
                >
                  {chip.label}
                  <svg className="h-2.5 w-2.5 opacity-50 transition-opacity group-hover:opacity-100" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
              <button
                onClick={() => setFilters(initialFilters)}
                className="ml-1 text-[12px] text-[#1C1917]/50 underline-offset-4 transition-colors hover:text-[#1C1917] hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/*  Results  */}
          <main
  className="mt-10 sm:mt-12 min-h-[600px]" // Reserve space for at least two rows of cards
  style={{
    opacity: isFiltering ? 0.5 : 1,
    transition: "opacity 200ms ease",
  }}
>
            {resultCount > 0 ? (
  <div
  key={`grid-${JSON.stringify(filters)}`}
  className="
    flex gap-4 overflow-x-auto 
    snap-x snap-mandatory touch-pan-x items-stretch
    /* FIX: Massive bottom padding for the shadow, offset by negative margin */
    pb-[100px] -mb-[80px] pt-4 -mt-4
    scrollbar-none
    sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
    lg:grid-cols-3 xl:grid-cols-4
  "
>
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="min-w-[88%] flex-shrink-0 snap-start self-stretch sm:min-w-0"
                    style={{ animationDelay: `${Math.min(index * 45, 400)}ms` }}
                  >
                    <HavenPropertyCard property={property} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState onReset={() => setFilters(initialFilters)} />
            )}
          </main>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          {resultCount > 0 && (
            <footer className="mt-24 flex flex-col items-center gap-3">
              <span className="h-px w-10 bg-[#1C1917]/20" />
              <p className="haven-serif text-[15px] italic text-[#1C1917]/55">
                End of collection
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#1C1917]/35">
                {resultCount} · {locationLabel}
              </p>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center px-6 py-20 text-center">

      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#1C1917]/10 bg-white">
        <svg className="h-5 w-5 text-[#1C1917]/45" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </div>

      <h2 className="haven-serif text-[2.2rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
        Nothing<span className="italic"> here yet</span>
      </h2>

      <p className="mt-4 max-w-[320px] text-[13.5px] leading-[1.8] text-[#1C1917]/55">
        Try widening your location or relaxing a filter to see more stays.
      </p>

      <button
        onClick={onReset}
        className="group mt-10 inline-flex items-center gap-2 border-b border-[#1C1917]/30 pb-1 text-[12px] font-medium uppercase tracking-[0.22em] text-[#1C1917] transition-all duration-200 hover:border-[#1C1917]"
      >
        Reset filters
        <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}