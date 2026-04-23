"use client";

import CompactSearchBar from "@/components/search/CompactSearchBar";

type NavbarProps = {
  isScrolled: boolean;
  onExpand?: () => void;
};

export default function Navbar({ isScrolled, onExpand }: NavbarProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-in-out ${
        isScrolled
          ? "border-[#e8e8e8] bg-white/85 backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center px-4 sm:px-6">
        <div className="w-full">
          <CompactSearchBar isScrolled={isScrolled} onExpand={onExpand} />
        </div>
      </div>
    </header>
  );
}