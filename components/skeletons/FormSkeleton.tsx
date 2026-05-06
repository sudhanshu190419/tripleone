export default function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 w-48 rounded-full bg-[#EDE5DB]" />
      <div className="space-y-4 rounded-[28px] border border-[#E8E0D8] bg-white p-5 sm:p-6">
        <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
          <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        </div>
        <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        <div className="h-28 w-full rounded-lg bg-[#F3ECE4]" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
          <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
          <div className="h-12 w-full rounded-lg bg-[#F3ECE4]" />
        </div>
        <div className="h-12 w-40 rounded-xl bg-[#EDE5DB]" />
      </div>
    </div>
  );
}
