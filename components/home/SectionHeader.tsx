// ─── Add to your global CSS or layout font import ────────────────────────────
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&display=swap');
//
// Or in next/font (recommended for Next.js):
//
// import { Cormorant_Garamond } from "next/font/google";
// export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400","600","700"], style: ["normal","italic"] });
// Then pass cormorant.className to the heading below.

interface SectionHeaderProps {
  /** Micro-label above the heading, e.g. "Curated Collection" */
  eyebrow?: string;
  /** Main heading. Wrap a word in <em> for the italic accent treatment. */
  title: string;
  /** Optional supporting sentence */
  subtitle?: string;
  /** Total count shown near the CTA, e.g. 142 */
  totalCount?: number;
  /** How many cards are currently showing, e.g. 12 */
  visibleCount?: number;
  /** Stats shown as "4.9 avg rating · 142 properties" */
  stats?: Array<{ icon?: React.ReactNode; label: string }>;
  /** Href for "View all" link */
  viewAllHref?: string;
  /** Label on the view-all button */
  viewAllLabel?: string;
}

export function SectionHeader({
  eyebrow = "Curated Collection",
  title,
  subtitle,
  totalCount,
  visibleCount,
  stats,
  viewAllHref,
  viewAllLabel = "View all stays",
}: SectionHeaderProps) {
  return (
    <>
      <style>{`
        @keyframes sh-up {
          from { opacity: 0; transform: translateY(14px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .sh-heading em {
          font-style: italic;
          font-weight: 400;
          color: #C07850;
        }
        .sh-view-all {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 20px;
          border: 1.5px solid rgba(199,102,68,0.35);
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          color: #C76644;
          background: transparent;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease, color .2s ease, gap .2s cubic-bezier(.34,1.56,.64,1);
          text-decoration: none;
          white-space: nowrap;
          font-family: inherit;
        }
        .sh-view-all:hover {
          background: #C76644;
          border-color: #C76644;
          color: #fff;
          gap: 11px;
        }
        .sh-view-all:hover .sh-arrow path {
          stroke: #fff;
        }
        .sh-arrow {
          flex-shrink: 0;
          transition: transform .2s cubic-bezier(.34,1.56,.64,1);
        }
        .sh-view-all:hover .sh-arrow {
          transform: translateX(2px);
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
         
        }}
      >
        {/* ── Left: eyebrow + heading + meta ── */}
        <div style={{ minWidth: 0, flex: 1 }}>

         

          {/* Main heading — Cormorant Garamond serif */}
          <h2
            className="sh-heading"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 600,
              color: "#1A1410",
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: 0,
              maxWidth: 640,
              animation: "sh-up .55s .08s ease both",
              animationFillMode: "both",
            }}
            // Allows callers to pass <em> wrapped words for italic accent
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Subtitle */}
          {subtitle && (
            <>
  <p
    style={{
      marginTop: 14,
      fontSize: 15,
      color: "#7A6E65",
      fontWeight: 400,
      lineHeight: 1.65,
      maxWidth: 500,
    }}
  >
    {subtitle}
  </p>

  <div
    style={{
      width: 42,
      height: 2,
      borderRadius: 999,
      background: "#C76644",
      marginTop: 18,
      opacity: 0.6,
    }}
  />
</>
          )}

          {/* Stats row */}
          {stats && stats.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 20,
                animation: "sh-up .55s .24s ease both",
                animationFillMode: "both",
              }}
            >
              {stats.map((stat, i) => (
                <>
                  {i > 0 && (
                    <span
                      key={`dot-${i}`}
                      style={{
                        display: "block",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#D4C9BE",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    key={stat.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "#9B8F83",
                      fontWeight: 500,
                    }}
                  >
                    {stat.icon}
                    {stat.label}
                  </span>
                </>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: count + CTA ── */}
        {viewAllHref && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 6,
              flexShrink: 0,
              animation: "sh-up .55s .18s ease both",
              animationFillMode: "both",
            }}
          >
            {/* Showing X of Y */}
            {visibleCount != null && totalCount != null && (
              <span
                style={{
                  fontSize: 12,
                  color: "#B0A498",
                  fontWeight: 400,
                }}
              >
                Showing {visibleCount} of {totalCount}
              </span>
            )}

            <a href={viewAllHref} className="sh-view-all">
              {viewAllLabel}
              <svg
                className="sh-arrow"
                width={13}
                height={13}
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M2.5 6.5h8M7 3.5l3 3-3 3"
                  stroke="#C76644"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </>
  );
}