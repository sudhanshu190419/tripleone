"use client";
import { useState, useRef, useEffect } from "react";
import { Home, MapPin, Wallet, CalendarDays, ArrowUpDown } from "lucide-react";

type FilterOption = { label: string; options: string[] };
type FilterValues = {
  type: string | null;
  location: string | null;
  budget: string | null;
  sort: string | null;
};

const FILTERS: Record<string, FilterOption> = {
  type: {
    label: "Property type",
    options: ["Studio apartment", "Villa", "Home", "Penthouse", "Farmhouse"],
  },
  location: {
    label: "Location",
    options: ["Delhi", "Mumbai", "Goa", "Jaipur"],
  },
  budget: {
    label: "Budget",
    options: ["Under ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"],
  },
  sort: {
    label: "Sort",
    options: ["Recommended", "Price: low to high", "Price: high to low", "Top rated"],
  },
};

const FILTER_ICONS = {
  type: Home,
  location: MapPin,
  budget: Wallet,
  availability: CalendarDays,
  sort: ArrowUpDown,
};

type FilterChipProps = {
  id: string;
  label: string;
  options: string[];
  value: string | null;
  icon: React.ElementType;
  onChange: (value: string) => void;
  onClear: () => void;
};

function FilterChip({ icon: Icon, id, label, options, value, onChange, onClear }: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 200);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => () => { if (closeTimeout.current) clearTimeout(closeTimeout.current); }, []);

  const toggle = () => (open ? close() : setOpen(true));
  const pick = (opt: string) => { onChange(opt); close(); };

  return (
    <div
      ref={ref}
      style={{ position: "relative", zIndex: open ? 9999 : 1 }}
      onMouseEnter={() => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimeout.current = setTimeout(() => close(), 50);
      }}
    >
      {/* ── Trigger button ── */}
      <button
        onClick={toggle}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px",
          border: `1.5px solid ${value ? "#7c6f62" : "#E7E2DC"}`,
          borderRadius: 12,
          background: value ? "#f0ebe4" : "#fff",
          fontSize: 13.5, fontWeight: 500, color: "#3a3530",
          cursor: "pointer", whiteSpace: "nowrap",
          transition: "all .2s", outline: "none",
          boxShadow: open ? "0 2px 10px rgba(0,0,0,.07)" : "none",
        }}
      >
        {value && (
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#7c6f62", flexShrink: 0,
            animation: "dotPop .25s cubic-bezier(.34,1.56,.64,1)",
          }} />
        )}
        <Icon size={15} strokeWidth={1.8} color={value ? "#6b5f52" : "#9b8f83"} />
        <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>
          {value ?? label}
        </span>
        <svg
          width={13} height={13} viewBox="0 0 13 13" fill="none"
          style={{
            transition: "transform .28s cubic-bezier(.34,1.56,.64,1)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <path d="M3 5l3.5 3.5L10 5" stroke="#9b8f83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            zIndex: 99999,
            minWidth: 210,
            background: "#fff",
            border: "1px solid #e8e2da",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(60,40,20,.13), 0 2px 8px rgba(60,40,20,.06)",
            overflow: "hidden",
            transformOrigin: "top left",
            animation: closing
              ? "ddOut .18s ease-in forwards"
              : "ddIn .24s cubic-bezier(.34,1.4,.64,1) forwards",
          }}
        >
          {/* Dropdown header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px 10px",
            borderBottom: "1px solid #f0ebe4",
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: ".06em",
              textTransform: "uppercase", color: "#a89e94",
            }}>
              {label}
            </span>
            {value && (
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); close(); }}
                style={{
                  fontSize: 11.5, color: "#a89e94", cursor: "pointer",
                  padding: "2px 8px", borderRadius: 6,
                  border: "none", background: "none", fontFamily: "inherit",
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#f5f0ea";
                  (e.currentTarget as HTMLElement).style.color = "#6b5f52";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "none";
                  (e.currentTarget as HTMLElement).style.color = "#a89e94";
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Option rows */}
          <div style={{ padding: 6 }}>
            {options.map((opt, i) => (
              <div
                key={opt}
                onClick={() => pick(opt)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px",
                  borderRadius: 10,
                  background: value === opt ? "#f5f0ea" : "transparent",
                  cursor: "pointer",
                  marginBottom: i < options.length - 1 ? 2 : 0,
                  transition: "background .13s",
                  animation: `optIn .22s cubic-bezier(.34,1.4,.64,1) ${i * 0.04}s both`,
                }}
                onMouseEnter={(e) => {
                  if (value !== opt)
                    (e.currentTarget as HTMLElement).style.background = "#faf7f3";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    value === opt ? "#f5f0ea" : "transparent";
                }}
              >
                {/* Option icon pill */}
                <span style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: value === opt ? "#e8dfd4" : "#f0ebe4",
                  transition: "background .15s",
                }}>
                  <Icon size={14} strokeWidth={1.7} color={value === opt ? "#6b5f52" : "#9b8f83"} />
                </span>

                {/* Label */}
                <span style={{
                  flex: 1, fontSize: 13.5,
                  fontWeight: value === opt ? 500 : 400,
                  color: value === opt ? "#2e2520" : "#3a3530",
                  transition: "all .1s",
                }}>
                  {opt}
                </span>

                {/* Tick circle */}
                <span style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  border: `1.5px solid ${value === opt ? "#6b5f52" : "#d5cfc7"}`,
                  background: value === opt ? "#6b5f52" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .18s",
                }}>
                  {value === opt && (
                    <svg
                      width={10} height={10} viewBox="0 0 10 10" fill="none"
                      style={{ animation: "tickPop .18s cubic-bezier(.34,1.56,.64,1)" }}
                    >
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Props = {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
};

export default function FilterBar({ filters, setFilters }: Props) {
  const hasAny = Object.values(filters).some(Boolean);

  const set = (key: string) => (val: string) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const clear = (key: string) =>
    setFilters((prev) => ({ ...prev, [key]: null }));

  const reset = () =>
    setFilters({ type: null, location: null, budget: null, sort: null });

  return (
    <>
      <style>{`
        @keyframes ddIn {
          from { opacity:0; transform:scale(.91) translateY(-10px) }
          to   { opacity:1; transform:scale(1)   translateY(0)     }
        }
        @keyframes ddOut {
          from { opacity:1; transform:scale(1)   translateY(0)    }
          to   { opacity:0; transform:scale(.93) translateY(-7px) }
        }
        @keyframes optIn {
          from { opacity:0; transform:translateX(-6px) }
          to   { opacity:1; transform:translateX(0)    }
        }
        @keyframes dotPop  { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes tickPop { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes chipIn  {
          from { opacity:0; transform:translateY(10px) scale(.94) }
          to   { opacity:1; transform:translateY(0)    scale(1)   }
        }
      `}</style>

      <div style={{
        position: "sticky", top: 80, zIndex: 90,
        borderBottom: "1px solid #EDE8E2",
        background: "white",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          margin: "0 auto", maxWidth: 1280,
          display: "flex", gap: 10, flexWrap: "wrap",
          padding: "14px clamp(20px,5vw,56px)",
        }}>
          {Object.entries(FILTERS).map(([key, { label, options }], i) => (
            <div
              key={key}
              style={{ animation: `chipIn .35s cubic-bezier(.34,1.4,.64,1) ${i * 0.07}s both` }}
            >
              <FilterChip
                id={key}
                label={label}
                options={options}
                icon={FILTER_ICONS[key as keyof typeof FILTER_ICONS]}
                value={filters[key as keyof FilterValues]}
                onChange={set(key)}
                onClear={() => clear(key)}
              />
            </div>
          ))}

          {hasAny && (
            <button
              onClick={reset}
              style={{
                marginLeft: "auto", padding: "10px 16px",
                border: "1.5px solid #E7E2DC", borderRadius: 12,
                background: "transparent", fontSize: 13, color: "#8c8480",
                cursor: "pointer", transition: "all .2s",
                animation: "chipIn .3s ease both",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#c5bfb8";
                (e.currentTarget as HTMLElement).style.color = "#4a4540";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E7E2DC";
                (e.currentTarget as HTMLElement).style.color = "#8c8480";
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </>
  );
}