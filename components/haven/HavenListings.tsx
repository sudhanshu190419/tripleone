"use client";
import Lottie from "lottie-react";
import home from "@/public/lottie/home.json";
import beach from "@/public/lottie/beach.json";
import { useRef, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowRightIcon } from "@/components/havenIcons";
import { categories } from "@/components/homeData";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";

type HavenListingsProps = {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  
};


export default function HavenListings({ 
  
  activeCategory, 
  setActiveCategory,

 }: HavenListingsProps) {
  
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
  const filtered =
  activeCategory === "all"
    ? properties
    : properties.filter(
        (property) => property.category === activeCategory
      );
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
      <div className="sticky top-[80px] z-[90] border-b border-[#EDE8E2] bg-[rgba(250,248,245,0.97)] backdrop-blur-[12px]">
        <div className="hide-scrollbar mx-auto flex max-w-[1280px] gap-0.5 overflow-x-auto px-[clamp(20px,5vw,56px)]">
          {categories.map((category) => {
            const active = activeCategory === category.id;
            

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="cat flex flex-col items-center gap-1 border-b-2 px-5 py-[13px]"
                style={{
                  borderBottomColor: active ? "#E07B54" : "transparent",
                  color: active ? "#1C1917" : "#A8A29E",
                  fontWeight: active ? 700 : 500,
                  transition: "all .22s",
                }}
              >
                <span className="text-[19px] flex items-center justify-center">
  {animations[category.id] ? (
    <AnimatedIcon animation={animations[category.id]} />
  ) : (
    category.icon
  )}
</span>
                <span className="whitespace-nowrap text-[11px] tracking-[0.03em]">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,56px)] pb-20 pt-12">
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