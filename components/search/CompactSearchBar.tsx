"use client";

import { useCallback, useId } from "react";
import { MapPin, Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CompactSearchBarProps {
  isScrolled: boolean;
  forceShow?: boolean;
  onExpand?: () => void;
  searchLocation?: string;
  stayType?: string;
  /** Extra detail shown beneath the stay type, e.g. "Villa · 5 nights" */
  stayDetail?: string;
  /** Whether live availability should be indicated */
  isLive?: boolean;
  className?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({
  icon,
  label,
  value,
  isEmpty,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEmpty: boolean;
}) {
  return (
    <div className="group/pill flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-4 py-2 transition-colors duration-150 hover:bg-[#F8F5F1] dark:hover:bg-white/5">
      <span className="flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#8A8178]">
          {label}
        </p>
        <p
          className={cn(
            "truncate text-[10px] font-[480] leading-tight transition-colors",
            isEmpty ? "text-[#B0A89F]" : "text-[#1C1917]"
          )}
        >
          {value || (label === "Destination" ? "Search destination" : "Select stay type")}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <span
      aria-hidden="true"
      className="h-6 w-px flex-shrink-0 bg-[#DCCFC1]"
    />
  );
}

function LiveIndicator() {
  return (
    <span
      aria-label="Live availability"
      className="relative flex-shrink-0"
      title="Live availability"
    >
      <span className="block h-[7px] w-[7px] rounded-full bg-emerald-400" />
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
    </span>
  );
}

function SearchButton() {
  return (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#B94F2C] shadow-[0_8px_18px_rgba(185,79,44,0.25)] transition-all duration-150 group-hover:scale-[1.06] group-hover:bg-[#9F4122] group-active:scale-95">
      <Search className="h-[15px] w-[15px] text-white" strokeWidth={2} />
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompactSearchBar({
  isScrolled,
  forceShow = false,
  onExpand,
  searchLocation = "",
  stayType = "",
  stayDetail = "",
  isLive = true,
  className,
}: CompactSearchBarProps) {
  const labelId = useId();
  const isVisible = forceShow || isScrolled;

  const handleClick = useCallback(() => {
    onExpand?.();
  }, [onExpand]);

  return (
    <>
      {/* Mobile Search Trigger */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Open search"
        className={cn(
          "flex sm:hidden w-[12.25rem] max-w-[62vw] min-w-0 items-center gap-2 rounded-[22px] border border-[#E2D4C5] bg-[linear-gradient(180deg,#FFF9F3_0%,#FFFDFB_100%)] px-2 py-2 shadow-[0_8px_20px_rgba(17,24,39,0.08),0_2px_5px_rgba(17,24,39,0.05)] ring-1 ring-white/70 transition-all duration-300",
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B94F2C] text-white shadow-[0_8px_18px_rgba(185,79,44,0.24)]">
          <Search className="h-[15px] w-[15px]" />
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-center text-left pr-0.5">
          <p className="truncate text-[13px] font-semibold leading-tight text-[#1C1917]">
            Where to?
          </p>
          <p className="truncate text-[10px] leading-tight text-[#8A8178] mt-0.5">
            Search destination
          </p>
        </div>
      </button>

      {/* Desktop Search Bar */}
      <button
        type="button"
        aria-labelledby={labelId}
        onClick={handleClick}
        className={cn(
          "group relative mx-auto hidden sm:flex min-w-0 flex-1 max-w-[92vw] sm:max-w-xl items-center gap-0 overflow-hidden",
          "rounded-full border border-[#D9CDBF] bg-[#FFFCF8]",
          "px-[5px] py-[5px] pl-1.5",
          "shadow-[0_8px_24px_rgba(17,24,39,0.08),0_2px_6px_rgba(17,24,39,0.05)]",
          "hover:border-[#C9B7A8] hover:shadow-[0_14px_34px_rgba(17,24,39,0.12),0_4px_10px_rgba(17,24,39,0.06)]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-full",
          "before:bg-[linear-gradient(90deg,transparent_0%,rgba(224,123,84,0.08)_50%,transparent_100%)]",
          "before:translate-x-[-100%] before:animate-[shimmer_3.2s_ease-in-out_infinite]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C05A35] focus-visible:ring-offset-2",
          "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-90 opacity-0",
          className
        )}
      >
        <span id={labelId} className="sr-only">
          {searchLocation
            ? `Searching ${searchLocation}${stayType ? `, ${stayType}` : ""}`
            : "Open search"}
        </span>

        <Pill
          icon={
            <MapPin
              className="h-[15px] w-[15px] flex-shrink-0 text-[#C05A35]"
              strokeWidth={1.8}
            />
          }
          label="Destination"
          value={searchLocation}
          isEmpty={!searchLocation}
        />

        <Divider />

        <Pill
          icon={
            <Home
              className="h-[15px] w-[15px] flex-shrink-0 text-[#8A8178]"
              strokeWidth={1.8}
            />
          }
          label="Stay type"
          value={stayDetail ? `${stayType} · ${stayDetail}` : stayType}
          isEmpty={!stayType}
        />

       
      </button>
    </>
  );
}