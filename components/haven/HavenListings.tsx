"use client";
import Lottie from "lottie-react";
import home from "@/public/lottie/home.json";
import beach from "@/public/lottie/beach.json";
import { useRef, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowRightIcon } from "@/components/havenIcons";

import HavenPropertyCard from "@/components/haven/HavenPropertyCard";
import FilterBar, { FilterValues } from "@/components/haven/FilterBar";

type HavenListingsProps = {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  
};


export default function HavenListings({ 
  
  activeCategory, 
  setActiveCategory,

 }: HavenListingsProps) {
  const [filters, setFilters] = useState<FilterValues>({
  type: null,
  location: null,
  budget: null,
  availability: null,
  sort: null,
});
  const [properties, setProperties] = useState<any[]>([]);
  useEffect(() => {
  const fetchProperties = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "properties")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  fetchProperties();
}, []);
  const filtered = properties
  .filter((p) => {
    // Property Type
    if (
  filters.type &&
  p.category?.toLowerCase() !== filters.type.toLowerCase()
) {
  return false;
}

    // Location
    if (filters.location && p.location !== filters.location) {
      return false;
    }

    // Availability
    if (filters.availability === "Available now" && !p.availability) {
      return false;
    }

    return true;
  })
  .filter((p) => {
    // Budget filter
    if (!filters.budget) return true;

    const price = p.price;

    if (filters.budget === "Under ₹2,000") return price < 2000;
    if (filters.budget === "₹2,000–₹5,000") return price >= 2000 && price <= 5000;
    if (filters.budget === "₹5,000–₹10,000") return price >= 5000 && price <= 10000;
    if (filters.budget === "₹10,000+") return price > 10000;

    return true;
  })
  .sort((a, b) => {
    if (!filters.sort) return 0;

    if (filters.sort === "Price Low to High") return a.price - b.price;
    if (filters.sort === "Price High to Low") return b.price - a.price;
    if (filters.sort === "Top Rated") return b.rating - a.rating;

    return 0;
  });
const animations: Record<string, any> = {
  all: home,
  beach: beach,
};
  
function AnimatedIcon({ animation }: { animation: any }) {
  const lottieRef = useRef<any>(null);
  


  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.goToAndStop(0, true)}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        loop={false}
        autoplay={false}
        className="w-6 h-6"
      />
    </div>
  );
}

  return (
    <>
      <FilterBar filters={filters} setFilters={setFilters} />

      <section className="relative z-0 mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,56px)] pb-20 pt-12 overflow-visible">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 ">
          {filtered.map((property, index) => (
            <HavenPropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <button className="btn-outline inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#1C1917] bg-white px-10 py-[13px] text-sm font-bold text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-[#FAF8F5]">
            Show all stays
            <ArrowRightIcon />
          </button>
        </div>
      </section>
    </>
  );
}