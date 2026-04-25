"use client";

import { useRef, useState, useCallback, memo, ReactNode } from "react";
import { HeartIcon, MapPinIcon, StarIcon } from "@/components/havenIcons";
import { categoryGradients, categories, type HomeProperty } from "@/components/homeData";
import { useInView } from "@/components/havenHooks";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── Types ─────────────────────────────────────────────────── */

type HavenPropertyCardProps = {
  property: HomeProperty;
  index: number;
};


/* ─── Sub-components ─────────────────────────────────────────── */

const ImagePlaceholder = memo(function ImagePlaceholder({
  image,
  tag,
  liked,
  title,
  location,
  onToggleLike,
}: {
  image: string;
  tag?: string;
  liked: boolean;
  title: string;
  location: string;
  onToggleLike: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="relative h-56 overflow-hidden group">
  <Image
  src={
  image && image.trim() !== ""
    ? image
    : "/property-placeholder.jpg"
}
    alt={`${title} - luxury stay located in ${location}`}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
  />

  {/* overlay for readability */}
  <div className="absolute inset-0 bg-black/10" />

  {/* Tag */}
  {tag && (
    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold">
      {tag}
    </span>
  )}

  {/* Like button */}
  <button
  aria-label={liked ? "Remove from favorites" : "Add to favorites"}
    type="button"
    onClick={onToggleLike}
    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white focus:ring-2 focus:ring-[#E07B54]"
  >
    <HeartIcon active={liked} />
  </button>
</div>
  );
});


const PriceRow = memo(function PriceRow({
  price,
  reviews,
}: {
  price: number;
  reviews: number;
}) {
  const formattedReviews = new Intl.NumberFormat("en-US", { notation: "compact" }).format(reviews);

  return (
    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
      <div className="flex items-baseline gap-1">
        <span className="text-base font-bold text-stone-900">${price.toLocaleString()}</span>
        <span className="text-xs text-stone-400">/ night</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-stone-400">
        <span>{formattedReviews} reviews</span>
      </div>
    </div>
  );
});

/* ─── Main component ─────────────────────────────────────────── */

function HavenPropertyCard({ property, index }: HavenPropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  

  const toggleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  /* Staggered entrance */
  const delay = `${index * 0.065}s`;
  const entrance: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
    transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
  };

  /* Hover lift */
  const cardStyle: React.CSSProperties = {
    boxShadow: hovered
      ? "0 20px 48px -8px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)"
      : "0 2px 12px rgba(0,0,0,0.05)",
    transform: hovered ? "translateY(-6px)" : "translateY(0)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  };

  return (
    <div ref={ref} style={entrance}>
      <article
        onClick={() => router.push(`/property/${property.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
        className="overflow-hidden rounded-2xl border border-stone-100 bg-white cursor-pointer"
      >
        <ImagePlaceholder
  image={property.images?.[0] || "/fallback-property.jpg"}
  tag={property.tag}
  liked={liked}
  title={property.title}
  location={property.location}
  onToggleLike={toggleLike}
/>

        <div className="px-4 pb-4 pt-3.5">
          {/* Title + rating */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="flex-1 truncate pr-2 text-sm font-semibold leading-snug text-stone-900">
              {property.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF7ED] px-3 py-1 shadow-sm border border-[#FED7AA]">
              <StarIcon />
              <span className="text-[13px] font-bold tabular-nums text-[#C2410C]">
                {property.rating}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="mb-1.5 flex items-center gap-1 text-xs text-stone-500">
            <MapPinIcon />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Nights label */}
          <p className="mb-3 text-[11px] leading-none text-stone-400">{property.nights}</p>

          <PriceRow price={property.price} reviews={property.reviews} />
        </div>
      </article>
    </div>
  );
}

export default memo(HavenPropertyCard);