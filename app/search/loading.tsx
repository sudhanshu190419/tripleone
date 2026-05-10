import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FBFAF8] text-[#1C1917]">

      {/* Hero Skeleton */}
      <section className="relative h-[38vh] min-h-[320px] w-full overflow-hidden sm:h-[46vh] sm:min-h-[420px] lg:h-[58vh] lg:max-h-[560px]">
        <div className="absolute inset-0 animate-pulse bg-[#EDE5DB]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <div className="h-3 w-24 rounded-full bg-white/30 animate-pulse" />
            <div className="h-14 w-[260px] rounded-full bg-white/25 animate-pulse sm:w-[420px]" />
            <div className="h-4 w-44 rounded-full bg-white/20 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-8 lg:px-12">

        {/* Filter Skeleton */}
        <div className="mt-3 animate-pulse">
          <div className="h-14 w-full rounded-2xl bg-white border border-[#E8E0D8]" />
        </div>

        {/* Chips Skeleton */}
        <div className="mt-3 flex gap-2 overflow-hidden">
          <div className="h-8 w-24 rounded-full bg-[#EDE5DB] animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-[#EDE5DB] animate-pulse" />
          <div className="h-8 w-20 rounded-full bg-[#EDE5DB] animate-pulse" />
        </div>

        {/* Results Skeleton */}
        <div
          className="
            mt-10
            flex gap-4 overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory
            pb-[100px] -mb-[80px] pt-4 -mt-4
            scrollbar-none
            sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[88%] flex-shrink-0 snap-start sm:min-w-0"
            >
              <PropertyCardSkeleton />
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="mt-20 flex flex-col items-center gap-3">
          <div className="h-px w-10 bg-[#E8E0D8]" />
          <div className="h-4 w-28 rounded-full bg-[#EDE5DB] animate-pulse" />
        </div>
      </div>
    </main>
  );
}