"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Property = {
  id: string;
  title: string;
  availability: boolean;
  location: string;
};

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "properties")
        );

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

    fetchProperties();
  }, []);

  const totalProperties = properties.length;
  const availableProperties = properties.filter(
    (property) => property.availability
  ).length;

  const bookedProperties =
    totalProperties - availableProperties;

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-2xl p-6">
          <p className="text-sm text-neutral-500">
            Total Properties
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {totalProperties}
          </h2>
        </div>

        <div className="border rounded-2xl p-6">
          <p className="text-sm text-neutral-500">
            Available
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {availableProperties}
          </h2>
        </div>

        <div className="border rounded-2xl p-6">
          <p className="text-sm text-neutral-500">
            Booked
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {bookedProperties}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-10">
        <Link
          href="/admin/add-property"
          className="px-5 py-3 bg-black text-white rounded-lg"
        >
          Add Property
        </Link>

        <Link
          href="/admin/properties"
          className="px-5 py-3 border rounded-lg"
        >
          Manage Properties
        </Link>
      </div>

      {/* Recent Properties */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recent Properties
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div
                key={property.id}
                className="border rounded-xl p-4"
              >
                <h3 className="font-semibold">
                  {property.title}
                </h3>
                <p className="text-sm text-neutral-500">
                  {property.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}