"use client";

import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "@/components/havenIcons";

type SearchOrigin = {
  top: number;
  left: number;
  width: number;
};

type HavenStickySearchProps = {
  visible: boolean;
  focusIndex: number | null;
  setFocusIndex: (value: number | null) => void;
  origin: SearchOrigin | null;
};

const compactFields = [
  { icon: <MapPinIcon />, label: "Where", placeholder: "Search destinations...", flex: "1.6" },
  { icon: <CalendarIcon />, label: "Check in", placeholder: "Add dates", flex: "1" },
  { icon: <CalendarIcon />, label: "Check out", placeholder: "Add dates", flex: "1" },
  { icon: <UsersIcon />, label: "Guests", placeholder: "Add guests", flex: "1" },
];

export default function HavenStickySearch({ visible, focusIndex, setFocusIndex, origin }: HavenStickySearchProps) {
  const topValue = visible ? "78px" : `${origin?.top ?? 160}px`;
  const leftValue = visible ? "50%" : `${origin?.left ?? 0}px`;
  const widthValue = visible ? "min(760px, calc(100vw - 2rem))" : `${origin?.width ?? 760}px`;
  const transformValue = visible ? "translateX(-50%) scale(1)" : "translateX(0) scale(0.98)";

  return (
    <div
      className="fixed z-[95]"
      style={{
        top: topValue,
        left: leftValue,
        width: widthValue,
        transform: transformValue,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "top .5s cubic-bezier(.16,1,.3,1), left .5s cubic-bezier(.16,1,.3,1), width .5s cubic-bezier(.16,1,.3,1), opacity .26s ease, transform .5s cubic-bezier(.16,1,.3,1)",
      }}
      aria-hidden={!visible}
    >
      <div
        className="overflow-hidden rounded-[50px] border border-[#EDE8E2] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-stretch gap-0.5 p-[5px]">
          {compactFields.map((field, index) => (
            <div
              key={field.label}
              className="min-w-0 rounded-[40px] px-3 py-2 transition-colors"
              style={{
                flex: field.flex,
                background: focusIndex === index ? "#FDF5F1" : "transparent",
                borderRight: index < 3 ? "1px solid #EDE8E2" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="shrink-0" style={{ color: focusIndex === index ? "#E07B54" : "#C4BAB4" }}>
                  {field.icon}
                </span>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#1C1917]">{field.label}</div>
                  <input
                    placeholder={field.placeholder}
                    className="w-full truncate bg-transparent text-xs text-[#78716C] outline-none"
                    onFocus={() => setFocusIndex(index)}
                    onBlur={() => setFocusIndex(null)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button className="btn-primary ml-1 shrink-0 rounded-full bg-[#E07B54] p-3 text-white transition-colors hover:bg-[#C96840]" aria-label="Search">
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
}