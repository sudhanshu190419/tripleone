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

export default function BookingCard({ property }: { property: Property }) {
  const [bookedDates, setBookedDates] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
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

  function AnimatedIcon({ animation }: { animation: unknown }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lottieRef = useRef<any>(null);

    return (
      <div
        onMouseEnter={() => lottieRef.current?.play()}
        onMouseLeave={() => lottieRef.current?.goToAndStop(0, true)}
        className="flex items-center justify-center w-6 h-6"
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animation}
          loop={false}
          autoplay={false}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="sticky top-8 rounded-2xl bg-white p-6 md:p-8 border border-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      {/* Price & Rating Header */}
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-neutral-100">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">Price per stay</p>
          <p className="text-3xl font-bold tracking-tight text-neutral-900">
            {formatPrice(property.price)}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="font-bold text-base text-neutral-900">{property.rating}</span>
        </div>
      </div>

      {/* Availability Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-900">Today's Status</span>
          {isLoading ? (
            <div className="h-4 w-16 bg-neutral-200 animate-pulse rounded"></div>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-emerald-500" : "bg-rose-500"
                }`}
              ></span>
              {isAvailable ? "Available Now" : "Fully Booked"}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500">Standard Check-in: 12:00 PM</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <a
          href={`tel:${property.phone}`}
          className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200
            ${
              isAvailable
                ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
        >
          <AnimatedIcon animation={callAnim} />
          Contact Host
        </a>

        <a
          href={`https://wa.me/${property.phone}?text=Hi, I want to check availability for property ID: ${property.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium border border-neutral-200 transition-all duration-200
            ${
              isAvailable
                ? "bg-neutral-50 text-neutral-900 shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                : "border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed"
            }`}
        >
          <AnimatedIcon animation={whatsappAnim} />
          Message on WhatsApp
        </a>
      </div>

      <p className="text-xs text-neutral-600 mt-0.5">
        Direct bookings are subject to host confirmation.
      </p>
    </div>
  );
}