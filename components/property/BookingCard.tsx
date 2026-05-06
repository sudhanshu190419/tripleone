"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Lottie from "lottie-react";
import callAnim from "@/public/lottie/call.json";
import whatsappAnim from "@/public/lottie/whatsapp.json";

interface Property {
  id: number | string;
  price: number;
  rating: number;
  phone: string;
  availability: boolean;
}

interface Booking {
  start: string;
  end: string;
}

export default function BookingCard({
  property,
}: {
  property: Property;
}) {
  const [bookedDates, setBookedDates] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("propertyId", "==", property.id)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          start: doc.data().start,
          end: doc.data().end,
        })) as Booking[];

        setBookedDates(data);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [property.id]);

  const isAvailable =
    property.availability && bookedDates.length === 0;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  function AnimatedIcon({
    animation,
  }: {
    animation: unknown;
  }) {
    const lottieRef = useRef<any>(null);

    return (
      <div
        onMouseEnter={() => lottieRef.current?.play()}
        onMouseLeave={() =>
          lottieRef.current?.goToAndStop(0, true)
        }
        className="w-5 h-5"
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animation}
          loop={false}
          autoplay={false}
        />
      </div>
    );
  }

  return (
    <div className="sticky top-8 rounded-[28px] border border-black/5 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

      {/* Top */}
      <div className="pb-6 border-b border-black/5">
        <div className="flex items-start justify-between gap-4">

          {/* Price */}
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-400 mb-3">
              Price Per Night
            </p>

            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-semibold tracking-tight text-neutral-950">
                {formatPrice(property.price)}
              </h2>

              <span className="text-sm text-neutral-500 pb-1">
                / night
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 border border-amber-100">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>

            <span className="text-sm font-semibold text-neutral-900">
              {property.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="py-6 border-b border-black/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-neutral-900">
            Availability
          </p>

          {loading ? (
            <div className="h-5 w-20 rounded-full bg-neutral-100 animate-pulse" />
          ) : (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
              {isAvailable ? "Available" : "Booked"}
            </div>
          )}
        </div>

        <p className="text-sm text-neutral-500 leading-relaxed">
          Check-in from 12:00 PM. Direct host confirmation required.
        </p>
      </div>

      {/* Actions */}
      <div className="pt-6 space-y-3">

        {/* Call */}
        <a
          href={`tel:${property.phone}`}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            isAvailable
              ? "bg-neutral-950 text-white hover:bg-neutral-800"
              : "bg-neutral-100 text-neutral-400 pointer-events-none"
          }`}
        >
          <AnimatedIcon animation={callAnim} />
          Call Host
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${property.phone}?text=Hi, I want to inquire about property ${property.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full h-14 rounded-2xl border flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            isAvailable
              ? "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
              : "border-neutral-100 bg-neutral-50 text-neutral-400 pointer-events-none"
          }`}
        >
          <AnimatedIcon animation={whatsappAnim} />
          WhatsApp Host
        </a>
      </div>

      {/* Footer note */}
      <p className="mt-5 text-xs text-neutral-400 text-center leading-relaxed">
        Secure communication. No booking charges applied.
      </p>
    </div>
  );
}