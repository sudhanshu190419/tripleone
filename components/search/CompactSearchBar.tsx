"use client";

import { Search } from "lucide-react";

type CompactSearchBarProps = {
  isScrolled: boolean;
  onExpand?: () => void;
};

export default function CompactSearchBar({ isScrolled, onExpand }: CompactSearchBarProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label="Open search"
      className={`mx-auto flex w-full items-center justify-between rounded-full border border-[#dddddd] bg-white px-4 py-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${
        isScrolled
          ? "max-w-xl translate-y-0 scale-100 opacity-100"
          : "pointer-events-none max-w-4xl -translate-y-3 scale-90 opacity-0"
      }`}
    >
      <div className="flex min-w-0 items-center divide-x divide-[#ececec] text-sm text-[#222222]">
        <span className="truncate px-2 font-medium">Where</span>
        <span className="truncate px-2 text-[#6a6a6a]">Any week</span>
        <span className="truncate px-2 text-[#6a6a6a]">Add guests</span>
      </div>
      <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff385c] text-white">
        <Search className="h-4 w-4" />
      </span>
    </button>
  );
}