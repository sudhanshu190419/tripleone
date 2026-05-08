"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { CardCarousel } from "@/components/ui/card-carousel";
import { db } from "@/lib/firebase";
import { CAROUSEL_IMAGES_COLLECTION } from "@/lib/carousel";

const reels = [
  {
    src: "/instagram/reel1.jpg",
    alt: "Property reel 1",
  },
  {
    src: "/instagram/reel2.jpg",
    alt: "Property reel 2",
  },
  {
    src: "/instagram/reel3.jpg",
    alt: "Property reel 3",
  },
  { 
    src: "/instagram/reel4.jpg",
    alt: "Property reel 4" },
];

export default function InstagramSection() {
  const [images, setImages] = useState<typeof reels | null>(null);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      try {
       const q = query(
  collection(db, CAROUSEL_IMAGES_COLLECTION),
  orderBy("createdAt", "desc"),
  limit(4)
);
        const snapshot = await getDocs(q);
        const nextImages = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              src: String(data.src || ""),
              alt: String(data.alt || "Carousel image"),
            };
          })
          .filter((item) => item.src);

        if (active) {
          setImages(nextImages.length > 0 ? nextImages : reels);
        }
      } catch {
        if (active) setImages(reels);
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="pt-0 pb-14 sm:pt-10 sm:pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {images ? (
          <CardCarousel images={images} />
        ) : (
          <div className="animate-pulse">
            <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
              <div className="mb-3 h-3 w-28 rounded-full bg-[#E8DED4]" />
              <div className="h-8 w-72 sm:w-96 rounded bg-[#E8DED4]" />
              <div className="mt-4 h-4 w-64 sm:w-80 rounded bg-[#E8DED4]" />
            </div>
            <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`carousel-skel-${index}`}
                  className="w-[180px] h-[320px] sm:w-[220px] sm:h-[391px] md:w-[260px] md:h-[462px] lg:w-[300px] lg:h-[533px] shrink-0 rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] bg-[#EFE6DC]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}