"use client";

import { useEffect, useRef, useState } from "react";
import HavenNavbar from "@/components/haven/HavenNavbar";
import HavenHero from "@/components/haven/HavenHero";
import HavenListings from "@/components/haven/HavenListings";
import HavenLowerSections from "@/components/haven/HavenLowerSections";
import HavenFooter from "@/components/haven/HavenFooter";
import HavenStickySearch from "@/components/haven/HavenStickySearch";

type SearchOrigin = {
  top: number;
  left: number;
  width: number;
};

export default function HavenHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [stickyOrigin, setStickyOrigin] = useState<SearchOrigin | null>(null);
  const [ready, setReady] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  const stickyVisibleRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const shouldShowSticky = window.scrollY > 260;

      if (heroSearchRef.current && stickyVisibleRef.current !== shouldShowSticky) {
        const rect = heroSearchRef.current.getBoundingClientRect();
        setStickyOrigin({ top: rect.top, left: rect.left, width: rect.width });
      }

      stickyVisibleRef.current = shouldShowSticky;
      setScrolled(window.scrollY > 30);
      setShowStickySearch(shouldShowSticky);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <HavenNavbar ready={ready} scrolled={scrolled} />
      <HavenStickySearch
        visible={showStickySearch}
        focusIndex={focusIndex}
        setFocusIndex={setFocusIndex}
        origin={stickyOrigin}
      />
      <HavenHero
        ready={ready}
        focusIndex={focusIndex}
        setFocusIndex={setFocusIndex}
        stickyActive={showStickySearch}
        searchRef={heroSearchRef}
      />
      <HavenListings activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <HavenLowerSections />
      <HavenFooter />
    </div>
  );
}