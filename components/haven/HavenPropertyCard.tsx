"use client";

import { useRef, useState, useCallback, memo, useEffect } from "react";
import { HeartIcon, MapPinIcon, StarIcon } from "@/components/havenIcons";
import { type HomeProperty } from "@/components/homeData";
import { useInView } from "@/components/havenHooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type HavenPropertyCardProps = {
  property: HomeProperty;
  index: number;
};

// ─── Shadows ──────────────────────────────────────────────────────────────────

const SHADOW_REST =
  "0 1px 2px rgba(28,20,12,0.04), 0 4px 12px rgba(28,20,12,0.06), 0 12px 32px rgba(28,20,12,0.05)";

const SHADOW_HOVER =
  "0 2px 4px rgba(28,20,12,0.06), 0 12px 32px rgba(28,20,12,0.14), 0 32px 64px rgba(28,20,12,0.10)";

// ─── ImagePanel ───────────────────────────────────────────────────────────────

const ImagePanel = memo(function ImagePanel({
  image,
  tag,
  liked,
  title,
  location,
  hovered,
  onToggleLike,
}: {
  image: string;
  tag?: string;
  liked: boolean;
  title: string;
  location: string;
  hovered: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
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

      {/* Like button */}
      <button
        onClick={onToggleLike}
        aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: liked ? "rgba(224,123,84,0.92)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background .2s, transform .2s cubic-bezier(.34,1.56,.64,1)",
          transform: liked ? "scale(1.12)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!liked)
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.98)";
        }}
        onMouseLeave={(e) => {
          if (!liked)
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.88)";
        }}
      >
        <HeartIcon
          style={{
            color: liked ? "#fff" : "#9b8f83",
            fill: liked ? "#fff" : "none",
            width: 15,
            height: 15,
            transition: "color .2s, fill .2s",
          }}
        />
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
  liked,
  title,
  location,
  rating,
  hovered,
  compact,
  onToggleLike,
}: {
  image: string;
  tag?: string;
  liked: boolean;
  title: string;
  location: string;
  rating: number;
  hovered: boolean;
  compact: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: compact ? "84%" : "88%",
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

      {/* Like */}
      <button
        onClick={onToggleLike}
        aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
        style={{
          position: "absolute",
          top: compact ? 8 : 12,
          right: compact ? 8 : 12,
          width: compact ? 30 : 34,
          height: compact ? 30 : 34,
          borderRadius: "50%",
          background: liked ? "rgba(224,123,84,0.95)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(8px)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition:
            "background .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1)",
          transform: liked ? "scale(1.15)" : "scale(1)",
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          if (!liked)
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,1)";
        }}
        onMouseLeave={(e) => {
          if (!liked)
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.88)";
        }}
      >
        <HeartIcon
          style={{
            color: liked ? "#fff" : "#9b8f83",
            fill: liked ? "#fff" : "none",
            width: 15,
            height: 15,
            flexShrink: 0,
            transition: "color .2s, fill .2s",
          }}
        />
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
  const [liked, setLiked] = useState(false);
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

  const toggleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  // Staggered entrance via inView
  const delay = `${index * 0.065}s`;

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
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
borderRadius: 24,
border: "1px solid rgba(222, 212, 198, 0.75)",
padding: 10,
overflow: "visible",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",

          // ── Elevation ──
          boxShadow: hovered ? SHADOW_HOVER : SHADOW_REST,
          transform: hovered ? "translateY(-7px) scale(1.008)" : "translateY(0) scale(1)",
          transition:
            "box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform, box-shadow",
        }}
      >
        {/* ── Image ── */}
        <ImagePanelFull
          image={property.images?.[0] || "/fallback-property.jpg"}
          tag={property.tag}
          liked={liked}
          title={property.title}
          location={property.location}
          rating={property.rating}
          hovered={hovered}
          compact={isMobile}
          onToggleLike={toggleLike}
        />

        {/* ── Body ── */}
        <div
          style={{
            padding: isMobile ? "10px 8px 8px" : "14px 10px 10px",
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

          {/* Nights label */}
          {property.nights && (
            <p
              style={{
                margin: isMobile ? "4px 0 0" : "5px 0 0",
                fontSize: isMobile ? 10.5 : 11.5,
                color: "#B0A89E",
                fontWeight: 400,
                display: isMobile ? "none" : "block",
              }}
            >
              {property.nights}
            </p>
          )}

          {/* ── Divider ── */}
          <div
            style={{
              marginTop: isMobile ? 10 : 14,
              borderTop: "1px solid rgba(200,188,174,0.4)",
              paddingTop: isMobile ? 10 : 14,
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 3,
                justifyContent: isMobile ? "space-between" : "flex-start",
                width: isMobile ? "100%" : "auto",
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
                padding: isMobile ? "7px 10px" : "8px 14px",
                background: hovered
                  ? "#C76644"
                  : "#E07B54",
                color: "#fff",
                fontSize: isMobile ? 11.25 : 12.5,
                fontWeight: 600,
                letterSpacing: "0.01em",
                borderRadius: 10,
                textDecoration: "none",
                transition: "background .2s ease, gap .2s cubic-bezier(.34,1.56,.64,1)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                width: isMobile ? "100%" : "auto",
                justifyContent: "center",
                marginTop: isMobile ? 8 : 0,
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