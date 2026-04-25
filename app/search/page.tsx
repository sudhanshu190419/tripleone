import { properties } from "@/components/homeData";
import HavenPropertyCard from "@/components/haven/HavenPropertyCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
  location?: string;
  type?: string;
}>;
}) {
  const params = await searchParams;
const location = params.location || "";
const type = params.type || "";

  const filtered = properties.filter((property) => {
  const locationMatch =
    property.location
      .toLowerCase()
      .includes(location.toLowerCase());

  const typeMatch =
    !type ||
    property.category
      .toLowerCase()
      .includes(type.toLowerCase());

  return locationMatch && typeMatch;
});

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-28">
      <h1 className="text-2xl font-semibold mb-8">
        Search results for "{location}"
      </h1>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((property, index) => (
            <HavenPropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          No hotels found in {location}
        </p>
      )}
    </div>
  );
}