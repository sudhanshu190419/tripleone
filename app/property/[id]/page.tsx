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

const property = {
  id: docSnap.id,
  ...docSnap.data(),
} as Property;

  return (
    <main className="bg-white text-neutral-900 min-h-screen pt-[90px]">
      <div className="max-w-[1120px] mx-auto px-5 py-8">
        

        <PropertyGallery images={property.images || []} />

        <h1 className="text-2xl font-semibold mb-1">{property.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">{property.location}</p>

        <div className="grid md:grid-cols-[1fr_380px] gap-14">
          <PropertyInfo property={property} />
          <BookingCard property={property} />
        </div>
      </div>
    </main>
  );
}