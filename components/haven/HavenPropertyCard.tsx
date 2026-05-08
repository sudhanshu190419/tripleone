"use client";

import { useRef, useState, useCallback, memo, useEffect } from "react";
import { MapPinIcon, StarIcon } from "@/components/havenIcons";
import { type HomeProperty } from "@/components/homeData";
import { useInView } from "@/components/havenHooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type HavenPropertyCardProps = {
  property: HomeProperty;
  index: number;
};

// ─── Shadows ──────────────────────────────────────────────────────────────────

const SHADOW_REST =
  "0 10px 24px rgba(28,20,12,0.08)";

const SHADOW_HOVER =
  "0 16px 36px rgba(28,20,12,0.12)";

// ─── ImagePanel ───────────────────────────────────────────────────────────────

const ImagePanel = memo(function ImagePanel({
  image,
  tag,
  title,
  location,
  hovered,
  onShare,
}: {
  image: string;
  tag?: string;
  title: string;
  location: string;
  hovered: boolean;
  onShare: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "78%", // 3:2-ish ratio — immersive but not too tall
        overflow: "hidden",
        borderRadius: "18px",
        flexShrink: 0,
      }}
    >
      <Image
        src={image && image.trim() !== "" ? image : "/property-placeholder.jpg"}
        alt={`${title} – luxury stay in ${location}`}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        style={{
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: hovered ? "scale(1.07)" : "scale(1)",
        }}
      />

      {/* Ambient bottom gradient — depth + readability */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(14,10,6,0.55) 0%, rgba(14,10,6,0.18) 38%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Tag */}
      {tag && (
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(8px)",
            color: "#3a3020",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {tag}
        </span>
      )}

      <button
        onClick={onShare}
        aria-label={`Share ${title}`}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.96)",
          border: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background-color .2s ease",
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.96)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ color: "#4B5563" }}
        >
          <path d="M12 16V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      </button>

      {/* Rating badge — lives on image for premium feel */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: 99,
          padding: "4px 10px",
        }}
      >
        <StarIcon style={{ width: 12, height: 12, color: "#E07B54" }} />
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "#1C1917",
            letterSpacing: "-0.01em",
          }}
        >
          {/* rating is passed from parent below */}
        </span>
      </div>
    </div>
  );
});

// ─── RatingBadge (on image) — standalone so it can receive the value ─────────

const RatingBadge = memo(function RatingBadge({ rating }: { rating: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 99,
        padding: "4px 10px",
        zIndex: 1,
      }}
    >
      <StarIcon style={{ width: 12, height: 12, color: "#E07B54" }} />
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: "#1C1917",
          letterSpacing: "-0.01em",
        }}
      >
        {rating}
      </span>
    </div>
  );
});

// ─── ImagePanelFull — combines image + overlays + rating ─────────────────────

const ImagePanelFull = memo(function ImagePanelFull({
  image,
  tag,
  title,
  location,
  rating,
  hovered,
  compact,
  onShare,
}: {
  image: string;
  tag?: string;
  title: string;
  location: string;
  rating: number;
  hovered: boolean;
  compact: boolean;
  onShare: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: compact ? "68%" : "88%",
        overflow: "hidden",
        borderRadius: compact ? "14px" : "18px",
        flexShrink: 0,
      }}
    >
      <Image
        src={image && image.trim() !== "" ? image : "/property-placeholder.jpg"}
        alt={`${title} – luxury stay in ${location}`}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        style={{
          objectFit: "cover",
          transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: hovered ? "scale(1.07)" : "scale(1)",
        }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(14,10,6,0.58) 0%, rgba(14,10,6,0.16) 40%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Tag */}
      {tag && (
        <span
          style={{
            position: "absolute",
            top: compact ? 8 : 12,
            left: compact ? 8 : 12,
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(8px)",
            color: "#3a3020",
            fontSize: compact ? 9.5 : 10.5,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: compact ? "3px 8px" : "4px 10px",
            borderRadius: 99,
          }}
        >
          {tag}
        </span>
      )}

      <button
        onClick={onShare}
        aria-label={`Share ${title}`}
        style={{
          position: "absolute",
          top: compact ? 8 : 12,
          right: compact ? 8 : 12,
          width: compact ? 36 : 40,
          height: compact ? 36 : 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.96)",
          border: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background-color .2s ease",
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.96)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ color: "#4B5563" }}
        >
          <path d="M12 16V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      </button>

      {/* Rating — bottom right on image */}
      <RatingBadge rating={rating} />
    </div>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

function HavenPropertyCard({ property, index }: HavenPropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      const shareUrl = `${window.location.origin}/property/${property.id}`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: property.title,
            text: `${property.title} in ${property.location}`,
            url: shareUrl,
          });
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
      } catch {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch {
          window.prompt("Copy this stay link", shareUrl);
        }
      }
    },
    [property.id, property.location, property.title]
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  // Staggered entrance via inView
  // If it's one of the first 3-4 cards, don't delay it or hide it as aggressively
const delay = index < 4 ? "0s" : `${index * 0.065}s`;
const initialOpacity = index < 4 ? 1 : (inView ? 1 : 0);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(15px)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
        minHeight: isMobile ? "240px" : "420px",
        // REMOVED contentVisibility and containIntrinsicSize
      }}
    >
      <article
        onClick={() => router.push(`/property/${property.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`View ${property.title}`}
        style={{
          // ── Surface ──
          background: "#FFFCF8",
          borderRadius: isMobile ? 20 : 24,
          border: "1px solid rgba(222, 212, 198, 0.75)",
          padding: isMobile ? 8 : 10,
          overflow: "visible",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",

          // ── Elevation ──
          boxShadow: hovered ? SHADOW_HOVER : SHADOW_REST,
          transform: hovered ? "translateY(-5px) scale(1.006)" : "translateY(0) scale(1)",
          transition:
            "box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform, box-shadow",
        }}
      >
        {/* ── Image ── */}
        <ImagePanelFull
          image={property.images?.[0] || "/fallback-property.jpg"}
          tag={property.tag}
          title={property.title}
          location={property.location}
          rating={property.rating}
          hovered={hovered}
          compact={isMobile}
          onShare={handleShare}
        />

        {/* ── Body ── */}
        <div
          style={{
            padding: isMobile ? "8px 6px 6px" : "14px 10px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            flex: 1,
          }}
        >
          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontSize: isMobile ? 13.5 : 15.5,
              fontWeight: 600,
              color: "#1A1410",
              letterSpacing: "-0.025em",
              lineHeight: isMobile ? 1.2 : 1.3,
              display: "-webkit-box",
              WebkitLineClamp: isMobile ? 1 : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property.title}
          </h3>

          {property.category && (
            <div
              style={{
                marginTop: isMobile ? 6 : 8,
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid rgba(224,123,84,0.18)",
                background: "rgba(224,123,84,0.08)",
                color: "#B85A30",
                padding: isMobile ? "4px 8px" : "5px 10px",
                fontSize: isMobile ? 10 : 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {property.category}
            </div>
          )}

          {/* Location */}
          <div
            style={{
              marginTop: isMobile ? 6 : 8,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MapPinIcon
              style={{ width: 12, height: 12, color: "#C07850", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: isMobile ? 11.5 : 12.5,
                color: "#7A6E65",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {property.location}
            </span>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              marginTop: isMobile ? 8 : 14,
              borderTop: "1px solid rgba(200,188,174,0.4)",
              paddingTop: isMobile ? 8 : 14,
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 3,
                justifyContent: "flex-start",
                width: "auto",
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? 14.5 : 18,
                  fontWeight: 700,
                  color: "#1A1410",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                ₹{property.price.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 10.5 : 11.5,
                  color: "#A89E94",
                  fontWeight: 900,
                }}
              >
                / night
              </span>
            </div>

            {/* CTA */}
            <Link
              href={`/property/${property.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: isMobile ? "6px 12px" : "8px 14px",
                background: hovered ? "#C76644" : "#E07B54",
                color: "#fff",
                fontSize: isMobile ? 11.25 : 12.5,
                fontWeight: 600,
                letterSpacing: "0.01em",
                borderRadius: 10,
                textDecoration: "none",
                transition: "background .2s ease, gap .2s cubic-bezier(.34,1.56,.64,1)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                width: "auto",
                justifyContent: "center",
                marginTop: 0,
              }}
            >
              View stay
              <svg
                width={12}
                height={12}
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
                  transform: hovered ? "translateX(2px)" : "translateX(0)",
                  flexShrink: 0,
                }}
              >
                <path
                  d="M2.5 6h7M6.5 3l3 3-3 3"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export default memo(HavenPropertyCard);