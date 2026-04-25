"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HavenListings from "@/components/haven/HavenListings";
import HavenLowerSections from "@/components/haven/HavenLowerSections";
import Footer from "@/components/layout/Footer";
import InstagramSection from "@/components/home/InstagramSection";
import {
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/havenIcons";

const suggestedDestinations = [
  { name: "Nearby", subtitle: "Find what's around you", icon: "location" },
  { name: "Varanasi, Uttar Pradesh", subtitle: "Because your wishlist has stays in Varanasi", icon: "landmark" },
  { name: "Noida, Uttar Pradesh", subtitle: "Guests interested in New Delhi also looked here", icon: "city" },
  { name: "Dehradun, Uttarakhand", subtitle: "For nature lovers", icon: "nature" },
  { name: "Mussoorie, Uttarakhand", subtitle: "Hill escape", icon: "mountain" },
];

const STAY_TYPES = [
  { value: "", label: "Any type", icon: "✦" },
  { value: "home", label: "Entire home", icon: "🏡" },
  { value: "studio", label: "Studio apartment", icon: "🏢" },
  { value: "villa", label: "Villa", icon: "🌴" },
  { value: "cabin", label: "Cabin", icon: "🪵" },
];
const destinationIcons: Record<string, React.ReactNode> = {
  location: <MapPinIcon />,
  landmark: <CalendarIcon />,
  city: <UsersIcon />,
  nature: <MapPinIcon />,
  mountain: <MapPinIcon />,
};

export default function HavenHome() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [ready, setReady] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const stickyInputRef = useRef<HTMLInputElement>(null);
  const [stayType, setStayType] = useState("");

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
    setShowDestDropdown(true);
  };
  const closeDestDropdown = () => {
    destDropdownTimer.current = setTimeout(() => setShowDestDropdown(false), 160);
  };
  const openTypeDropdown = () => {
    if (typeDropdownTimer.current) clearTimeout(typeDropdownTimer.current);
    setShowTypeDropdown(true);
  };
  const closeTypeDropdown = () => {
    typeDropdownTimer.current = setTimeout(() => setShowTypeDropdown(false), 160);
  };

  const selectedType = STAY_TYPES.find((t) => t.value === stayType) ?? STAY_TYPES[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <Navbar isScrolled={!isHeroVisible} />

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
          background: #FEF3EE;
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
                className="sticky-search-bar flex items-stretch overflow-visible rounded-2xl border bg-white"
                style={{
                  borderColor: "#E8E0D8",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 16px 48px -8px rgba(28,25,23,0.16), 0 0 0 1px rgba(255,255,255,0.8) inset",
                }}
              >

                {/* ── Where ── */}
                <div
                  className="sticky-field relative min-w-0 flex-[2] cursor-text rounded-l-2xl px-4 py-3 transition-colors duration-150 sticky-field-active"
                  onFocus={openDestDropdown}
                  onBlur={closeDestDropdown}
                >
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

                      {/* Destination dropdown */}
                      {showDestDropdown && (
                        <div
                          className="sticky-dropdown absolute left-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border bg-white"
                          style={{
                            width: "340px",
                            borderColor: "#EDE7DF",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 48px -8px rgba(28,25,23,0.18)",
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {/* Header */}
                          <div className="border-b px-4 pt-3 pb-2" style={{ borderColor: "#F0EBE4" }}>
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#A8A29E" }}>
                              Suggested for you
                            </p>
                          </div>

                          <div className="p-2">
                            {suggestedDestinations
                              .filter((d) =>
                                searchLocation.trim() === "" ||
                                d.name.toLowerCase().includes(searchLocation.toLowerCase())
                              )
                              .map((dest, i) => (
                                <button
                                  key={dest.name}
                                  type="button"
                                  onClick={() => { setSearchLocation(dest.name); setShowDestDropdown(false); }}
                                  className="dest-row flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                                  style={{ animationDelay: `${i * 30}ms` }}
                                >
                                  <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                                    style={{ background: "#FEF3EE" }}
                                  >
                                   {destinationIcons[dest.icon]}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold truncate" style={{ color: "#1C1917" }}>
                                      {dest.name}
                                    </p>
                                    <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "#A8A29E" }}>
                                      {dest.subtitle}
                                    </p>
                                  </div>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 3l4 4-4 4" stroke="#D4C9BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Stay Type ── */}
                <div
                  className="sticky-field relative min-w-0 flex-[1.5] cursor-pointer px-4 py-3 transition-colors duration-150"
                  
                  onMouseEnter={openTypeDropdown}
  onMouseLeave={closeTypeDropdown}
                  
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
                          {selectedType.label}
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

                  {/* Stay type dropdown */}
                  {showTypeDropdown && (
                    <div
                      className="sticky-dropdown absolute left-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border bg-white"
                      onMouseEnter={openTypeDropdown}
                      onMouseLeave={closeTypeDropdown}
                      style={{
                        width: "220px",
                        borderColor: "#EDE7DF",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 48px -8px rgba(28,25,23,0.18)",
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="border-b px-4 pt-3 pb-2" style={{ borderColor: "#F0EBE4" }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#A8A29E" }}>
                          Property type
                        </p>
                      </div>
                      <div className="p-2">
                        {STAY_TYPES.map((type, i) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => { setStayType(type.value); setShowTypeDropdown(false); }}
                            className={`type-row flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left ${stayType === type.value ? "type-active" : ""}`}
                            style={{ animationDelay: `${i * 25}ms` }}
                          >
                            <span className="text-base">{type.icon}</span>
                            <span
                              className="text-[13px] font-medium flex-1"
                              style={{ color: stayType === type.value ? "#E07B54" : "#1C1917" }}
                            >
                              {type.label}
                            </span>
                            {stayType === type.value && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2.5 7l3 3 6-6" stroke="#E07B54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Actions ── */}
                <div className="flex shrink-0 items-center gap-2 px-3">
                  <button
                    onClick={handleStickySearch}
                    className="sticky-search-btn flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
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
      <HavenListings activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <HavenLowerSections />
      <InstagramSection />
      <Footer />
    </div>
  );
}