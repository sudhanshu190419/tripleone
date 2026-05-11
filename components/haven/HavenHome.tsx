"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import {
  Building,
  Building2,
  Home as HomeIcon,
  Mountain,
  Sparkles,
  Sprout,
  TentTree,
  Umbrella,
  Waves,
  ArrowLeft,
  X,
} from "lucide-react";
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
import {
  PROPERTY_CATEGORY_COLLECTION,
  PROPERTY_LOCATION_COLLECTION,
} from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Icon helpers                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const destinationIconFor = (name: string) => {
  const n = name.toLowerCase();
  if (
    n.includes("delhi") ||
    n.includes("noida") ||
    n.includes("gurgaon") ||
    n.includes("greater")
  )
    return <Building className="h-4 w-4" strokeWidth={1.8} />;
  if (
    n.includes("mountain") ||
    n.includes("hill") ||
    n.includes("valley") ||
    n.includes("uttrakhand") ||
    n.includes("uttarakhand")
  )
    return <Mountain className="h-4 w-4" strokeWidth={1.8} />;
  if (
    n.includes("beach") ||
    n.includes("goa") ||
    n.includes("maldives") ||
    n.includes("coast")
  )
    return <Waves className="h-4 w-4" strokeWidth={1.8} />;
  return <MapPinIcon />;
};

const stayTypeIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n === "any type") return <Sparkles className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("home")) return <HomeIcon className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("villa")) return <Building2 className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("beach")) return <Waves className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("mountain")) return <Mountain className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("cabin")) return <TentTree className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("farm")) return <Sprout className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("island")) return <Umbrella className="h-4 w-4" strokeWidth={1.8} />;
  if (n.includes("city") || n.includes("loft") || n.includes("studio"))
    return <Building className="h-4 w-4" strokeWidth={1.8} />;
  return <UsersIcon />;
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Component                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function HavenHome() {
  const router = useRouter();

  const { items: locations, loading: locationsLoading } =
    usePropertyTaxonomy(PROPERTY_LOCATION_COLLECTION);
  const { items: categories, loading: categoriesLoading } =
    usePropertyTaxonomy(PROPERTY_CATEGORY_COLLECTION);

  /* ── Core search state ── */
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [stayType, setStayType] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    type: null,
    location: null,
    date: null,
    budget: null,
    availability: null,
    sort: null,
  });

  const checkInDate = selectedRange?.from
    ? format(selectedRange.from, "yyyy-MM-dd")
    : "";
  const checkOutDate = selectedRange?.to
    ? format(selectedRange.to, "yyyy-MM-dd")
    : "";

  /* ── UI state ── */
  const [showCalendar, setShowCalendar] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [ready, setReady] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  /* ── Mobile state ── */
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState<0 | 1 | 2>(0);
  const [mobileQuery, setMobileQuery] = useState("");

  /* ── Refs ── */
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const destDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Derived ── */
  const stayTypeOptions = [
    { value: "any", label: "Any type", icon: stayTypeIcon("Any type") },
    ...categories.map((c) => ({
      value: c.name,
      label: c.name,
      icon: stayTypeIcon(c.name),
    })),
  ];
  const selectedType = stayType
    ? stayTypeOptions.find((t) => t.value === stayType)
    : null;

  const suggestedDestinations = locations.map((l) => ({
    name: l.name,
    subtitle: `Explore stays in ${l.name}`,
    iconNode: destinationIconFor(l.name),
  }));

  const filteredDestsDesktop = suggestedDestinations.filter(
    (d) =>
      searchLocation.trim() === "" ||
      d.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const filteredDestsMobile = suggestedDestinations.filter(
    (d) =>
      mobileQuery.trim() === "" ||
      d.name.toLowerCase().includes(mobileQuery.toLowerCase())
  );

  /* ── Effects ── */
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setIsHeroVisible(e.isIntersecting),
      { threshold: 0.4 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => {
      if (heroRef.current) obs.unobserve(heroRef.current);
    };
  }, []);

  useEffect(() => {
    if (showStickySearch && !isMobile) {
      const t = setTimeout(() => stickyInputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
    if (showStickySearch && isMobile && mobileStep === 0) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 260);
      return () => clearTimeout(t);
    }
  }, [showStickySearch, isMobile, mobileStep]);

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

  useEffect(() => {
    const close = () => setShowCalendar(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* Lock body scroll when mobile modal is open */
  useEffect(() => {
    if (isMobile && showStickySearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, showStickySearch]);

  /* ── Handlers ── */
  const handleSearchFocus = () => {
    if (isMobile) setMobileStep(0);
    setShowStickySearch(true);
  };

  const handleStickySearch = () => {
    if (!searchLocation?.trim()) return;
    setShowStickySearch(false);
    router.push(
      `/search?location=${encodeURIComponent(searchLocation)}&type=${encodeURIComponent(
        stayType
      )}&checkIn=${encodeURIComponent(checkInDate)}&checkOut=${encodeURIComponent(checkOutDate)}`
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
      setShowDestDropdown(false);
      setShowTypeDropdown(true);
    } else {
      setShowTypeDropdown(false);
    }
  };

  /* Mobile step navigation */
  const mobileNextOrSearch = () => {
    if (mobileStep < 2) setMobileStep((s) => (s + 1) as 0 | 1 | 2);
    else handleStickySearch();
  };

  const mobileBack = () => {
    if (mobileStep > 0) setMobileStep((s) => (s - 1) as 0 | 1 | 2);
    else setShowStickySearch(false);
  };

  /* Bottom pill summary */
  const mobileSummaryParts = [
    searchLocation || "Anywhere",
    checkInDate && checkOutDate
      ? `${format(selectedRange!.from!, "d MMM")} – ${format(selectedRange!.to!, "d MMM")}`
      : "Any week",
    selectedType?.label || "Any type",
  ];

  /* ═══════════════════════════════════════════════════════════════════════ */
  /* RENDER                                                                  */
  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <Navbar
        isScrolled={!isHeroVisible}
        searchLocation={searchLocation}
        stayType={stayType}
        onExpand={() => setShowStickySearch(true)}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* GLOBAL STYLES                                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <style>{`
        /* Backdrop */
        @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        .sticky-backdrop { animation: backdropIn 0.22s ease both; }

        /* Desktop bar spring */
        @keyframes barIn {
          0%   { opacity: 0;   transform: translateY(-14px) scaleY(0.92) scaleX(0.98); }
          55%  { opacity: 1;   transform: translateY(3px)   scaleY(1.01) scaleX(1); }
          78%  { transform: translateY(-1px) scaleY(0.995); }
          100% { opacity: 1;   transform: translateY(0)     scaleY(1)    scaleX(1); }
        }
        .sticky-search-bar {
          animation: barIn 0.42s cubic-bezier(.16,1,.3,1) both;
          transform-origin: top center;
        }

        /* Field divider (desktop) */
        .sticky-field + .sticky-field { border-left: 1px solid #EDE7DF; }

        /* Calendar layout */
        .horizontal-calendar .rdp-months {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          align-items: start;
        }
        .horizontal-calendar .rdp-month { width: 100%; }
        .horizontal-calendar .rdp-head_cell,
        .horizontal-calendar .rdp-cell { padding: 2px; }
        @media (max-width: 640px) {
          .horizontal-calendar .rdp-months { grid-template-columns: 1fr; gap: 12px; }
        }

        /* Dropdown spring */
        @keyframes dropIn {
          0%   { opacity: 0;   transform: translateY(-6px) scale(0.97); }
          60%  { opacity: 1;   transform: translateY(2px)  scale(1.005); }
          100% { opacity: 1;   transform: translateY(0)    scale(1); }
        }
        .sticky-dropdown { animation: dropIn 0.28s cubic-bezier(.16,1,.3,1) both; transform-origin: top left; }

        /* Mobile full-screen modal */
        @keyframes mobileModalIn {
          from { transform: translateY(100%); opacity: 0.7; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes mobileStepIn {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .mobile-modal { animation: mobileModalIn 0.4s cubic-bezier(.16,1,.3,1) both; }
        .mobile-step-content { animation: mobileStepIn 0.3s cubic-bezier(.16,1,.3,1) both; }

        /* Row hover effects */
        .dest-row { transition: background 0.14s ease, transform 0.12s ease; }
        .dest-row:hover { background: #FDF5F1; transform: translateX(2px); }
        .dest-row:active { transform: scale(0.985); }
        .type-row { transition: background 0.14s ease; }
        .type-row:hover { background: #FDF5F1; }
        .type-row.type-active { background: #FFF4EC; }

        /* Desktop search button */
        .sticky-search-btn {
          background: linear-gradient(135deg, #E07B54 0%, #D46542 100%);
          transition: transform 0.15s cubic-bezier(.16,1,.3,1), box-shadow 0.15s ease;
          box-shadow: 0 3px 12px rgba(224,123,84,0.28);
        }
        .sticky-search-btn:hover { transform: scale(1.04); box-shadow: 0 6px 22px rgba(224,123,84,0.40); background: linear-gradient(135deg, #D46542 0%, #C25630 100%); }
        .sticky-search-btn:active { transform: scale(0.97); }

        .sticky-close-btn { transition: background 0.14s ease, transform 0.12s ease; }
        .sticky-close-btn:hover { background: #F0EAE3; transform: rotate(90deg) scale(1.1); }
        .sticky-field-active { background: #FDF5F1 !important; }

        /* Mobile bottom CTA */
        .mobile-cta-btn {
          background: linear-gradient(135deg, #E07B54 0%, #C25630 100%);
          box-shadow: 0 6px 24px rgba(224,123,84,0.42);
          transition: transform 0.15s cubic-bezier(.16,1,.3,1), box-shadow 0.15s;
        }
        .mobile-cta-btn:active { transform: scale(0.97); box-shadow: 0 2px 10px rgba(224,123,84,0.28); }

        /* Step dot */
        .step-dot {
          height: 6px; border-radius: 999px;
          transition: all 0.3s cubic-bezier(.16,1,.3,1);
          background: #E0D9D2;
        }
        .step-dot.active { background: #E07B54; }

        /* Mobile type card */
        .mobile-type-card {
          transition: border-color 0.15s, background 0.15s, transform 0.13s;
        }
        .mobile-type-card:active { transform: scale(0.96); }
        .mobile-type-card.selected {
          border-color: #E07B54 !important;
          background: #FFF4EC !important;
        }

        /* Premium scrollbar */
        .premium-scrollbar::-webkit-scrollbar { width: 5px; }
        .premium-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .premium-scrollbar::-webkit-scrollbar-thumb { background-color: #E8E0D8; border-radius: 10px; }
        .premium-scrollbar { scrollbar-width: thin; scrollbar-color: #E8E0D8 transparent; }

        /* Mobile calendar */
        .mobile-cal .rdp { margin: 0 auto; }
        .mobile-cal .rdp-caption_label { font-size: 15px; font-weight: 700; }
        .mobile-cal .rdp-day { height: 42px; width: 42px; font-size: 14px; }
        .mobile-cal .rdp-head_cell { font-size: 11px; }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE FULL-SCREEN SEARCH MODAL                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showStickySearch && isMobile && (
        <div className="mobile-modal fixed inset-0 z-50 flex flex-col" style={{ background: "#FAFAF8" }}>

          {/* ── Top Navigation ── */}
          <div
            className="flex items-center justify-between px-4 pb-4"
            style={{ paddingTop: "max(env(safe-area-inset-top), 24px)", background: "#fff", borderBottom: "1px solid #F0EBE4" }}
          >
            <button
              onClick={mobileBack}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "#F4F0EC" }}
            >
              <ArrowLeft className="h-[18px] w-[18px]" style={{ color: "#1C1917" }} strokeWidth={2.2} />
            </button>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`step-dot ${i === mobileStep ? "active" : ""}`}
                  style={{ width: i === mobileStep ? 22 : 6 }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (mobileStep < 2) setMobileStep((s) => (s + 1) as 0 | 1 | 2);
                else setShowStickySearch(false);
              }}
              className="text-[13px] font-semibold underline underline-offset-2"
              style={{ color: "#78716C" }}
            >
              Skip
            </button>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto premium-scrollbar pb-36">

            {/* ════ STEP 0 — WHERE ════ */}
            {mobileStep === 0 && (
              <div className="mobile-step-content px-5 pt-7">
                <h2 className="text-[28px] font-bold tracking-tight mb-1" style={{ color: "#1C1917" }}>
                  Where to?
                </h2>
                <p className="text-[14px] mb-5" style={{ color: "#78716C" }}>
                  Search a destination or pick one below
                </p>

                {/* Search input */}
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-6"
                  style={{ background: "#F4F0EC", border: "1.5px solid #EDE7DF" }}
                >
                  <span style={{ color: "#E07B54", flexShrink: 0 }}>
                    <MapPinIcon />
                  </span>
                  <input
                    ref={mobileInputRef}
                    value={mobileQuery}
                    onChange={(e) => {
                      setMobileQuery(e.target.value);
                      setSearchLocation(e.target.value);
                    }}
                    placeholder="Search destinations…"
                    className="flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:font-normal"
                    style={{ color: "#1C1917" }}
                  />
                  {mobileQuery && (
                    <button
                      onClick={() => { setMobileQuery(""); setSearchLocation(""); }}
                      className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                      style={{ background: "#E0D9D2" }}
                    >
                      <X className="h-3 w-3" style={{ color: "#6B5F56" }} />
                    </button>
                  )}
                </div>

                {/* Destination list */}
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: "#6B5F56" }}>
                  {mobileQuery ? "Results" : "Suggested destinations"}
                </p>

                {locationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl p-3 animate-pulse" style={{ background: "#F4F0EC" }}>
                        <div className="h-11 w-11 rounded-xl" style={{ background: "#E8E0D8" }} />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-28 rounded" style={{ background: "#E8E0D8" }} />
                          <div className="h-2.5 w-20 rounded" style={{ background: "#EDE7DF" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredDestsMobile.length > 0 ? (
                  <div className="space-y-2">
                    {filteredDestsMobile.map((dest, i) => (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => {
                          setSearchLocation(dest.name);
                          setMobileQuery(dest.name);
                          setMobileStep(1);
                        }}
                        className="dest-row flex w-full items-center gap-3.5 rounded-2xl px-3 py-3.5 text-left"
                        style={{
                          background: searchLocation === dest.name ? "#FFF4EC" : "#fff",
                          border: `1.5px solid ${searchLocation === dest.name ? "#E07B54" : "#F0EBE4"}`,
                          animationDelay: `${i * 35}ms`,
                        }}
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: "#FEF3EE", color: "#E07B54" }}
                        >
                          {dest.iconNode}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold truncate" style={{ color: "#1C1917" }}>
                            {dest.name}
                          </p>
                          <p className="text-[12px] mt-0.5 truncate" style={{ color: "#78716C" }}>
                            {dest.subtitle}
                          </p>
                        </div>
                        {searchLocation === dest.name && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8l3.5 3.5 6.5-7" stroke="#E07B54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl p-6 text-center" style={{ background: "#F4F0EC" }}>
                    <p className="text-[14px]" style={{ color: "#78716C" }}>No destinations found</p>
                  </div>
                )}
              </div>
            )}

            {/* ════ STEP 1 — WHEN ════ */}
            {mobileStep === 1 && (
              <div className="mobile-step-content px-5 pt-7">
                <h2 className="text-[28px] font-bold tracking-tight mb-1" style={{ color: "#1C1917" }}>
                  When's your trip?
                </h2>
                <p className="text-[14px] mb-5" style={{ color: "#78716C" }}>
                  Pick your check-in and check-out dates
                </p>

                {/* Selected range display */}
                {selectedRange?.from && (
                  <div
                    className="flex items-center gap-3 mb-5 rounded-2xl p-4"
                    style={{ background: "#FFF4EC", border: "1.5px solid #F5D5C2" }}
                  >
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "#6B5F56" }}>Check-in</p>
                      <p className="text-[15px] font-bold" style={{ color: "#1C1917" }}>
                        {format(selectedRange.from, "d MMM yyyy")}
                      </p>
                    </div>
                    <div style={{ width: 1, height: 36, background: "#F5D5C2" }} />
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "#6B5F56" }}>Check-out</p>
                      <p className="text-[15px] font-bold" style={{ color: selectedRange.to ? "#1C1917" : "#A8A29E" }}>
                        {selectedRange.to ? format(selectedRange.to, "d MMM yyyy") : "Select date"}
                      </p>
                    </div>
                    {(selectedRange.from || selectedRange.to) && (
                      <button
                        onClick={() => setSelectedRange(undefined)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "#F5D5C2" }}
                      >
                        <X className="h-3.5 w-3.5" style={{ color: "#C25630" }} />
                      </button>
                    )}
                  </div>
                )}

                {/* Calendar */}
                <div
                  className="mobile-cal rounded-3xl p-4 overflow-hidden"
                  style={{ background: "#fff", border: "1.5px solid #F0EBE4" }}
                >
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                    styles={{
                      months: { display: "flex", flexDirection: "column", gap: 12 },
                      month: { width: "100%" },
                      
                    }}
                  />
                </div>

                {/* Quick picks */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "This weekend", days: 2 },
                    { label: "Next week",    days: 7 },
                    { label: "Next month",   days: 30 },
                  ].map(({ label, days }) => (
                    <button
                      key={label}
                      onClick={() => {
                        const from = new Date();
                        from.setDate(from.getDate() + 1);
                        const to = new Date(from);
                        to.setDate(to.getDate() + days);
                        setSelectedRange({ from, to });
                      }}
                      className="rounded-xl py-2.5 text-[12px] font-semibold text-center"
                      style={{ background: "#F4F0EC", color: "#4C4540", border: "1px solid #EDE7DF" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ════ STEP 2 — TYPE ════ */}
            {mobileStep === 2 && (
              <div className="mobile-step-content px-5 pt-7">
                <h2 className="text-[28px] font-bold tracking-tight mb-1" style={{ color: "#1C1917" }}>
                  What type of stay?
                </h2>
                <p className="text-[14px] mb-5" style={{ color: "#78716C" }}>
                  Choose the kind of property you're looking for
                </p>

                {categoriesLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "#F4F0EC" }} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {stayTypeOptions.map((type, i) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setStayType(type.value)}
                        className={`mobile-type-card flex flex-col items-start gap-2 rounded-2xl p-4 text-left ${stayType === type.value ? "selected" : ""}`}
                        style={{
                          background: "#fff",
                          border: "1.5px solid #F0EBE4",
                          animationDelay: `${i * 30}ms`,
                        }}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: stayType === type.value ? "#FEF3EE" : "#F4F0EC", color: stayType === type.value ? "#E07B54" : "#6B5F56" }}
                        >
                          {type.icon}
                        </span>
                        <span
                          className="text-[13px] font-semibold leading-snug"
                          style={{ color: stayType === type.value ? "#E07B54" : "#1C1917" }}
                        >
                          {type.label}
                        </span>
                        {stayType === type.value && (
                          <span className="absolute top-3 right-3">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="7" fill="#E07B54" />
                              <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sticky Bottom Bar ── */}
          <div
            className="absolute bottom-0 left-0 right-0 px-5 pt-4"
            style={{
              paddingBottom: "max(24px, env(safe-area-inset-bottom))",
              background: "linear-gradient(to top, #FAFAF8 70%, rgba(250,250,248,0))",
            }}
          >
            {/* Summary pill */}
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5 mb-3 overflow-hidden"
              style={{ background: "#F4F0EC" }}
            >
              {mobileSummaryParts.map((part, i) => (
                <span key={i} className="flex items-center gap-2 min-w-0">
                  {i > 0 && <span style={{ color: "#C4BAB4", flexShrink: 0 }}>·</span>}
                  <span
                    className="text-[12.5px] font-medium truncate"
                    style={{ color: (i === 0 && !searchLocation) || (i === 1 && !checkInDate) || (i === 2 && !stayType) ? "#A8A29E" : "#1C1917" }}
                  >
                    {part}
                  </span>
                </span>
              ))}
            </div>

            {/* CTA + Clear row */}
            <div className="flex gap-2.5">
              {(searchLocation || selectedRange || stayType) && (
                <button
                  onClick={() => { setSearchLocation(""); setMobileQuery(""); setSelectedRange(undefined); setStayType(""); }}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "#F4F0EC", border: "1.5px solid #EDE7DF" }}
                >
                  <X className="h-4.5 w-4.5" style={{ color: "#6B5F56" }} />
                </button>
              )}

              <button
                onClick={mobileNextOrSearch}
                className="mobile-cta-btn flex flex-1 items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold text-white"
                style={{ height: 52 }}
              >
                {mobileStep < 2 ? (
                  <>
                    <span>Continue</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP STICKY SEARCH BAR                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showStickySearch && !isMobile && (
        <>
          {/* Dimmed backdrop */}
          <div
            className="sticky-backdrop fixed inset-0 z-40"
            style={{
              background: "rgba(28,25,23,0.22)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={() => setShowStickySearch(false)}
          />

          {/* Bar */}
          <div className="fixed left-0 right-0 z-50 px-4 pt-3 pb-0" style={{ top: "80px" }}>
            <div className="mx-auto max-w-[800px]">
              <div
                className="sticky-search-bar flex flex-row overflow-visible rounded-2xl border bg-white"
                style={{
                  borderColor: "#E8E0D8",
                  boxShadow:
                    "0 4px 6px -1px rgba(0,0,0,0.04), 0 16px 48px -8px rgba(28,25,23,0.16), 0 0 0 1px rgba(255,255,255,0.8) inset",
                }}
              >
                {/* ── Where ── */}
                <div
                  className={`sticky-field relative w-full bg-white flex-[2] cursor-text rounded-l-2xl px-4 py-3 transition-colors duration-150 ${
                    showDestDropdown ? "z-50 sticky-field-active" : "z-10"
                  }`}
                  onFocus={openDestDropdown}
                  onBlur={closeDestDropdown}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0" style={{ color: "#E07B54" }}>
                      <MapPinIcon />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div
                        className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.09em]"
                        style={{ color: "#6B5F56" }}
                      >
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
                        className="w-full truncate bg-transparent text-[13.5px] font-medium outline-none placeholder:text-[#7C7067]"
                        style={{ color: "#1C1917" }}
                      />
                    </div>
                  </div>

                  {showDestDropdown && (
                    <div
                      className="sticky-dropdown premium-scrollbar absolute left-0 top-[calc(100%+16px)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#EDE7DF] bg-white/95 backdrop-blur-xl w-[380px] shadow-[0_24px_48px_-12px_rgba(28,25,23,0.25),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      style={{ maxHeight: "min(60vh, 400px)" }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="px-5 pt-4 pb-3 border-b border-[rgba(240,235,228,0.6)]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#6B5F56" }}>
                          Suggested for you
                        </p>
                        <p className="mt-1.5 text-sm font-semibold" style={{ color: "#1C1917" }}>
                          {locationsLoading ? "Loading locations..." : "Nearby"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 p-2">
                        {locationsLoading ? (
                          <div className="px-3 py-4 text-sm text-neutral-500">Loading locations...</div>
                        ) : filteredDestsDesktop.length > 0 ? (
                          filteredDestsDesktop.map((dest, i) => (
                            <button
                              key={dest.name}
                              type="button"
                              onClick={() => { setSearchLocation(dest.name); setShowDestDropdown(false); }}
                              className="dest-row flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-left"
                              style={{ animationDelay: `${i * 30}ms` }}
                            >
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: "#FEF3EE" }}
                              >
                                {dest.iconNode}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13.5px] font-semibold truncate" style={{ color: "#1C1917" }}>
                                  {dest.name}
                                </p>
                                <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "#6B5F56" }}>
                                  {dest.subtitle}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-neutral-500">No locations added yet</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Dates ── */}
                <div
                  className="sticky-field relative w-full bg-white flex-[1.5] px-4 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowCalendar((prev) => !prev);
                      setShowDestDropdown(false);
                      setShowTypeDropdown(false);
                    }}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    <span className="shrink-0" style={{ color: "#C4BAB4" }}>
                      <CalendarIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.09em]"
                        style={{ color: "#6B5F56" }}
                      >
                        Dates
                      </div>
                      <div
                        className="truncate text-[13.5px] font-medium"
                        style={{ color: checkInDate && checkOutDate ? "#1C1917" : "#7C7067" }}
                      >
                        {checkInDate && checkOutDate
                          ? `${format(selectedRange?.from!, "dd MMM")} — ${format(selectedRange?.to!, "dd MMM")}`
                          : "Select dates"}
                      </div>
                    </div>
                  </button>

                  {showCalendar && (
                    <div
                      className="sticky-dropdown absolute left-[66%] top-[calc(100%+16px)] z-[999] w-[720px] max-w-[95vw] -translate-x-1/2 rounded-2xl border border-[#EDE7DF] bg-white p-6 shadow-[0_24px_48px_-12px_rgba(28,25,23,0.25)]"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={setSelectedRange}
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                        className="horizontal-calendar"
                      />
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setShowCalendar(false)}
                          className="rounded-xl bg-[#E07B54] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Stay Type ── */}
                <div
                  className={`sticky-field relative w-full bg-white flex-[1.5] cursor-pointer px-4 py-3 transition-colors duration-150 ${
                    showTypeDropdown ? "z-50 sticky-field-active" : "z-10"
                  }`}
                  onClick={toggleTypeDropdown}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0" style={{ color: "#C4BAB4" }}>
                      <UsersIcon />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div
                        className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.09em]"
                        style={{ color: "#6B5F56" }}
                      >
                        Stay type
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[13.5px] font-medium truncate"
                          style={{ color: stayType ? "#1C1917" : "#7C7067" }}
                        >
                          {selectedType?.label || "Select stay type"}
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          style={{
                            color: "#A8A29E",
                            transform: showTypeDropdown ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.22s cubic-bezier(.16,1,.3,1)",
                            flexShrink: 0,
                          }}
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {showTypeDropdown && (
                    <div
                      className="sticky-dropdown premium-scrollbar absolute left-0 top-[calc(100%+16px)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#EDE7DF] bg-white/95 backdrop-blur-xl w-[280px] shadow-[0_24px_48px_-12px_rgba(28,25,23,0.25),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      onMouseEnter={openTypeDropdown}
                      onMouseLeave={closeTypeDropdown}
                      style={{ maxHeight: "min(60vh, 400px)" }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="px-5 pt-4 pb-3 border-b border-[rgba(240,235,228,0.6)]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#6B5F56" }}>
                          Property type
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 p-2">
                        {categoriesLoading ? (
                          <div className="px-3 py-4 text-sm text-neutral-500">Loading categories...</div>
                        ) : stayTypeOptions.length > 1 ? (
                          stayTypeOptions.map((type, i) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setStayType(type.value);
                                setShowDestDropdown(false);
                                setTimeout(() => setShowTypeDropdown(false), 0);
                              }}
                              className={`type-row flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-left ${
                                stayType !== null && stayType === type.value ? "type-active" : ""
                              }`}
                              style={{ animationDelay: `${i * 25}ms` }}
                            >
                              <span className="text-base">{type.icon}</span>
                              <span
                                className="text-[13.5px] font-medium flex-1"
                                style={{ color: stayType === type.value ? "#E07B54" : "#1C1917" }}
                              >
                                {type.label}
                              </span>
                              {stayType === type.value && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2.5 7l3 3 6-6" stroke="#E07B54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-neutral-500">No categories added yet</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Actions ── */}
                <div className="flex w-auto items-center gap-2 px-3.5">
                  <button
                    onClick={handleStickySearch}
                    className="sticky-search-btn flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
                  >
                    <SearchIcon />
                    <span>Search</span>
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
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PAGE CONTENT                                                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
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
        <FilterBar filters={filters} setFilters={setFilters} />
      )}

      <HomeSections filters={filters} />
      <HavenLowerSections />
      <InstagramSection />
      <Footer />
    </div>
  );
}