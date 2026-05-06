import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import SearchResultsClient from "@/components/haven/SearchResultsClient";
import { FilterValues } from "@/components/haven/FilterBar";

const serializeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    const candidate = value as { toMillis?: () => number; toDate?: () => Date };

    if (typeof candidate.toMillis === "function") {
      return candidate.toMillis();
    }

    if (typeof candidate.toDate === "function") {
      return candidate.toDate().toISOString();
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        serializeValue(entry),
      ])
    );
  }

  return value;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const snapshot = await getDocs(collection(db, "properties"));

  const properties = snapshot.docs.map((doc) => {
    const data = doc.data();
    const serializedData = serializeValue(data) as Record<string, unknown>;

    return {
      id: doc.id,
      ...serializedData,
    } as any;
  }) as any[];

  const extractParam = (param: string | string[] | undefined) => 
    (Array.isArray(param) ? param[0] : param) || "";

  const initialFilters: FilterValues = {
    type: extractParam(params.type) || null,
    location: extractParam(params.location) || null,
    budget: extractParam(params.budget) || null,
    availability: null,
    sort: extractParam(params.sort) || null,
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#FAF8F5] text-[#1C1917]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(224,123,84,0.10),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(193,127,83,0.10),_transparent_30%),linear-gradient(180deg,_#FAF8F5_0%,_#FFFDFB_100%)]" />
      <div className="absolute left-0 top-24 -z-10 h-64 w-64 rounded-full bg-[#E07B54]/10 blur-3xl" />
      <div className="absolute right-0 top-40 -z-10 h-72 w-72 rounded-full bg-[#C17F53]/10 blur-3xl" />

      <SearchResultsClient properties={properties} initialFilters={initialFilters} />
    </div>
  );
}