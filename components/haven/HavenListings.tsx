"use client";

import { ArrowRightIcon } from "@/components/havenIcons";
import { categories, properties } from "@/components/homeData";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";

type HavenListingsProps = {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
};

export default function HavenListings({ activeCategory, setActiveCategory }: HavenListingsProps) {
  const filtered = activeCategory === "all" ? properties : properties.filter((property) => property.category === activeCategory);

  return (
    <>
      <div className="sticky top-[68px] z-[90] border-b border-[#EDE8E2] bg-[rgba(250,248,245,0.97)] backdrop-blur-[12px]">
        <div className="hide-scrollbar mx-auto flex max-w-[1760px] gap-0.5 overflow-x-auto px-[clamp(20px,5vw,56px)]">
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
                <span className="text-[19px]">{category.icon}</span>
                <span className="whitespace-nowrap text-[11px] tracking-[0.03em]">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,56px)] pb-20 pt-12">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,255px),1fr))] gap-6">
          {filtered.map((property, index) => (
            <HavenPropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <button className="btn-outline inline-flex items-center gap-2 rounded-[32px] border-[1.5px] border-[#1C1917] bg-white px-10 py-[13px] text-sm font-bold text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-[#FAF8F5]">
            Show all stays
            <ArrowRightIcon />
          </button>
        </div>
      </section>
    </>
  );
}