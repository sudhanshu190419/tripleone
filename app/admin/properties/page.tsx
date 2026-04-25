"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc,updateDoc, } from "firebase/firestore";
import Link from "next/link";

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


  const toggleAvailability = async (
  id: string,
  currentValue: boolean
) => {
  try {
    await updateDoc(doc(db, "properties", id), {
      availability: !currentValue,
    });

    fetchProperties();
  } catch (error) {
    console.error(error);
  }
};
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
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Manage Properties</h1>

      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg">{property.title}</h2>
              <p className="text-sm text-neutral-500">
                {property.location}
              </p>
              <p className="text-sm mt-1">₹{property.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
  onClick={() =>
    toggleAvailability(
      property.id,
      property.availability
    )
  }
  className={`px-4 py-2 rounded-lg text-sm ${
    property.availability
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
                {property.availability ? "Available" : "Booked"}
              </button>
                <Link
  href={`/admin/properties/${property.id}`}
  className="px-4 py-2 bg-black text-white rounded-lg"
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