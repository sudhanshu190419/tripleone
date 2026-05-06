export default function PropertyDetailsSkeleton() {
  return (
    <main className="bg-white min-h-screen pt-[90px]">
      <div className="mx-auto max-w-[1120px] px-5 py-8 animate-pulse">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="col-span-2 row-span-2 aspect-[4/3] rounded-[24px] bg-[#F3ECE4]" />
            <div className="aspect-[4/3] rounded-[24px] bg-[#F3ECE4]" />
            <div className="aspect-[4/3] rounded-[24px] bg-[#F3ECE4]" />
            <div className="aspect-[4/3] rounded-[24px] bg-[#F3ECE4]" />
            <div className="aspect-[4/3] rounded-[24px] bg-[#F3ECE4]" />
          </div>

          <div className="pt-3">
            <div className="h-8 w-3/4 rounded-full bg-[#EDE5DB]" />
            <div className="mt-3 h-4 w-1/3 rounded-full bg-[#F0E8DF]" />
          </div>

          <div className="grid gap-10 md:grid-cols-[1fr_380px]">
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full rounded-full bg-[#F0E8DF]" />
              <div className="h-4 w-11/12 rounded-full bg-[#F0E8DF]" />
              <div className="h-4 w-10/12 rounded-full bg-[#F0E8DF]" />
              <div className="h-4 w-8/12 rounded-full bg-[#F0E8DF]" />
              <div className="mt-6 h-32 rounded-[24px] bg-[#F3ECE4]" />
            </div>

            <div className="rounded-[28px] border border-[#EEE5DB] bg-[#FCFBF9] p-5 space-y-4">
              <div className="h-5 w-1/2 rounded-full bg-[#EDE5DB]" />
              <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
              <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
              <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
              <div className="h-12 w-full rounded-2xl bg-[#EDE5DB]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
