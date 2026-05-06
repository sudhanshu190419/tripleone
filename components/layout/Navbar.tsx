"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CompactSearchBar from "@/components/search/CompactSearchBar";

type NavbarProps = {
  isScrolled?: boolean;
  forceSearch?: boolean;
  onExpand?: () => void;
  searchLocation: string;
  stayType: string;
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

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.06 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.61a2 2 0 0 1-.45 2.11L8.11 9.61a16 16 0 0 0 6.28 6.28l1.16-1.16a2 2 0 0 1 2.11-.45c.83.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92z" />
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

export default function Navbar({
  isScrolled = true,
  forceSearch,
  onExpand,
  searchLocation,
  stayType,
}: NavbarProps) {
  const mobilePhone = "919876543210";
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
          <a href="/" className="hidden md:flex items-center flex-shrink-0 group select-none">
            <div className="relative h-12 w-[172px] overflow-hidden lg:h-14 lg:w-[192px]">
              <Image
                src="/logo.svg"
                alt="Stayfinder logo"
                fill
                priority
                sizes="(min-width: 1024px) 192px, 172px"
                className="object-cover object-left transition-transform duration-200 group-hover:scale-[1.04]"
              />
            </div>
          </a>

          {/* ── COMPACT LOGO (mobile) ─────────────────────────────────── */}
          <a href="/" className="flex md:hidden items-center flex-shrink-0">
            <div className="relative h-10 w-[138px] overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Stayfinder logo"
                fill
                priority
                sizes="138px"
                className="object-cover object-left"
              />
            </div>
          </a>

          {/* ── SEARCH BAR ───────────────────────────────────────────── */}
          <div className="flex-1 flex justify-center px-4 sm:px-8">
            <CompactSearchBar
  isScrolled={isScrolled}
  forceShow={forceSearch}
  onExpand={onExpand}
  searchLocation={searchLocation}
  stayType={stayType}
/>
          </div>

          {/* ── RIGHT CONTROLS ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href={`tel:${mobilePhone}`}
              className="group inline-flex items-center gap-3 rounded-full border border-[#E8DBCF] bg-white/90 px-4 py-2.5 shadow-[0_16px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(15,23,42,0.11)]"
              aria-label="Call Stayfinder"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF2EA] to-[#FBE4D9] text-[#D86A3A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-200 group-hover:scale-[1.04]">
                <PhoneIcon />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A18F83]">
                  Call us
                </span>
                <span className="text-sm font-semibold tracking-[0.02em] text-[#1F2937]">
                  +91 98765 43210
                </span>
              </span>
            </a>
          </div>

          {/* ── MOBILE RIGHT: avatar only ───────────────────────────── */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <button className="flex items-center border border-[#DDD] rounded-full p-1.5 gap-1.5 shadow-sm bg-white">
              <MenuIcon />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#888] to-[#555] flex items-center justify-center text-white">
                <UserIcon />
              </div>
            </button>
          </div>

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