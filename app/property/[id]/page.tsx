import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import BookingCard from "@/components/property/BookingCard";
import { notFound } from "next/navigation";

interface Property {
  id: string;
  title: string;
  location: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  images: string[];
  phone: string;
  email: string;
  address: string;
  checkIn: string;
  checkOut: string;
  amenities: string[];
  availability: boolean;
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const docRef = doc(db, "properties", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const data = docSnap.data();

if (!data) notFound();

// Create the object and ensure it matches the Property interface
const property: Property = {
  id: docSnap.id,
  title: data.title ?? "",
  location: data.location ?? "",
  category: data.category ?? "",
  price: Number(data.price ?? 0),
  rating: Number(data.rating ?? 0),
  description: data.description ?? "",
  images: data.images ?? [],
  phone: data.phone ?? "",
  email: data.email ?? "",
  address: data.address ?? "",
  checkIn: data.checkIn ?? "",
  checkOut: data.checkOut ?? "",
  amenities: data.amenities ?? [],
  availability: !!data.availability,
  // This satisfies the "Plain Object" requirement for Next.js
  createdAt: data.createdAt?.toDate 
    ? data.createdAt.toDate().toISOString() 
    : new Date().toISOString(),
} as any;

  return (
    <main className="bg-white text-neutral-900 min-h-screen pt-[72px] sm:pt-[90px]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <PropertyGallery images={property.images || []} />

        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#EBDCCF] bg-[#FFF7F2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B65D34]">
              {property.category || "Property"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
              <svg className="h-3.5 w-3.5 text-[#D86A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </span>
          </div>

          <h1 className="max-w-3xl text-[clamp(2.1rem,4.2vw,3.7rem)] font-semibold tracking-[-0.05em] leading-[0.95] text-neutral-950">
            {property.title}
          </h1>

          <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#D86A3A] to-transparent" />
        </div>

        <div className="block lg:hidden mb-8">
          <BookingCard property={property} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-14">
          <PropertyInfo property={property} />

          <div className="hidden lg:block sticky top-8 h-fit">
            <BookingCard property={property} />
          </div>
        </div>
      </div>
    </main>
  );
}