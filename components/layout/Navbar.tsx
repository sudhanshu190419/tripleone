"use client";

import { useState, useRef, useEffect } from "react";
import CompactSearchBar from "@/components/search/CompactSearchBar";

type NavbarProps = {
  isScrolled?: boolean;
  forceSearch?: boolean;
  onExpand?: () => void;
};

// ── tiny SVG icons (no extra dep) ──────────────────────────────────────────
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
             15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── dropdown menu items ─────────────────────────────────────────────────────
const MENU_ITEMS = [
  { label: "Sign up",       bold: true  },
  { label: "Log in",        bold: false },
  { divider: true },
  { label: "Host your home",   bold: false },
  { label: "Host an experience", bold: false },
  { label: "Help centre",   bold: false },
];

// ── notification dot ────────────────────────────────────────────────────────
const NotifDot = () => (
  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                   bg-[#FF385C] ring-2 ring-white" />
);

export default function Navbar({ isScrolled= true, forceSearch, onExpand }: NavbarProps) {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [hoverHost, setHoverHost] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ── font import (scoped to this component via style tag) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .haven-nav * { font-family: 'DM Sans', sans-serif; }

        /* host link underline animation */
        .host-link::after {
          content: '';
          display: block;
          height: 1.5px;
          background: #222;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.22s ease;
        }
        .host-link:hover::after { transform: scaleX(1); }

        /* menu dropdown enter */
        @keyframes menuDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .menu-dropdown { animation: menuDrop 0.18s ease forwards; }

        /* avatar ring pulse on hover */
        .avatar-wrap:hover .avatar-ring {
          box-shadow: 0 0 0 3px rgba(255,56,92,0.25);
        }
      `}</style>

      <header
        className={`
          haven-nav
          fixed inset-x-0 top-0 z-50
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? "h-[80px] border-b border-[#EBEBEB] bg-white/90 backdrop-blur-xl"
            : "h-20 bg-white"
          }
        `}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center
                        justify-between px-4 sm:px-6 lg:px-10">

          {/* ── LOGO ─────────────────────────────────────────────────── */}
          <a href="/" className="hidden md:flex items-center gap-2.5 flex-shrink-0 group select-none">
            {/* icon mark */}
            <div className="relative w-9 h-9 rounded-xl bg-[#FF385C] flex items-center
                            justify-center shadow-[0_2px_8px_rgba(255,56,92,0.35)]
                            transition-transform duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-base leading-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>S</span>
              {/* subtle shine */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br
                               from-white/20 to-transparent pointer-events-none" />
            </div>
            {/* wordmark */}
            <span className="text-[#222] font-semibold text-[17px] tracking-[-0.3px]
                             transition-colors duration-200 group-hover:text-[#FF385C]">
              Stayfinder
            </span>
          </a>

          {/* ── COMPACT LOGO (mobile) ─────────────────────────────────── */}
          <a href="/" className="flex md:hidden items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#FF385C] flex items-center
                            justify-center shadow-[0_2px_6px_rgba(255,56,92,0.3)]">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </a>

          {/* ── SEARCH BAR ───────────────────────────────────────────── */}
          <div className="flex-1 flex justify-center px-4 sm:px-8">
            <CompactSearchBar
  isScrolled={isScrolled}
  forceShow={forceSearch}
  onExpand={onExpand}
/>
          </div>

          {/* ── RIGHT CONTROLS ───────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">

            {/* "Become a host" link */}
            <a
              href="/host"
              onMouseEnter={() => setHoverHost(true)}
              onMouseLeave={() => setHoverHost(false)}
              className="host-link relative text-[13.5px] font-medium text-[#222]
                         px-4 py-2 rounded-full transition-colors duration-200
                         hover:bg-[#F7F7F7]"
            >
              Become a host
            </a>

            {/* Language / globe */}
            <button
              aria-label="Choose language"
              className="p-2.5 rounded-full text-[#222] transition-colors duration-200
                         hover:bg-[#F7F7F7] hover:text-[#FF385C]"
            >
              <GlobeIcon />
            </button>

            {/* Profile / menu pill */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className={`
                  flex items-center gap-2.5
                  border rounded-full pl-3.5 pr-2.5 py-2
                  transition-all duration-200 select-none
                  ${menuOpen
                    ? "border-[#BBBBBB] shadow-[0_2px_12px_rgba(0,0,0,0.12)] bg-white"
                    : "border-[#DDDDDD] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)] bg-white"
                  }
                `}
              >
                {/* hamburger */}
                <span className="text-[#222] flex items-center">
                  <MenuIcon />
                </span>

                {/* avatar */}
                <div className="avatar-wrap relative">
                  <div className="avatar-ring w-7 h-7 rounded-full bg-gradient-to-br
                                  from-[#888] to-[#555] flex items-center justify-center
                                  text-white transition-all duration-200">
                    <UserIcon />
                  </div>
                  {/* notification dot — remove if not needed */}
                  <NotifDot />
                </div>

                {/* tiny chevron — rotates when open */}
                <span className={`text-[#555] transition-transform duration-200
                                  ${menuOpen ? "rotate-180" : ""}`}>
                  <ChevronDownIcon />
                </span>
              </button>

              {/* ── DROPDOWN ─────────────────────────────────────────── */}
              {menuOpen && (
                <div
                  className="menu-dropdown absolute right-0 top-[calc(100%+8px)] w-56
                             bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)]
                             border border-[#EBEBEB] overflow-hidden z-50"
                >
                  {MENU_ITEMS.map((item, idx) =>
                    "divider" in item ? (
                      <hr key={idx} className="border-[#F0F0F0] my-1" />
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setMenuOpen(false)}
                        className={`
                          w-full text-left px-4 py-3 text-[13.5px]
                          transition-colors duration-150
                          hover:bg-[#F7F7F7] active:bg-[#EFEFEF]
                          ${item.bold
                            ? "font-semibold text-[#111]"
                            : "font-normal text-[#444]"
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── MOBILE RIGHT: avatar only ───────────────────────────── */}
          <button className="flex md:hidden items-center border border-[#DDD]
                             rounded-full p-1.5 gap-1.5 shadow-sm bg-white">
            <MenuIcon />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#888] to-[#555]
                            flex items-center justify-center text-white">
              <UserIcon />
            </div>
          </button>

        </div>

        {/* ── SCROLLED BOTTOM GLOW LINE ───────────────────────────────── */}
        <div
          className={`fixed top-[80px] inset-x-0 h-[1px] transition-opacity duration-300
                       bg-gradient-to-r from-transparent via-[#E07B54]/60 to-transparent
                       ${isScrolled ? "opacity-100" : "opacity-0"}`}
        />
      </header>
    </>
  );
}