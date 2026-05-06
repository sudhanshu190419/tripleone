export default function AdminPropertySkeleton() {
  return (
    <div className="rounded-xl border border-[#E8E0D8] bg-white p-5 shadow-[0_8px_28px_rgba(28,25,23,0.04)] animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-5 w-56 rounded-full bg-[#EDE5DB]" />
          <div className="h-4 w-40 rounded-full bg-[#F0E8DF]" />
          <div className="h-4 w-24 rounded-full bg-[#F0E8DF]" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-24 rounded-lg bg-[#F3ECE4]" />
          <div className="h-10 w-20 rounded-lg bg-[#F3ECE4]" />
          <div className="h-10 w-24 rounded-lg bg-[#F3ECE4]" />
        </div>
      </div>
    </div>
  );
}
