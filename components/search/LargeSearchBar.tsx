"use client";

import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LargeSearchBarProps = {
  isScrolled: boolean;
};

export default function LargeSearchBar({ isScrolled }: LargeSearchBarProps) {
  const router = useRouter();
  
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = () => {
    // Navigate with query params. (Using location param to match SearchPage data mapping)
    const params = new URLSearchParams();
    if (where) params.set("location", where);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    
    router.push(`/search?${params.toString()}`);
  };

  const fields = [
    { id: "where", label: "Where", placeholder: "Search destinations...", icon: MapPin, value: where, onChange: setWhere },
    { id: "check-in", label: "Check in", placeholder: "Add dates", icon: Calendar, value: checkIn, onChange: setCheckIn },
    { id: "check-out", label: "Check out", placeholder: "Add dates", icon: Calendar, value: checkOut, onChange: setCheckOut },
    { id: "guests", label: "Guests", placeholder: "Add guests", icon: Users, value: guests, onChange: setGuests },
  ];

  return (
    <div
      className={`w-full max-w-4xl transition-all duration-500 ease-in-out ${
        isScrolled
          ? "pointer-events-none -translate-y-14 scale-[0.85] opacity-0"
          : "translate-y-0 scale-100 opacity-100"
      }`}
    >
      <div className="rounded-full border border-[#dddddd] bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
        <div className="grid gap-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-stretch">
          {fields.map((field, index) => {
            const Icon = field.icon;

            return (
              <label
                key={field.id}
                className={`group flex min-h-16 cursor-text items-center rounded-full px-4 transition-colors focus-within:bg-[#f7f7f7] hover:bg-[#f7f7f7] ${
                  index < fields.length - 1 ? "md:border-r md:border-[#efefef]" : ""
                }`}
              >
                <Icon className="mr-2 h-4 w-4 text-[#9b9b9b] transition-colors group-focus-within:text-[#222222]" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold text-[#222222]">{field.label}</span>
                  <input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full bg-transparent text-sm text-[#6a6a6a] outline-none placeholder:text-[#9b9b9b]"
                    placeholder={field.placeholder}
                    aria-label={field.label}
                  />
                </span>
              </label>
            );
          })}

          <button
            type="button"
            onClick={handleSearch}
            className="mx-1 my-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#ff385c] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#e23252]"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}