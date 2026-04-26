"use client";

import HavenPropertyCard from "@/components/haven/HavenPropertyCard";

type Props = {
  title: string;
  properties: any[];
};

export default function HorizontalPropertySection({
  title,
  properties,
}: Props) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,56px)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1917]">
            {title}
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="min-w-[300px] max-w-[300px] flex-shrink-0"
            >
              <HavenPropertyCard
                property={property}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}