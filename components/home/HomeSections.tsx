"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import HorizontalPropertySection from "./HorizontalPropertySection";
import WhyChooseTripleOne from "./WhyChooseTripleOne";
import WhyChooseTripleOneSkeleton from "../skeletons/WhyChooseTripleOneSkeleton";

export default function HomeSections({
  filters,
}: {
  filters: any;
}) {
  const [properties, setProperties] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [whyChooseLoading, setWhyChooseLoading] = useState(true);
  const filteredProperties = properties
  .filter((p) => {
    if (
      filters.type &&
      p.category?.toLowerCase() !== filters.type.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.location &&
      !p.location
        ?.toLowerCase()
        .includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.availability === "Available now" &&
      !p.availability
    ) {
      return false;
    }

    return true;
  })
  .filter((p) => {
    if (!filters.budget) return true;

    const price = p.price;

    if (filters.budget === "Under ₹2,000")
      return price < 2000;

    if (filters.budget === "₹2,000–₹5,000")
      return price >= 2000 && price <= 5000;

    if (filters.budget === "₹5,000–₹10,000")
      return price >= 5000 && price <= 10000;

    if (filters.budget === "₹10,000+")
      return price > 10000;

    return true;
  })
  .sort((a, b) => {
    if (!filters.sort) return 0;

    if (filters.sort === "Price Low to High")
      return a.price - b.price;

    if (filters.sort === "Price High to Low")
      return b.price - a.price;

    if (filters.sort === "Top Rated")
      return b.rating - a.rating;

    return 0;
  });

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
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWhyChooseLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const featuredLuxury = filteredProperties.filter(
    (p) =>
      p.title?.includes("Luxury") ||
      p.title?.includes("Moon") ||
      p.title?.includes("TripleOne")
  );

  const newDelhiStays = filteredProperties.filter(
    (p) =>
      p.location?.toLowerCase().includes("new delhi") ||
      p.location?.toLowerCase().includes("moti nagar") ||
      p.location?.toLowerCase().includes("ramesh nagar")
  );

  const noidaStays = filteredProperties.filter(
    (p) =>
      p.location?.toLowerCase().includes("noida")
  );

  return (
    <>
      <HorizontalPropertySection
        title="Featured <em>Luxury</em> Stays"
        subtitle="Handpicked premium stays crafted for comfort and elevated living."
        properties={featuredLuxury}
        loading={loading}
      />

      <HorizontalPropertySection
        title="Popular stays in New Delhi"
        properties={newDelhiStays}
        loading={loading}
      />

      {!loading && (
        <HorizontalPropertySection
          title="Trending stays in <em>Noida</em>"
          subtitle="Most booked spaces loved by guests this week."
          properties={noidaStays}
          loading={loading}
        />
      )}

      {whyChooseLoading ? (
        <WhyChooseTripleOneSkeleton />
      ) : (
        <WhyChooseTripleOne />
      )}
    </>
  );
}