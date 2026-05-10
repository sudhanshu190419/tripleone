"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import AdminPropertySkeleton from "@/components/skeletons/AdminPropertySkeleton";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  availability: boolean;
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const snapshot = await getDocs(collection(db, "properties"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];

      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchProperties();
  }, []);


  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this property?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "properties", id));
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 h-10 w-64 rounded-full bg-[#EDE5DB] animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <AdminPropertySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold mb-8">Manage Properties</h1>

      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-xl p-4 flex flex-col gap-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h2 className="font-semibold text-lg">{property.title}</h2>
              <p className="text-sm text-neutral-500">
                {property.location}
              </p>
              <p className="text-sm mt-1">₹{property.price}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Link
  href={`/admin/properties/${property.id}`}
  className="px-4 py-2 bg-black text-white rounded-lg text-center"
>
  Edit
</Link>
              <button
                onClick={() => handleDelete(property.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}