"use client";

import { useRef, useState, useCallback, memo, useEffect } from "react";
import { Star, Heart, ArrowUpRight } from "lucide-react";
import { type HomeProperty } from "@/components/homeData";
import { useInView } from "@/components/havenHooks";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type HavenPropertyCardProps = {
  property: HomeProperty;
  index: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// ─── Main Component ───────────────────────────────────────────────────────────

function HavenPropertyCard({
  property,
  index,
}: HavenPropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref);

  const [hovered, setHovered] = useState(false);

  const [liked, setLiked] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const update = () => setIsMobile(mediaQuery.matches);

    update();

    mediaQuery.addEventListener("change", update);

    return () =>
      mediaQuery.removeEventListener("change", update);
  }, []);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      const shareUrl = `${window.location.origin}/property/${property.id}`;

      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        window.prompt("Copy this stay link", shareUrl);
      }
    },
    [property.id]
  );

  const delay = index < 4 ? "0s" : `${index * 0.065}s`;

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0)"
          : "translateY(15px)",

        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,

        minHeight: isMobile ? "390px" : "470px",
      }}
    >
      <div
        onClick={() =>
          router.push(`/property/${property.id}`)
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",

          background: "#FFFCF8",

          boxShadow: hovered
            ? "0 24px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.2)"
            : "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",

          transform: hovered
            ? "translateY(-6px) scale(1.015)"
            : "translateY(0) scale(1)",

          transition:
            "all 0.35s cubic-bezier(0.34,1.2,0.64,1)",

          flexShrink: 0,
        }}
      >
        {/* ── Image ── */}

        <div
          style={{
            position: "relative",
            height: isMobile ? 240 : 300,
            overflow: "hidden",
          }}
        >
          <Image
            src={
              property.images?.[0] ||
              "/property-placeholder.jpg"
            }
            alt={property.title}
            fill
            sizes="(max-width:768px) 100vw, 320px"
            style={{
              objectFit: "cover",

              transform: hovered
                ? "scale(1.06)"
                : "scale(1)",

              transition:
                "transform 0.55s cubic-bezier(0.34,1.2,0.64,1)",

              display: "block",
            }}
          />

          {/* Gradient Overlay */}

          <div
            style={{
              position: "absolute",
              inset: 0,

              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.72) 100%)",
            }}
          />

          

          {/* Wishlist */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              setLiked((v) => !v);
            }}
            aria-label="Wishlist"
            style={{
              position: "absolute",

              top: 14,
              right: 14,

              width: 34,
              height: 34,

              borderRadius: "50%",

              border: "none",

              background: liked
                ? "rgba(220,60,60,0.9)"
                : "rgba(20,18,16,0.62)",

              backdropFilter: "blur(10px)",

              WebkitBackdropFilter: "blur(10px)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              cursor: "pointer",

              transition: "all 0.25s ease",

              transform: liked
                ? "scale(1.15)"
                : "scale(1)",
            }}
          >
            <Heart
              size={14}
              strokeWidth={2}
              color="#fff"
              fill={liked ? "#fff" : "none"}
            />
          </button>

          {/* Tags */}

          <div
            style={{
              position: "absolute",

              bottom: 14,
              left: 14,

              display: "flex",

              gap: 6,

              flexWrap: "wrap",
            }}
          >
            {(property.amenities || [])
              .slice(0, 2)
              .map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    background:
                      "rgba(255,255,255,0.14)",

                    backdropFilter: "blur(8px)",

                    WebkitBackdropFilter:
                      "blur(8px)",

                    border:
                      "1px solid rgba(255,255,255,0.2)",

                    borderRadius: 99,

                    padding: "3px 9px",

                    fontSize: 10,

                    fontWeight: 500,

                    color:
                      "rgba(255,255,255,0.88)",

                    letterSpacing: 0.5,
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* ── Info Panel ── */}

        <div
          style={{
            padding: "16px 18px 18px",

            background:
  "linear-gradient(180deg, #fffdfb 0%, #f8f3ed 100%)",

            position: "relative",
          }}
        >
          {/* Accent Line */}

          <div
            style={{
              position: "absolute",

              top: 0,
              left: 18,
              right: 18,

              height: 1,

              background:
                "linear-gradient(90deg, transparent, rgba(180,155,120,0.35), transparent)",
            }}
          />

          {/* Brand */}

          <p
            style={{
              margin: "0 0 5px",

              fontSize: 9.5,

              fontWeight: 500,

              letterSpacing: 3,

              color: "#9D7A56",

              textTransform: "uppercase",
            }}
          >
            {property.category || "Luxury Stay"}
          </p>

          {/* Title */}

          <h3
            style={{
              margin: "0 0 10px",

              fontSize: isMobile ? 16 : 17,

              fontWeight: 600,

              color: "#1A1410",

              lineHeight: 1.3,

              letterSpacing: -0.2,

              display: "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient: "vertical",

              overflow: "hidden",
            }}
          >
            {property.title}
          </h3>

          {/* Price + Rating */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            {/* Price */}

            <p
              style={{
                margin: 0,

                fontSize: 12,

                color: "#6F6257",

                fontWeight: 400,

                lineHeight: 1.4,
              }}
            >
              {formatINR(property.price)}

              <br />

              <span
                style={{
                  fontSize: 10.5,

                  color: "#A89E94",
                }}
              >
                per night
              </span>
            </p>

            {/* Rating */}

            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 4,

                background:
                  "rgba(180,155,120,0.1)",

                border:
                  "1px solid rgba(180,155,120,0.22)",

                borderRadius: 99,

                padding: "4px 9px",
              }}
            >
              <Star
                size={10}
                fill="#b49b78"
                color="#b49b78"
              />

              <span
                style={{
                  fontSize: 11,

                  fontWeight: 600,

                  color: "#c8ac87",
                }}
              >
                {property.rating}
              </span>
            </div>
          </div>

          {/* Hover Button */}

          <div
            style={{
              overflow: "hidden",

              maxHeight: hovered ? 52 : 0,

              opacity: hovered ? 1 : 0,

              transition:
                "max-height 0.32s ease, opacity 0.28s ease",

              marginTop: hovered ? 14 : 0,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();

                router.push(
                  `/property/${property.id}`
                );
              }}
              style={{
                width: "100%",

                padding: "11px 0",

                borderRadius: 12,

                border:
                  "1px solid rgba(180,155,120,0.35)",

                background:
  "linear-gradient(180deg, #F7F1EA 0%, #EFE4D8 100%)",

color: "#7A5C3E",

border:
  "1px solid rgba(157,122,86,0.18)",

                fontSize: 12.5,

                fontWeight: 600,

                letterSpacing: 0.8,

                cursor: "pointer",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 6,

                transition: "background 0.2s ease",
              }}
            >
              View Stay

              <ArrowUpRight
                size={13}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HavenPropertyCard);