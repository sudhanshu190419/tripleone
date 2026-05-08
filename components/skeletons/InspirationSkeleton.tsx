export default function InspirationSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`inspiration-skel-${index}`}
            className="relative w-[220px] md:w-[260px] shrink-0 aspect-[4/5] overflow-hidden rounded-[18px] bg-[#F7EEE6]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#E6D7CB] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 h-3 w-24 rounded bg-[#EADDD2]" />
            <div className="absolute bottom-10 left-4 h-4 w-32 rounded bg-[#EADDD2]" />
          </div>
        ))}
      </div>
    </div>
  );
}
