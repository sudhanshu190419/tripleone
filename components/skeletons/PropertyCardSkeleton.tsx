export default function PropertyCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-[#E8E0D8] bg-white p-3 shadow-[0_14px_48px_rgba(28,25,23,0.06)] animate-pulse">
      <div className="overflow-hidden rounded-[18px] bg-[#F3ECE4]">
        <div className="aspect-[4/3] w-full bg-[#F3ECE4]" />
      </div>

      <div className="px-1 pt-3 pb-1 space-y-2">
        <div className="h-4 w-4/5 rounded-full bg-[#EDE5DB]" />
        <div className="h-3.5 w-1/3 rounded-full bg-[#F0E8DF]" />
        <div className="flex items-end justify-between gap-3 pt-2">
          <div className="h-5 w-24 rounded-full bg-[#EDE5DB]" />
          <div className="h-8 w-24 rounded-full bg-[#EDE5DB]" />
        </div>
      </div>
    </div>
  );
}
