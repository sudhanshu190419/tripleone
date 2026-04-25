"use client";

import { Search } from "lucide-react";

type CompactSearchBarProps = {
  isScrolled: boolean;
  forceShow?: boolean; 
  onExpand?: () => void;
};

export default function CompactSearchBar({ isScrolled, forceShow, onExpand, }: CompactSearchBarProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label="Open search"
      className={`mx-auto flex w-full items-center justify-between rounded-full border border-[#dddddd] bg-white px-4 py-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${
        forceShow || isScrolled
          ? "max-w-xl translate-y-0 scale-100 opacity-100"
          : "pointer-events-none max-w-4xl -translate-y-3 scale-90 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-[#222222]">

  {/* LOCATION */}
  <div className="flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-3 py-2">
    <span>🛏️</span>
    <span className="font-medium">New Delhi</span>
  </div>

  {/* DATES */}
  <div className="flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-3 py-2">
    <span>📅</span>
    <span>24 Apr</span>
    <span className="text-gray-400">|</span>
    <span>25 Apr</span>
  </div>

  {/* GUESTS */}
  <div className="flex items-center gap-2 rounded-xl bg-[#f3f4f6] px-3 py-2">
    <span>👤</span>
    <span>1 room, 2 guests</span>
  </div>

</div>

{/* SEARCH BUTTON */}
<div className="ml-2 flex items-center justify-center rounded-xl bg-[#E07B54] px-5 py-2 text-sm font-semibold text-white hover:bg-[#C96840] transition-all">
  Search
</div>
    </button>
  );
}