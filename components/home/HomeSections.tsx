"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import HorizontalPropertySection from "./HorizontalPropertySection";

export default function HomeSections() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const snapshot = await getDocs(
        collection(db, "properties")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProperties(data);
    };

    fetchProperties();
  }, []);

  const featuredLuxury = properties.filter(
    (p) =>
      p.title?.includes("Luxury") ||
      p.title?.includes("Moon") ||
      p.title?.includes("TripleOne")
  );

  const newDelhiStays = properties.filter(
    (p) =>
      p.location?.toLowerCase().includes("new delhi") ||
      p.location?.toLowerCase().includes("moti nagar") ||
      p.location?.toLowerCase().includes("ramesh nagar")
  );

  const noidaStays = properties.filter(
    (p) =>
      p.location?.toLowerCase().includes("noida")
  );

  return (
    <>
      <HorizontalPropertySection
        title="Featured Luxury Stays"
        properties={featuredLuxury}
      />

      <HorizontalPropertySection
        title="Popular stays in New Delhi"
        properties={newDelhiStays}
      />

      <HorizontalPropertySection
        title="Trending stays in Noida"
        properties={noidaStays}
      />
    </>
  );
}