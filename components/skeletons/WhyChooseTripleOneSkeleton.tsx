import React from "react";

export default function WhyChooseTripleOneSkeleton() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 animate-pulse">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#FCF7F0] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          {/* Header Skeleton */}
          <div className="mx-auto max-w-5xl flex flex-col items-center">
            {/* Title */}
            <div className="h-10 w-3/4 sm:w-1/2 bg-[#EAE0D6] rounded mb-6"></div>

            {/* Description */}
            <div className="h-4 w-full sm:w-3/4 bg-[#EAE0D6] rounded mb-2"></div>
            <div className="h-4 w-5/6 sm:w-2/3 bg-[#EAE0D6] rounded mb-8"></div>

            {/* Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="h-10 w-64 rounded-full bg-[#EAE0D6]"></div>
              <div className="h-10 w-56 rounded-full bg-[#EAE0D6]"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <article
                key={i}
                className="rounded-[18px] bg-[#FCF7F0] px-4 py-6 sm:px-5 sm:py-7 opacity-70"
              >
                {/* Icon */}
                <div className="mb-4 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#EAE0D6]"></div>

                {/* Title */}
                <div className="mb-3 h-6 w-3/4 bg-[#EAE0D6] rounded"></div>

                {/* Description */}
                <div className="h-4 w-full bg-[#EAE0D6] rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-[#EAE0D6] rounded"></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
