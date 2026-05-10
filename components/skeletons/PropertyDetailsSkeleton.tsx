export default function PropertyDetailsSkeleton() {
  return (
    <main className="bg-white min-h-screen pt-[72px] sm:pt-[90px]">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-5 py-6 sm:py-8 animate-pulse">
        {/* Gallery */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[280px] sm:h-[360px] md:h-[500px] rounded-[20px] sm:rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-full bg-[#F3ECE4]" />
            <div className="hidden md:flex flex-col gap-2 h-full">
              <div className="h-1/2 bg-[#F3ECE4]" />
              <div className="h-1/2 bg-[#F3ECE4]" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-end">
            <div className="h-9 w-28 sm:h-10 sm:w-32 rounded-full bg-[#EDE5DB]" />
          </div>
        </div>

        {/* Title + meta */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="h-6 w-28 rounded-full bg-[#F0E8DF]" />
            <div className="h-6 w-40 rounded-full bg-[#F0E8DF]" />
          </div>
          <div className="h-10 w-4/5 rounded-full bg-[#EDE5DB]" />
          <div className="mt-4 h-px w-16 bg-[#F0E8DF]" />
        </div>

        {/* Mobile booking card */}
        <div className="block lg:hidden mb-8 rounded-[28px] border border-[#EEE5DB] bg-[#FCFBF9] p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="h-8 w-40 rounded-full bg-[#EDE5DB]" />
            <div className="h-8 w-20 rounded-full bg-[#F0E8DF]" />
          </div>
          <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
          <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
          <div className="h-10 w-full rounded-2xl bg-[#F3ECE4]" />
          <div className="h-12 w-full rounded-2xl bg-[#EDE5DB]" />
        </div>

        {/* Info + booking card */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-14">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`highlight-${index}`} className="h-24 rounded-2xl bg-[#F7F2EC]" />
              ))}
            </div>

            <div className="rounded-[22px] border border-[#EDE5DB] bg-white p-5 sm:p-6">
              <div className="h-5 w-44 rounded-full bg-[#EDE5DB]" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-5/6 rounded-full bg-[#F0E8DF]" />
                <div className="h-4 w-4/6 rounded-full bg-[#F0E8DF]" />
                <div className="h-4 w-3/6 rounded-full bg-[#F0E8DF]" />
              </div>
            </div>

            <div className="rounded-[22px] border border-[#EDE5DB] bg-white p-5 sm:p-6">
              <div className="h-5 w-40 rounded-full bg-[#EDE5DB]" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full rounded-full bg-[#F0E8DF]" />
                <div className="h-4 w-11/12 rounded-full bg-[#F0E8DF]" />
                <div className="h-4 w-10/12 rounded-full bg-[#F0E8DF]" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
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
