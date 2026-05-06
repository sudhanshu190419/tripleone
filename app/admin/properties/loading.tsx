import AdminPropertySkeleton from "@/components/skeletons/AdminPropertySkeleton";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8 h-10 w-64 rounded-full bg-[#EDE5DB] animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <AdminPropertySkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
