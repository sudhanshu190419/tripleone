export default function PropertyCardSkeleton() {
  return (
    <div
      className="rounded-[24px] border border-[#E8E0D8] bg-white p-2.5 shadow-[0_10px_24px_rgba(28,25,23,0.08)] animate-pulse"
      style={{ minHeight: 420 }}
    >
      <div className="overflow-hidden rounded-[18px] bg-[#F3ECE4]">
        <div className="w-full pb-[88%] bg-[#F3ECE4]" />
      </div>

      <div className="px-1 pt-4 pb-1 space-y-2.5">
        <div className="h-4.5 w-5/6 rounded-full bg-[#EDE5DB]" />
        <div className="h-3.5 w-2/5 rounded-full bg-[#F0E8DF]" />
        <div className="h-3.5 w-1/2 rounded-full bg-[#F0E8DF]" />
        <div className="flex items-end justify-between gap-3 pt-3">
          <div className="h-6 w-28 rounded-full bg-[#EDE5DB]" />
          <div className="h-9 w-24 rounded-full bg-[#EDE5DB]" />
        </div>
      </div>
    </div>
  );
}
