"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FilterBar, { FilterValues } from "@/components/haven/FilterBar";
import HavenLowerSections from "@/components/haven/HavenLowerSections";
import Footer from "@/components/layout/Footer";
import InstagramSection from "@/components/home/InstagramSection";
import HomeSections from "@/components/home/HomeSections";
import {
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/havenIcons";
import { PROPERTY_CATEGORY_COLLECTION, PROPERTY_LOCATION_COLLECTION } from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";

const destinationIcons: Record<string, React.ReactNode> = {
  location: <MapPinIcon />,
  landmark: <CalendarIcon />,
  city: <UsersIcon />,
  nature: <MapPinIcon />,
  mountain: <MapPinIcon />,
};

export default function HavenHome() {
  const router = useRouter();
  const {
    items: locations,
    loading: locationsLoading,
  } = usePropertyTaxonomy(PROPERTY_LOCATION_COLLECTION);
  const {
    items: categories,
    loading: categoriesLoading,
  } = usePropertyTaxonomy(PROPERTY_CATEGORY_COLLECTION);
  
  const [searchLocation, setSearchLocation] = useState("");
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [ready, setReady] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const stickyInputRef = useRef<HTMLInputElement>(null);
  const [stayType, setStayType] = useState<string | null>(null);
const [filters, setFilters] = useState<FilterValues>({
  type: null,
  location: null,
  budget: null,
  availability: null,
  sort: null,
});

  // Destination dropdown state
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const destDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  useEffect(() => {
    if (showStickySearch) {
      // slight delay so the bar animation plays first, then input focuses
      const t = setTimeout(() => stickyInputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [showStickySearch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowStickySearch(false);
        setShowDestDropdown(false);
        setShowTypeDropdown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearchFocus  = () => setShowStickySearch(true);

  const handleStickySearch = () => {
    if (!searchLocation?.trim()) return;
    setShowStickySearch(false);
    router.push(
      `/search?location=${encodeURIComponent(searchLocation)}&type=${encodeURIComponent(stayType)}`
    );
  };

  const openDestDropdown = () => {
    if (destDropdownTimer.current) clearTimeout(destDropdownTimer.current);
    setShowTypeDropdown(false);
    setShowDestDropdown(true);
  };

  const closeDestDropdown = () => {
    destDropdownTimer.current = setTimeout(() => setShowDestDropdown(false), 160);
  };

  const openTypeDropdown = () => {
    if (typeDropdownTimer.current) clearTimeout(typeDropdownTimer.current);
    setShowDestDropdown(false);
    setShowTypeDropdown(true);
  };

  const closeTypeDropdown = () => {
    typeDropdownTimer.current = setTimeout(() => setShowTypeDropdown(false), 160);
  };

  const toggleTypeDropdown = () => {
    if (!showTypeDropdown) {
      setShowDestDropdown(false); // 👈 Force close Destination
      setShowTypeDropdown(true);
    } else {
      setShowTypeDropdown(false);
    }
  };

  const suggestedDestinations = locations.map((location) => ({
    name: location.name,
    subtitle: `Explore stays in ${location.name}`,
    icon: "city",
  }));

  const stayTypeOptions = [
    { value: "any", label: "Any type", icon: "✦" },
    ...categories.map((category) => ({
      value: category.name,
      label: category.name,
      icon: "🏷️",
    })),
  ];

  const selectedType =
  stayType
    ? stayTypeOptions.find((t) => t.value === stayType)
    : null;

  const destinationLabel = locationsLoading
    ? "Loading locations..."
    : "Nearby";

  const destinationSubtitle = locationsLoading
    ? "Fetching admin-managed locations"
    : suggestedDestinations.length > 0
    ? "Find what's around you"
    : "No locations added yet";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <Navbar
  isScrolled={!isHeroVisible}
  searchLocation={searchLocation}
  stayType={stayType}
  onExpand={() => setShowStickySearch(true)}
/>

      {/* ── Sticky Search ─────────────────────────────────────────────────── */}
      <style>{`
        /* ─── Backdrop ─── */
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes backdropOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .sticky-backdrop {
          animation: backdropIn 0.22s ease both;
        }

        /* ─── Bar spring entrance ─── */
        @keyframes barIn {
          0%   { opacity: 0;   transform: translateY(-14px) scaleY(0.92) scaleX(0.98); }
          55%  { opacity: 1;   transform: translateY(3px)   scaleY(1.01) scaleX(1);    }
          78%  { transform: translateY(-1px) scaleY(0.995); }
          100% { opacity: 1;   transform: translateY(0)     scaleY(1)    scaleX(1);    }
        }
        .sticky-search-bar {
          animation: barIn 0.42s cubic-bezier(.16,1,.3,1) both;
          transform-origin: top center;
        }

        /* ─── Field divider ─── */
        .sticky-field + .sticky-field {
          border-left: 1px solid #EDE7DF;
        }

        @media (min-width: 640px) {
  .sticky-field + .sticky-field {
    border-top: none;
    border-left: 1px solid #EDE7DF;
  }
}

        /* ─── Dropdown spring ─── */
        @keyframes dropIn {
          0%   { opacity: 0;   transform: translateY(-6px) scale(0.97); }
          60%  { opacity: 1;   transform: translateY(2px)  scale(1.005); }
          100% { opacity: 1;   transform: translateY(0)    scale(1);     }
        }
        .sticky-dropdown {
          animation: dropIn 0.28s cubic-bezier(.16,1,.3,1) both;
          transform-origin: top left;
        }

        /* ─── Destination row hover ─── */
        .dest-row {
          transition: background 0.14s ease, transform 0.12s ease;
        }
        .dest-row:hover {
          background: #FDF5F1;
          transform: translateX(2px);
        }
        .dest-row:active {
          transform: scale(0.985);
        }

        /* ─── Stay type pill hover ─── */
        .type-row {
          transition: background 0.14s ease;
        }
        .type-row:hover {
          background: #FDF5F1;
        }
        .type-row.type-active {
          background: #FFF4EC;
        }

        /* ─── Search button ─── */
        .sticky-search-btn {
          background: linear-gradient(135deg, #E07B54 0%, #D46542 100%);
          transition: transform 0.15s cubic-bezier(.16,1,.3,1), box-shadow 0.15s ease, background 0.2s ease;
          box-shadow: 0 3px 12px rgba(224,123,84,0.28);
        }
        .sticky-search-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 22px rgba(224,123,84,0.40);
          background: linear-gradient(135deg, #D46542 0%, #C25630 100%);
        }
        .sticky-search-btn:active {
          transform: scale(0.97);
          box-shadow: 0 2px 8px rgba(224,123,84,0.22);
        }

        /* ─── Close button ─── */
        .sticky-close-btn {
          transition: background 0.14s ease, transform 0.12s ease;
        }
        .sticky-close-btn:hover {
          background: #F0EAE3;
          transform: rotate(90deg) scale(1.1);
        }

        /* ─── Input active field ─── */
        .sticky-field-active {
          background: #FDF5F1 !important;
        }
          /* ─── Premium Scrollbar ─── */
        .premium-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E8E0D8;
          border-radius: 10px;
        }
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #E8E0D8 transparent;
        }
      `}</style>

      {showStickySearch && (
        <>
          {/* Dimmed backdrop */}
          <div
            className="sticky-backdrop fixed inset-0 z-40"
            style={{ background: "rgba(28,25,23,0.22)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            onClick={() => setShowStickySearch(false)}
          />

          {/* Bar */}
          <div className="fixed left-0 right-0 z-50 px-4 pt-3 pb-0" style={{ top: "80px" }}>
            <div className="mx-auto max-w-[800px]">

              <div
                className="sticky-search-bar flex flex-col gap-2 sm:gap-0 sm:flex-row overflow-visible rounded-2xl border bg-[#FCF8F4] sm:bg-white"
                style={{
                  borderColor: "#E8E0D8",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 16px 48px -8px rgba(28,25,23,0.16), 0 0 0 1px rgba(255,255,255,0.8) inset",
                }}
              >

                {/* ── Where ── */}
                <div
                  className={`sticky-field relative w-full bg-white sm:flex-[2] cursor-text rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none px-4 py-3 transition-colors duration-150 ${
                    showDestDropdown ? "z-50 sticky-field-active" : "z-10"
                  }`}
                  onFocus={openDestDropdown}
                  onBlur={closeDestDropdown}
                >
                  {/* We keep the icon and input in their own row */}
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0" style={{ color: "#E07B54" }}>
                      <MapPinIcon />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.09em]" style={{ color: "#A8A29E" }}>
                        Destination
                      </div>
                      <input
                        ref={stickyInputRef}
                        value={searchLocation}
                        onChange={(e) => { setSearchLocation(e.target.value); openDestDropdown(); }}
                        onFocus={openDestDropdown}
                        onBlur={closeDestDropdown}
                        onKeyDown={(e) => e.key === "Enter" && handleStickySearch()}
                        placeholder="Where are you going?"
                        className="w-full truncate bg-transparent text-[13.5px] font-medium outline-none"
                        style={{ color: "#1C1917" }}
                      />
                    </div>
                  </div>

                  {/* Dropdown moved outside the flex row for perfect accordion expansion */}
                 {/* Dropdown moved outside the flex row for perfect accordion expansion */}
                  {showDestDropdown && (
                    <div
                      className="sticky-dropdown premium-scrollbar relative sm:absolute left-0 right-0 sm:right-auto sm:top-[calc(100%+16px)] mt-3 sm:mt-0 overflow-y-auto overflow-x-hidden sm:rounded-2xl border-t sm:border border-[#F0EBE4] sm:border-[#EDE7DF] bg-[#fdf5f1] sm:bg-white/95 sm:backdrop-blur-xl w-full sm:w-[380px] shadow-none sm:shadow-[0_24px_48px_-12px_rgba(28,25,23,0.25),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      style={{ maxHeight: "min(60vh, 400px)" }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="px-1 sm:px-5 pt-4 pb-3 sm:border-b sm:border-[rgba(240,235,228,0.6)]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#A8A29E" }}>
                          Suggested for you
                        </p>
                        <p className="mt-1.5 text-sm font-semibold hidden sm:block" style={{ color: "#1C1917" }}>
                          {destinationLabel}
                        </p>
                      </div>

                      {/* FIX: sm:bg-transparent removes the orange box on web */}
                      <div className="flex flex-col gap-2 bg-[#FFF4EC] sm:bg-transparent p-2 rounded-b-2xl sm:rounded-none">
                        {locationsLoading ? (
                          <div className="px-3 py-4 text-sm text-neutral-500">
                            Loading locations...
                          </div>
                        ) : suggestedDestinations.length > 0 ? (
                          suggestedDestinations
                            .filter((d) =>
                              searchLocation.trim() === "" ||
                              d.name.toLowerCase().includes(searchLocation.toLowerCase())
                            )
                            .map((dest, i) => (
                              <button
                                key={dest.name}
                                type="button"
                                onClick={() => { setSearchLocation(dest.name); setShowDestDropdown(false); }}
                                // FIX: sm:bg-transparent sm:shadow-none removes the clunky white cards on web
                                className="dest-row flex w-full items-center bg-white sm:bg-transparent shadow-sm sm:shadow-none gap-3.5 rounded-xl px-2 sm:px-4 py-3.5 sm:py-2.5 text-left"
                                style={{ animationDelay: `${i * 30}ms` }}
                              >
                                <div
                                  className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-sm sm:shadow-none"
                                  style={{ background: "#FEF3EE" }}
                                >
                                  {destinationIcons[dest.icon]}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13.5px] font-semibold truncate" style={{ color: "#1C1917" }}>
                                    {dest.name}
                                  </p>
                                  <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "#A8A29E" }}>
                                    {dest.subtitle}
                                  </p>
                                </div>
                              </button>
                            ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-neutral-500">
                            No locations added yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Stay Type ── */}
                <div
                  className={`sticky-field relative w-full bg-white sm:flex-[1.5] cursor-pointer px-4 py-3 transition-colors duration-150 ${
                    showTypeDropdown ? "z-50 sticky-field-active" : "z-10"
                  }`}
                  onClick={toggleTypeDropdown}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0" style={{ color: "#C4BAB4" }}>
                      <UsersIcon />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.09em]" style={{ color: "#A8A29E" }}>
                        Stay type
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[13.5px] font-medium truncate"
                          style={{ color: stayType ? "#1C1917" : "#C4BAB4" }}
                        >
                          {selectedType?.label || "Select stay type"}
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{
                            color: "#A8A29E",
                            transform: showTypeDropdown ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.22s cubic-bezier(.16,1,.3,1)",
                            flexShrink: 0,
                          }}
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Premium Stay type accordion dropdown */}
                 {/* Premium Stay type accordion dropdown */}
                  {showTypeDropdown && (
                    <div
                      className="sticky-dropdown premium-scrollbar relative sm:absolute left-0 right-0 sm:right-auto sm:top-[calc(100%+16px)] mt-3 sm:mt-0 overflow-y-auto overflow-x-hidden sm:rounded-2xl border-t sm:border border-[#F0EBE4] sm:border-[#EDE7DF] bg-[#fdf5f1] sm:bg-white/95 sm:backdrop-blur-xl w-full sm:w-[280px] shadow-none sm:shadow-[0_24px_48px_-12px_rgba(28,25,23,0.25),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      onMouseEnter={openTypeDropdown}
                      onMouseLeave={closeTypeDropdown}
                      style={{ maxHeight: "min(60vh, 400px)" }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {/* FIX: sm:bg-transparent removes mobile header styling on web */}
                      <div className="bg-[#FDF7F2] sm:bg-transparent px-4 sm:px-5 pt-4 pb-3 sm:border-b sm:border-[rgba(240,235,228,0.6)]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#A8A29E" }}>
                          Property type
                        </p>
                      </div>
                      
                      {/* FIX: sm:bg-transparent removes the orange box on web */}
                      <div className="flex flex-col gap-2 bg-[#FFF4EC] sm:bg-transparent p-2 rounded-b-2xl sm:rounded-none">
                        {categoriesLoading ? (
                          <div className="px-3 py-4 text-sm text-neutral-500">
                            Loading categories...
                          </div>
                        ) : stayTypeOptions.length > 1 ? (
                          stayTypeOptions.map((type, i) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setStayType(type.value);
                                setShowDestDropdown(false);
                                setTimeout(() => { setShowTypeDropdown(false); }, 0);
                              }}
                              // FIX: sm:bg-transparent sm:shadow-none removes the clunky white cards on web
                              className={`type-row flex w-full bg-white sm:bg-transparent shadow-sm sm:shadow-none items-center gap-3.5 rounded-xl px-2 sm:px-4 py-3.5 sm:py-2.5 text-left ${stayType !== null && stayType === type.value ? "type-active" : ""}`}
                              style={{ animationDelay: `${i * 25}ms` }}
                            >
                              <span className="text-lg sm:text-base">{type.icon}</span>
                              <span
                                className="text-[13.5px] font-medium flex-1"
                                style={{ color: stayType === type.value ? "#E07B54" : "#1C1917" }}
                              >
                                {type.label}
                              </span>
                              {stayType === type.value && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2.5 7l3 3 6-6" stroke="#E07B54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-neutral-500">
                            No categories added yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Actions ── */}
                <div className="flex w-full sm:w-auto items-center gap-2 px-6 sm:px-3.5 pb-3 sm:pb-0">
                  <button
                    onClick={handleStickySearch}
                    className="sticky-search-btn flex flex-1 sm:w-auto items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-[13px] font-bold text-white"
                  >
                    <SearchIcon />
                    <span className="hidden sm:inline">Search</span>
                  </button>

                  <button
                    onClick={() => setShowStickySearch(false)}
                    aria-label="Close search"
                    className="sticky-close-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[13px] font-medium"
                    style={{ borderColor: "#E8E0D8", color: "#78716C" }}
                  >
                    ✕
                  </button>
                </div>

              </div>

              {/* Subtle hint text below bar */}
              <p
                className="mt-2 text-center text-[11px]"
                style={{
                  color: "rgba(255,255,255,0.62)",
                  animation: "backdropIn 0.4s ease 0.3s both",
                }}
              >
                
              </p>
            </div>
          </div>
        </>
      )}

      <Hero
        ready={ready}
        focusIndex={focusIndex}
        setFocusIndex={setFocusIndex}
        stickyActive={showStickySearch}
        searchRef={heroSearchRef}
        heroRef={heroRef}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        stayType={stayType}
        setStayType={setStayType}
        
        onSearchFocus={handleSearchFocus}
        
      />
      {!showStickySearch && (
  <FilterBar
    filters={filters}
    setFilters={setFilters}
  />
)}

<HomeSections filters={filters} />
      <HavenLowerSections />
      
      <InstagramSection />
      <Footer />
    </div>
  );
}