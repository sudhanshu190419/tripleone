export default function PropertyCardSkeleton() {
  return (
    <div
      className="rounded-[24px] border border-[#E8E0D8] bg-white p-2 sm:p-2.5 shadow-[0_10px_24px_rgba(28,25,23,0.08)] animate-pulse min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]"
    >
      <div className="overflow-hidden rounded-[18px] bg-[#F3ECE4]">
        <div className="w-full pb-[68%] sm:pb-[88%] bg-[#F3ECE4]" />
      </div>

      <div className="px-1 pt-3 sm:pt-4 pb-1 space-y-2">
        <div className="h-4 sm:h-4.5 w-5/6 rounded-full bg-[#EDE5DB]" />
        <div className="h-3 sm:h-3.5 w-2/5 rounded-full bg-[#F0E8DF]" />
        <div className="h-3 sm:h-3.5 w-1/2 rounded-full bg-[#F0E8DF]" />
        <div className="flex items-end justify-between gap-3 pt-2 sm:pt-3">
          <div className="h-5 sm:h-6 w-24 sm:w-28 rounded-full bg-[#EDE5DB]" />
          <div className="h-8 sm:h-9 w-20 sm:w-24 rounded-full bg-[#EDE5DB]" />
        </div>
      </div>
    </div>
  );
}
