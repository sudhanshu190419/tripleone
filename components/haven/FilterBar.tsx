"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { Home, MapPin, Wallet, ArrowUpDown, SlidersHorizontal, X, Check } from "lucide-react";
import { PROPERTY_CATEGORY_COLLECTION, PROPERTY_LOCATION_COLLECTION } from "@/lib/propertyTaxonomy";
import { usePropertyTaxonomy } from "@/hooks/usePropertyTaxonomy";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterValues = {
  type: string | null;
  location: string | null;
  date: string | null;
  budget: string | null;
  availability: string | null;
  sort: string | null;
};

type FilterKey = keyof FilterValues;

type FilterConfig = {
  key: FilterKey;
  label: string;
  icon: React.ElementType;
  options: string[];
};

// ─── Static config ────────────────────────────────────────────────────────────

const FILTER_BASE_CONFIG: FilterConfig[] = [
  {
    key: "type",
    label: "Property type",
    icon: Home,
    options: [],
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    options: [],
  },
  {
    key: "budget",
    label: "Budget",
    icon: Wallet,
    options: ["Under ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"],
  },
  {
    key: "sort",
    label: "Sort",
    icon: ArrowUpDown,
    options: ["Recommended", "Price: low to high", "Price: high to low", "Top rated"],
  },
];

const uniqueValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const buildFilterConfigs = (
  locations: string[],
  categories: string[],
  currentFilters: FilterValues
) =>
  FILTER_BASE_CONFIG.map((config) => {
    if (config.key === "type") {
      return {
        ...config,
        options: uniqueValues([...categories, currentFilters.type ?? ""]),
      };
    }

    if (config.key === "location") {
      return {
        ...config,
        options: uniqueValues([...locations, currentFilters.location ?? ""]),
      };
    }

    return config;
  });

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  :root {
    --fb-bg:           #FAFAF8;
    --fb-border:       #E5DED4;
    --fb-text:         #2E2A26;
    --fb-muted:        #9B8F83;
    --fb-surface:      #FFFFFF;
    --fb-hover-bg:     #F5F0EA;
    --fb-active-grad:  linear-gradient(135deg, #C17F53 0%, #A8633B 100%);
    --fb-active-shadow:0 6px 18px rgba(193,127,83,0.30);
    --fb-shadow-sm:    0 2px 8px rgba(0,0,0,0.04);
    --fb-shadow-md:    0 8px 24px rgba(0,0,0,0.08);
    --fb-shadow-dd:    0 12px 40px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06);
    --fb-radius-chip:  12px;
    --fb-radius-dd:    16px;
    --fb-ease-spring:  cubic-bezier(0.34, 1.40, 0.64, 1);
    --fb-ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── Filter bar ── */
  .fb-bar {
    position: sticky;
    top: 85px;
    z-index: 40;
    padding: 14px clamp(20px, 5vw, 56px);
    background: rgba(250, 250, 248, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(229, 222, 212, 0.6);
    box-shadow: 0 6px 24px rgba(28, 25, 23, 0.04);
  }

  .fb-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }

  /* ── Chip scroll track (mobile) ── */
  .fb-chips-track {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    padding-bottom: 2px; /* prevent clipping box-shadows */
  }
  .fb-chips-track::-webkit-scrollbar { display: none; }

  /* ── Fade edge before All Filters button ── */
  .fb-right-fade {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .fb-right-fade::before {
    margin-left: 12px;
  }

  /* ── Chip enter animation ── */
  @keyframes fb-chip-in {
    from { opacity: 0; transform: translateY(8px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .fb-chip-wrap {
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  /* ── Trigger chip ── */
  .fb-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 15px;
    border-radius: var(--fb-radius-chip);
    border: 1px solid var(--fb-border);
    background: var(--fb-surface);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--fb-text);
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.18s var(--fb-ease-out),
                box-shadow 0.18s var(--fb-ease-out),
                background 0.15s ease,
                border-color 0.15s ease,
                color 0.15s ease;
    box-shadow: var(--fb-shadow-sm);
    outline-offset: 2px;
    font-family: inherit;
  }

  .fb-chip:hover { transform: translateY(-1.5px); box-shadow: var(--fb-shadow-md); border-color: #C4B9AC; }
  .fb-chip:focus-visible { outline: 2px solid #C17F53; }
  .fb-chip[aria-expanded="true"] { box-shadow: var(--fb-shadow-md); }

  .fb-chip.fb-chip--active {
    background: var(--fb-active-grad);
    border-color: transparent;
    color: #fff;
    box-shadow: var(--fb-active-shadow);
  }
  .fb-chip.fb-chip--active:hover { filter: brightness(0.93); transform: translateY(-1.5px); }

  .fb-chip__dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.9); flex-shrink: 0;
    animation: fb-dot-pop 0.22s var(--fb-ease-spring);
  }
  @keyframes fb-dot-pop { from { transform: scale(0); } to { transform: scale(1); } }

  .fb-chip__caret {
    flex-shrink: 0;
    transition: transform 0.26s var(--fb-ease-spring);
  }
  .fb-chip__caret--open { transform: rotate(180deg); }

  /* ── Desktop dropdown ── */
  .fb-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: 99999;
    min-width: 215px;
    background: #fff;
    border: 1px solid #E8E2DA;
    border-radius: var(--fb-radius-dd);
    box-shadow: var(--fb-shadow-dd);
    overflow: hidden;
    transform-origin: top left;
  }

  @keyframes fb-dd-in  { from { opacity:0; transform:scale(0.92) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes fb-dd-out { from { opacity:1; transform:scale(1) translateY(0); } to { opacity:0; transform:scale(0.94) translateY(-6px); } }

  .fb-dropdown--enter { animation: fb-dd-in  0.22s var(--fb-ease-spring) forwards; }
  .fb-dropdown--exit  { animation: fb-dd-out 0.17s ease-in             forwards; }

  .fb-dd-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px 9px; border-bottom: 1px solid #F0EBE4;
  }
  .fb-dd-header__label {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--fb-muted);
  }
  .fb-dd-clear {
    font-size: 11.5px; color: var(--fb-muted); cursor: pointer;
    padding: 2px 8px; border-radius: 6px; border: none;
    background: none; font-family: inherit; transition: background .13s, color .13s;
  }
  .fb-dd-clear:hover { background: var(--fb-hover-bg); color: #4A4540; }

  .fb-dd-options { padding: 5px; }

  @keyframes fb-opt-in { from { opacity:0; transform:translateX(-5px); } to { opacity:1; transform:translateX(0); } }

  .fb-option {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 9px; border-radius: 10px; cursor: pointer;
    transition: background 0.12s;
    animation: fb-opt-in 0.2s var(--fb-ease-spring) both;
  }
  .fb-option:hover               { background: #FAF7F3; }
  .fb-option.fb-option--selected { background: var(--fb-hover-bg); }

  .fb-option__icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #F0EBE4; transition: background .13s;
  }
  .fb-option--selected .fb-option__icon { background: #E8DFD4; }

  .fb-option__label {
    flex: 1; font-size: 13.5px; font-weight: 400; color: #3A3530;
    transition: font-weight .1s, color .1s;
  }
  .fb-option--selected .fb-option__label { font-weight: 500; color: #2E2520; }

  .fb-option__tick {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid #D5CFC7; display: flex; align-items: center; justify-content: center;
    transition: background .16s, border-color .16s;
  }
  .fb-option--selected .fb-option__tick { background: #6B5F52; border-color: #6B5F52; }

  @keyframes fb-tick-pop { from { transform:scale(0); } to { transform:scale(1); } }
  .fb-tick-svg { animation: fb-tick-pop 0.16s var(--fb-ease-spring); }

  /* ── Right controls ── */
  .fb-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .fb-clear-all {
    padding: 8px 12px; border: 1.5px solid #E7E2DC; border-radius: 10px;
    background: transparent; font-size: 13px; color: #8C8480; cursor: pointer;
    transition: border-color .15s, color .15s; font-family: inherit;
    display: flex; align-items: center; gap: 5px;
  }
  .fb-clear-all:hover { border-color: #C5BFB8; color: #4A4540; }

  .fb-all-filters {
    padding: 10px 16px; border-radius: var(--fb-radius-chip);
    background: #1C1917; color: #FAFAF8; font-size: 13px; font-weight: 600;
    display: inline-flex; align-items: center; gap: 7px; cursor: pointer; border: none;
    box-shadow: 0 4px 16px rgba(28,25,23,0.22); font-family: inherit;
    transition: transform .16s var(--fb-ease-out), box-shadow .16s var(--fb-ease-out);
    white-space: nowrap;
  }
  .fb-all-filters:hover  { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,25,23,0.30); }
  .fb-all-filters:active { transform: translateY(0); }
  .fb-all-filters:focus-visible { outline: 2px solid #C17F53; outline-offset: 2px; }

  /* ── Mobile bottom sheet backdrop ── */
  .fb-backdrop {
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(20, 17, 14, 0);
    transition: background 0.28s ease;
    pointer-events: none;
  }
  .fb-backdrop--visible {
    background: rgba(20, 17, 14, 0.45);
    pointer-events: all;
  }

  /* ── Bottom sheet ── */
  .fb-sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999;
    background: #fff;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -8px 40px rgba(28,25,23,0.18);
    transform: translateY(100%);
    transition: transform 0.36s var(--fb-ease-out);
    max-height: 82svh;
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .fb-sheet--open { transform: translateY(0); }

  /* Drag handle */
  .fb-sheet__handle {
    width: 36px; height: 4px; border-radius: 99px;
    background: #DDD8D2; margin: 12px auto 0;
    flex-shrink: 0;
  }

  /* Sheet header */
  .fb-sheet__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px 12px;
    border-bottom: 1px solid #F0EBE4;
    flex-shrink: 0;
  }
  .fb-sheet__title {
    font-size: 15px; font-weight: 600; color: #2E2A26;
    display: flex; align-items: center; gap: 8px;
  }
  .fb-sheet__close {
    width: 32px; height: 32px; border-radius: 50%;
    background: #F5F0EA; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #6B5F52; font-family: inherit;
    transition: background .15s;
  }
  .fb-sheet__close:hover { background: #EDE6DC; }

  /* Sheet body scroll */
  .fb-sheet__body {
    flex: 1; overflow-y: auto; overscroll-behavior: contain;
    padding: 8px 12px 20px;
  }

  /* Section inside sheet */
  .fb-sheet__section { margin-bottom: 4px; }
  .fb-sheet__section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #9B8F83;
    padding: 10px 8px 6px;
  }

  /* Sheet option rows — pill style */
  .fb-sheet__option {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 12px; border-radius: 12px; cursor: pointer;
    transition: background .12s;
  }
  .fb-sheet__option:active { background: #F5F0EA; }
  .fb-sheet__option--selected { background: #F5F0EA; }

  .fb-sheet__opt-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #F0EBE4;
  }
  .fb-sheet__option--selected .fb-sheet__opt-icon { background: #E4D9CC; }

  .fb-sheet__opt-label {
    flex: 1; font-size: 14px; color: #3A3530;
  }
  .fb-sheet__option--selected .fb-sheet__opt-label { font-weight: 500; color: #1C1917; }

  .fb-sheet__opt-check {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid #D5CFC7;
    display: flex; align-items: center; justify-content: center;
    transition: background .16s, border-color .16s;
  }
  .fb-sheet__option--selected .fb-sheet__opt-check {
    background: #6B5F52; border-color: #6B5F52;
  }

  /* Sheet footer */
  .fb-sheet__footer {
    display: flex; gap: 10px; padding: 14px 20px;
    border-top: 1px solid #F0EBE4; flex-shrink: 0;
    padding-bottom: calc(14px + env(safe-area-inset-bottom));
  }
  .fb-sheet__btn-clear {
    flex: 1; padding: 13px; border-radius: 12px;
    border: 1.5px solid #E7E2DC; background: transparent;
    font-size: 14px; font-weight: 500; color: #6B5F52;
    cursor: pointer; font-family: inherit; transition: background .15s;
  }
  .fb-sheet__btn-clear:hover { background: #FAF7F3; }
  .fb-sheet__btn-apply {
    flex: 2; padding: 13px; border-radius: 12px;
    background: #1C1917; color: #FAFAF8;
    font-size: 14px; font-weight: 600; border: none;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(28,25,23,0.22);
    transition: opacity .15s;
  }
  .fb-sheet__btn-apply:active { opacity: .85; }

  /* ── Mobile-only overrides ── */
  @media (max-width: 639px) {
    .fb-bar {
    padding: 10px 0 10px;
    top: 72px;
  }
    .fb-inner { padding: 0 16px; gap: 0; }
    .fb-chips-track { gap: 7px; padding-right: 0; }
    .fb-chip { padding: 8px 13px; font-size: 13px; }

    /* Hide desktop-only clear-all on mobile (handled in sheet) */
    .fb-clear-all-desktop { display: none !important; }

    /* All-filters button tighter on mobile */
    .fb-all-filters { padding: 9px 14px; font-size: 12.5px; }
    .fb-all-filters-label { display: none; }
  }

  /* ── Tablet ── */
  @media (min-width: 640px) and (max-width: 1023px) {
    .fb-bar { padding: 12px clamp(16px, 3vw, 32px); }
    .fb-chip { font-size: 13px; padding: 8px 13px; }
  }
`;

// ─── Desktop FilterChip ───────────────────────────────────────────────────────

type FilterChipProps = {
  config: FilterConfig;
  value: string | null;
  animDelay: number;
  onChange: (value: string) => void;
  onClear: () => void;
  isMobile: boolean;
  onMobileTap: () => void; // opens bottom sheet scoped to this filter
};

const FilterChip = memo(function FilterChip({
  config,
  value,
  animDelay,
  onChange,
  onClear,
  isMobile,
  onMobileTap,
}: FilterChipProps) {
  const { label, icon: Icon, options } = config;

  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  // Position of the dropdown portal (fixed, relative to viewport)
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);

  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { exitTimer.current && clearTimeout(exitTimer.current); }, []);

  // Reposition on scroll/resize so it tracks the button
  useEffect(() => {
    if (!open || isMobile) return;
    const reposition = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 10, left: r.left });
    };
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, isMobile]);

  // Close on outside click — checks both button and portal dropdown
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (dropRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDropdown(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, isMobile]);

  const closeDropdown = useCallback(() => {
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setOpen(false);
      setExiting(false);
      setDropPos(null);
    }, 170);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isMobile) { onMobileTap(); return; }
    if (open) closeDropdown();
    else { setExiting(false); setOpen(true); }
  }, [open, closeDropdown, isMobile, onMobileTap]);

  const pickOption = useCallback((opt: string) => {
    onChange(opt);
    closeDropdown();
  }, [onChange, closeDropdown]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    closeDropdown();
  }, [onClear, closeDropdown]);

  const isActive = value !== null;

  // Desktop dropdown rendered via portal at body level — escapes any overflow clip
  const dropdown =
    !isMobile && open && dropPos
      ? createPortal(
          <div
            ref={dropRef}
            className={`fb-dropdown ${exiting ? "fb-dropdown--exit" : "fb-dropdown--enter"}`}
            role="listbox"
            aria-label={label}
            style={{
              position: "fixed",
              top: dropPos.top,
              left: dropPos.left,
              // Clamp so it never overflows the right edge of the viewport
              maxWidth: `min(215px, calc(100vw - ${dropPos.left}px - 12px))`,
            }}
          >
            <div className="fb-dd-header">
              <span className="fb-dd-header__label">{label}</span>
              {value && <button className="fb-dd-clear" onClick={handleClear}>Clear</button>}
            </div>
            <div className="fb-dd-options">
              {options.map((opt, i) => {
                const selected = value === opt;
                return (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={selected}
                    className={`fb-option${selected ? " fb-option--selected" : ""}`}
                    style={{ animationDelay: `${i * 35}ms` }}
                    onClick={() => pickOption(opt)}
                  >
                    <span className="fb-option__icon" aria-hidden="true">
                      <Icon size={13} strokeWidth={1.7} color={selected ? "#6B5F52" : "#9B8F83"} />
                    </span>
                    <span className="fb-option__label">{opt}</span>
                    <span className="fb-option__tick" aria-hidden="true">
                      {selected && (
                        <svg className="fb-tick-svg" width={10} height={10} viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        className="fb-chip-wrap"
        style={{ animationDelay: `${animDelay}ms` }}
      >
        <button
          ref={btnRef}
          className={`fb-chip${isActive ? " fb-chip--active" : ""}`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={!isMobile && open}
          aria-label={`${label}${value ? `: ${value}` : ""}`}
        >
          {isActive && <span className="fb-chip__dot" aria-hidden="true" />}
          <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
          <span>{value ?? label}</span>
          <svg
            className={`fb-chip__caret${!isMobile && open ? " fb-chip__caret--open" : ""}`}
            width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden="true"
          >
            <path d="M2.5 4.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {dropdown}
    </>
  );
});

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────

type BottomSheetProps = {
  open: boolean;
  activeFilter: FilterKey | "all" | null;
  filters: FilterValues;
  configs: FilterConfig[];
  onClose: () => void;
  onSelect: (key: FilterKey, value: string) => void;
  onClear: (key?: FilterKey) => void;
};

function BottomSheet({ open, activeFilter, filters, configs, onClose, onSelect, onClear }: BottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const sections = activeFilter === "all"
    ? configs
    : configs.filter((c) => c.key === activeFilter);

  const title = activeFilter === "all"
    ? "Filters"
    : configs.find((c) => c.key === activeFilter)?.label ?? "Filter";

  const hasAny = Object.values(filters).some(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fb-backdrop${open ? " fb-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`fb-sheet${open ? " fb-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="fb-sheet__handle" aria-hidden="true" />

        {/* Header */}
        <div className="fb-sheet__header">
          <span className="fb-sheet__title">
            {title}
            {hasAny && activeFilter === "all" && (
              <span style={{
                background: "#6B5F52", color: "#fff",
                borderRadius: 99, fontSize: 11, fontWeight: 700,
                padding: "2px 7px",
              }}>
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </span>
          <button className="fb-sheet__close" onClick={onClose} aria-label="Close">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="fb-sheet__body">
          {sections.map((config) => {
            const { key, label, icon: Icon, options } = config;
            return (
              <div key={key} className="fb-sheet__section">
                {activeFilter === "all" && (
                  <div className="fb-sheet__section-label">{label}</div>
                )}
                {options.map((opt) => {
                  const selected = filters[key] === opt;
                  return (
                    <div
                      key={opt}
                      className={`fb-sheet__option${selected ? " fb-sheet__option--selected" : ""}`}
                      onClick={() => onSelect(key, opt)}
                      role="option"
                      aria-selected={selected}
                    >
                      <span className="fb-sheet__opt-icon" aria-hidden="true">
                        <Icon size={16} strokeWidth={1.7} color={selected ? "#6B5F52" : "#9B8F83"} />
                      </span>
                      <span className="fb-sheet__opt-label">{opt}</span>
                      <span className="fb-sheet__opt-check" aria-hidden="true">
                        {selected && <Check size={12} strokeWidth={2.5} color="#fff" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="fb-sheet__footer">
          <button
            className="fb-sheet__btn-clear"
            onClick={() => {
              if (activeFilter === "all") onClear();
              else if (activeFilter) onClear(activeFilter);
            }}
          >
            Clear {activeFilter !== "all" ? "filter" : "all"}
          </button>
          <button className="fb-sheet__btn-apply" onClick={onClose}>
            Show results
          </button>
        </div>
      </div>
    </>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

type FilterBarProps = {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  onOpenAllFilters?: () => void;
};

export default function FilterBar({ filters, setFilters, onOpenAllFilters }: FilterBarProps) {
  const { items: locations, loading: locationsLoading } = usePropertyTaxonomy(PROPERTY_LOCATION_COLLECTION);
  const { items: categories, loading: categoriesLoading } = usePropertyTaxonomy(PROPERTY_CATEGORY_COLLECTION);

  const [isMobile, setIsMobile] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey | "all" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const hasAny = Object.values(filters).some(Boolean);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const filterConfigs = buildFilterConfigs(
    locations.map((item) => item.name),
    categories.map((item) => item.name),
    filters
  );

  const handleChange = useCallback(
    (key: FilterKey) => (val: string) =>
      setFilters((prev) => ({ ...prev, [key]: val })),
    [setFilters],
  );

  const handleClear = useCallback(
    (key: FilterKey) => setFilters((prev) => ({ ...prev, [key]: null })),
    [setFilters],
  );

  const handleReset = useCallback(
    () =>
      setFilters({
        type: null,
        location: null,
        date: null,
        budget: null,
        availability: null,
        sort: null,
      }),
    [setFilters],
  );

  const openSheetFor = useCallback((key: FilterKey | "all") => {
    setActiveFilter(key);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleSheetSelect = useCallback((key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Auto-close single-filter sheets after selection
    if (activeFilter !== "all") setTimeout(closeSheet, 180);
  }, [activeFilter, closeSheet, setFilters]);

  const handleSheetClear = useCallback((key?: FilterKey) => {
    if (key) setFilters((prev) => ({ ...prev, [key]: null }));
    else handleReset();
  }, [handleReset, setFilters]);

  return (
    <>
      <style>{STYLES}</style>
      <nav className="fb-bar" aria-label="Property filters">
        <div className="fb-inner">

          {(locationsLoading || categoriesLoading) && (
            <span className="sr-only">Loading filter options</span>
          )}

          {/* ── Scrollable chips ── */}
          <div className="fb-chips-track">
            {filterConfigs.map((config, i) => (
              <FilterChip
                key={config.key}
                config={config}
                value={filters[config.key]}
                animDelay={i * 65}
                onChange={handleChange(config.key)}
                onClear={() => handleClear(config.key)}
                isMobile={isMobile}
                onMobileTap={() => openSheetFor(config.key)}
              />
            ))}

            {/* Clear all — desktop only, inline with chips */}
            {hasAny && (
              <button
                className="fb-clear-all fb-clear-all-desktop fb-chip-wrap"
                onClick={handleReset}
                aria-label="Clear all filters"
                style={{ flexShrink: 0 }}
              >
                <X size={12} strokeWidth={2} aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>

          {/* ── All Filters button — always visible ── */}
          <div className="fb-right-fade">
            <button
              className="fb-all-filters"
              onClick={isMobile ? () => openSheetFor("all") : onOpenAllFilters}
              aria-label={`All filters${activeCount > 0 ? ` — ${activeCount} active` : ""}`}
            >
              <SlidersHorizontal size={13} strokeWidth={2} aria-hidden="true" />
              <span className="fb-all-filters-label">All Filters</span>
              {activeCount > 0 && (
                <span style={{
                  background: "rgba(255,255,255,0.18)", borderRadius: 6,
                  padding: "1px 6px", fontSize: 11, fontWeight: 700,
                  minWidth: 18, textAlign: "center",
                }}>
                  {activeCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile bottom sheet ── */}
      {isMobile && (
        <BottomSheet
          open={sheetOpen}
          activeFilter={activeFilter}
          filters={filters}
          configs={filterConfigs}
          onClose={closeSheet}
          onSelect={handleSheetSelect}
          onClear={handleSheetClear}
        />
      )}
    </>
  );
}