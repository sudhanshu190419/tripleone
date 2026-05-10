"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";

const PALETTE = {
  base: "#FCF7F0",
  tint: "#E8DDD2",
  accent: "#E07B54",
};

type UnavailableDate = {
  date: string;
  reason?: string;
  guestName?: string;
  guestPhone?: string;
  status?: "Confirmed" | "Pending" | "Checked-in";
};

type Booking = {
  id: string;
  guest: string;
  start: string;
  end: string;
  status: "Confirmed" | "Pending" | "Checked-in";
};

type PropertyAvailability = {
  id: string;
  title: string;
  location: string;
  price: number;
  images?: string[];
  availability?: boolean;
  unavailableDates?: Array<string | UnavailableDate>;
};

const LOCATION_OPTIONS = ["All", "Delhi", "Noida", "Mumbai"];
const STATUS_OPTIONS = [
  "All",
  "Available",
  "Partially Booked",
  "Fully Blocked",
];

const REASON_OPTIONS = ["Booked", "Maintenance", "Owner blocked", "Custom"] as const;

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "b1",
    guest: "Rahul Sharma",
    start: "2026-05-12",
    end: "2026-05-15",
    status: "Confirmed",
  },
  {
    id: "b2",
    guest: "Priya",
    start: "2026-05-18",
    end: "2026-05-20",
    status: "Pending",
  },
];

const DEMO_PROPERTIES: PropertyAvailability[] = [
  {
    id: "demo-1",
    title: "Moonlight Suites",
    location: "Delhi",
    price: 4800,
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80"],
    availability: true,
    unavailableDates: [
      { date: "2026-05-12", reason: "Booked" },
      { date: "2026-05-15", reason: "Maintenance" },
    ],
  },
  {
    id: "demo-2",
    title: "Haven Noida Loft",
    location: "Noida",
    price: 3200,
    images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80"],
    availability: false,
    unavailableDates: [
      { date: "2026-05-10", reason: "Owner blocked" },
      { date: "2026-05-11", reason: "Owner blocked" },
      { date: "2026-05-12", reason: "Owner blocked" },
    ],
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const normalizeUnavailableDates = (
  list: Array<string | UnavailableDate> | undefined
) => {
  if (!list) return [] as UnavailableDate[];
  return list
    .map((entry) =>
      typeof entry === "string" ? { date: entry, reason: "Booked" } : entry
    )
    .filter((entry) => entry.date);
};

const toLabel = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const buildMonthMatrix = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const totalDays = last.getDate();
  const cells: Array<string | null> = [];
  for (let i = 0; i < startDay; i += 1) cells.push(null);
  for (let day = 1; day <= totalDays; day += 1) {
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    cells.push(iso);
  }
  return { cells, year, month };
};

const getMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

function AvailabilityPreview({
  unavailable,
}: {
  unavailable: UnavailableDate[];
}) {
  const [previewDate, setPreviewDate] = useState(new Date());
  const { cells, year, month } = buildMonthMatrix(previewDate);

  const blockedMap = new Map(
    unavailable.map((entry) => [entry.date, entry.reason || "Booked"])
  );

  const getColor = (reason?: string) => {
    if (!reason) return "bg-[#F8D0C4] text-[#7A2C22]";
    if (reason === "Maintenance") return "bg-[#FAD9A7] text-[#7A4E1D]";
    if (reason === "Owner blocked") return "bg-[#FFD1B8] text-[#7A3C1D]";
    return "bg-[#F8D0C4] text-[#7A2C22]";
  };

  return (
    <div className="rounded-2xl border border-[#F2E9E0] bg-white px-3 py-3">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9C8D80]">
        <span>Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewDate(new Date(year, month - 1, 1))}
            className="rounded-full border border-[#E8DDD2] bg-white px-2 py-0.5 text-[10px]"
          >
            Prev
          </button>
          <span className="text-[10px] text-[#6D6258]">
            {getMonthLabel(new Date(year, month, 1))}
          </span>
          <button
            onClick={() => setPreviewDate(new Date(year, month + 1, 1))}
            className="rounded-full border border-[#E8DDD2] bg-white px-2 py-0.5 text-[10px]"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-[#B2A79D]">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <span key={day} className="text-center">
            {day}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`preview-empty-${index}`} />;
          const day = new Date(`${cell}T00:00:00`).getDate();
          const reason = blockedMap.get(cell);
          const bg = reason ? getColor(reason) : "bg-[#F7F2EC] text-[#6D6258]";
          return (
            <div
              key={cell}
              className={`flex h-6 items-center justify-center rounded-md text-[10px] font-semibold ${bg}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const getNextUnavailable = (dates: UnavailableDate[]) => {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = dates
    .map((d) => d.date)
    .filter((d) => d >= today)
    .sort();
  return upcoming[0] ?? null;
};

export default function AvailabilityPage() {
  const [properties, setProperties] = useState<PropertyAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [activeProperty, setActiveProperty] = useState<PropertyAvailability | null>(null);
  const [workingDates, setWorkingDates] = useState<UnavailableDate[]>([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  const [reason, setReason] = useState<(typeof REASON_OPTIONS)[number]>("Booked");
  const [customReason, setCustomReason] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
const [pendingDate, setPendingDate] = useState<string | null>(null);

const [guestName, setGuestName] = useState("");
const [guestPhone, setGuestPhone] = useState("");
const [bookingStatus, setBookingStatus] = useState<
  "Confirmed" | "Pending" | "Checked-in"
>("Confirmed");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "properties"));
        const data = snapshot.docs.map((docSnap) => {
          const payload = docSnap.data() as PropertyAvailability;
          return {
            ...payload,
            id: docSnap.id,
          };
        });
        setProperties(data.length ? data : DEMO_PROPERTIES);
      } catch (error) {
        console.error(error);
        setProperties(DEMO_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesQuery =
        !normalizedQuery ||
        property.title.toLowerCase().includes(normalizedQuery) ||
        property.location.toLowerCase().includes(normalizedQuery);

      const matchesLocation =
        locationFilter === "All" ||
        property.location.toLowerCase().includes(locationFilter.toLowerCase());

      const unavailable = normalizeUnavailableDates(property.unavailableDates);
      const isFullyBlocked = property.availability === false;
      const status = isFullyBlocked
        ? "Fully Blocked"
        : unavailable.length
        ? "Partially Booked"
        : "Available";

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      const matchesDate =
        !dateFilter ||
        unavailable.some((entry) => entry.date === dateFilter);

      return matchesQuery && matchesLocation && matchesStatus && matchesDate;
    });
  }, [properties, query, locationFilter, statusFilter, dateFilter]);

  const openManageDates = (property: PropertyAvailability) => {
    setActiveProperty(property);
    setWorkingDates(normalizeUnavailableDates(property.unavailableDates));
    
  };

  const closeManageDates = () => {
    setActiveProperty(null);
    
  };

  const applyDatesUpdate = async (nextDates: UnavailableDate[]) => {
    if (!activeProperty) return;
    const next = nextDates
  .map((entry) => ({
    date: entry.date,
    reason: entry.reason || "Booked",
    guestName: entry.guestName || "",
    guestPhone: entry.guestPhone || "",
    status: entry.status || "Confirmed",
  }))
      .sort((a, b) => a.date.localeCompare(b.date));

    try {
      await updateDoc(doc(db, "properties", activeProperty.id), {
        unavailableDates: next,
      });
      setProperties((prev) =>
        prev.map((property) =>
          property.id === activeProperty.id
            ? { ...property, unavailableDates: next }
            : property
        )
      );
      setWorkingDates(next);
    } catch (error) {
      console.error(error);
      setWorkingDates(next);
    }
  };

  const toggleDate = (date: string) => {
  const existing = workingDates.find(
    (entry) => entry.date === date
  );

  // If already blocked → unblock directly
  if (existing) {
    const next = workingDates.filter(
      (entry) => entry.date !== date
    );

    applyDatesUpdate(next);
    return;
  }

  // Open booking form instead of direct block
  setPendingDate(date);
  setShowBookingForm(true);
};

const saveBookingDate = () => {
  if (!pendingDate) return;
if (!guestName.trim()) {
  alert("Please enter guest name");
  return;
}
  const appliedReason =
    reason === "Custom"
      ? customReason || "Custom"
      : reason;

  const next = [
    ...workingDates,
    {
      date: pendingDate,
      reason: appliedReason,
      guestName,
      guestPhone,
      status: bookingStatus,
    },
  ];

  applyDatesUpdate(next);

  setShowBookingForm(false);
  setPendingDate(null);

  setGuestName("");
  setGuestPhone("");
  setBookingStatus("Confirmed");
};

  const handleSelectDate = (date: string) => {
  toggleDate(date);
};

    

  
  

  const { cells, year, month } = buildMonthMatrix(calendarDate);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="rounded-3xl border border-[#EFE7DE] bg-[rgba(255,255,255,0.85)] p-6 shadow-[0_24px_70px_rgba(34,24,16,0.10)] sm:p-10" style={{ background: PALETTE.base }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#B97B5B]">Admin Control</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#1C1917]">
              Manage Availability
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#6D6258]">
              Block dates, manage bookings, and control property availability.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-3xl border border-[#EFE7DE] bg-white/80 p-4 shadow-[0_16px_40px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9C8D80]">Search</label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search property"
                className="mt-2 w-full rounded-2xl border border-[#E8DDD2] bg-[#FCF7F0] px-4 py-3 text-sm text-[#2E2A26] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07B54]/40"
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9C8D80]">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#E8DDD2] bg-[#FCF7F0] px-3 py-3 text-sm text-[#2E2A26]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-44">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9C8D80]">Location</label>
              <select
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#E8DDD2] bg-[#FCF7F0] px-3 py-3 text-sm text-[#2E2A26]"
              >
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-44">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9C8D80]">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#E8DDD2] bg-[#FCF7F0] px-3 py-3 text-sm text-[#2E2A26]"
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-4 lg:gap-5">
          {loading ? (
            <div className="rounded-3xl border border-[#EFE7DE] bg-white p-6 shadow-[0_20px_50px_rgba(28,25,23,0.08)]">
              <div className="h-6 w-48 rounded-full bg-[#EDE5DB] animate-pulse" />
              <div className="mt-6 h-20 rounded-2xl bg-[#F4ECE3] animate-pulse" />
            </div>
          ) : filteredProperties.length ? (
            filteredProperties.map((property) => {
              const unavailable = normalizeUnavailableDates(property.unavailableDates);
              const nextUnavailable = getNextUnavailable(unavailable);
              const status = property.availability === false
                ? "Fully Blocked"
                : unavailable.length
                ? "Partially Booked"
                : "Available";

              return (
                <div
                  key={property.id}
                  className="flex flex-col gap-4 rounded-3xl border border-[#EFE7DE] bg-white/90 p-4 shadow-[0_18px_42px_rgba(28,25,23,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#F4ECE3] shadow-inner">
                      {property.images?.[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" style={{ background: PALETTE.tint }} />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[#1C1917]">{property.title}</p>
                      <p className="text-sm text-[#6D6258]">{property.location}</p>
                      <p className="text-sm font-semibold text-[#B65D34]">{formatPrice(property.price)} / night</p>
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl border border-[#F2E9E0] bg-[#FCF7F0] px-4 py-3 text-sm text-[#4B4036]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9C8D80]">Availability</p>
                    <p className="mt-2 text-sm font-semibold text-[#1C1917]">{status}</p>
                    <p className="mt-1 text-xs text-[#6D6258]">
                      {unavailable.length
                        ? `${unavailable.length} blocked dates`
                        : "Fully available"}
                    </p>
                    {nextUnavailable && (
                      <p className="mt-1 text-xs text-[#6D6258]">
                        Next unavailable: {toLabel(nextUnavailable)}
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:w-[240px]">
                    <AvailabilityPreview unavailable={unavailable} />
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <button
                      onClick={() => openManageDates(property)}
                      className="rounded-full border border-[#E8DDD2] bg-white px-5 py-2 text-sm font-semibold text-[#1C1917] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Manage Dates
                    </button>
                    <button
                      onClick={() => openManageDates(property)}
                      className="rounded-full bg-[#1C1917] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
                    >
                      View Calendar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-[#EFE7DE] bg-white p-6 text-center text-sm text-[#6D6258]">
              No properties match these filters yet.
            </div>
          )}
        </div>
      </div>

      {/* Manage dates panel */}
      {activeProperty && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeManageDates}
          />
          <div
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-[0_-16px_40px_rgba(28,25,23,0.25)] sm:right-0 sm:top-0 sm:h-full sm:w-[440px] sm:max-h-none sm:rounded-none"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B97B5B]">Availability</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#1C1917]">{activeProperty.title}</h2>
                <p className="text-sm text-[#6D6258]">{activeProperty.location}</p>
              </div>
              <button
                onClick={closeManageDates}
                className="h-9 w-9 rounded-full border border-[#E8DDD2] bg-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-[#EFE7DE] bg-[#FCF7F0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9C8D80]">Calendar</p>
                  <p className="mt-1 text-base font-semibold text-[#1C1917]">
                    {new Date(year, month).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                    className="rounded-full border border-[#E8DDD2] bg-white px-3 py-1 text-xs"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                    className="rounded-full border border-[#E8DDD2] bg-white px-3 py-1 text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-[#9C8D80]">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2">
                {cells.map((cell, index) => {
                  if (!cell) {
                    return <div key={`empty-${index}`} />;
                  }
                  const blocked = workingDates.find((entry) => entry.date === cell);
                  
                  const badge = blocked ? "blocked" : "available";
                  const background = blocked
                    ? "bg-[#F8D0C4] text-[#7A2C22]"
                    : "bg-white text-[#1C1917]";
                  

                  return (
                    <button
                      key={cell}
                      onClick={() => handleSelectDate(cell)}
                      className={`h-10 rounded-xl border border-[#EDE5DB] text-xs font-semibold transition hover:scale-[1.03] ${background}`}
                    >
                      {new Date(`${cell}T00:00:00`).getDate()}
                      {badge === "blocked" && (
  <span className="block text-[9px] font-medium text-[#7A2C22] truncate px-1">
    {blocked?.guestName || "Blocked"}
  </span>
)}
                    </button>
                  );
                })}
              </div>
            </div>

                        {showBookingForm && (
  <div className="mt-6 rounded-2xl border border-[#EFE7DE] bg-[#FCF7F0] p-4">
    <div className="flex items-center justify-between">
  <div>
    <h3 className="text-sm font-semibold text-[#1C1917]">
      Add Booking Details
    </h3>

    {pendingDate && (
      <p className="mt-1 text-xs text-[#6D6258]">
        Selected date:
        <span className="ml-1 font-semibold text-[#B65D34]">
          {toLabel(pendingDate)}
        </span>
      </p>
    )}
  </div>

  
</div>

    <div className="mt-4 grid gap-3">
      <input
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Guest name"
        className="w-full rounded-xl border border-[#E8DDD2] bg-white px-3 py-2 text-sm"
      />
      <input
  type="tel"
  value={guestPhone}
  onChange={(e) => setGuestPhone(e.target.value)}
  placeholder="Guest phone number"
  className="w-full rounded-xl border border-[#E8DDD2] bg-white px-3 py-2 text-sm"
/>

      <select
        value={bookingStatus}
        onChange={(e) =>
          setBookingStatus(
            e.target.value as
              | "Confirmed"
              | "Pending"
              | "Checked-in"
          )
        }
        className="w-full rounded-xl border border-[#E8DDD2] bg-white px-3 py-2 text-sm"
      >
        <option>Confirmed</option>
        <option>Pending</option>
        <option>Checked-in</option>
      </select>

      <div className="flex gap-2">
        <button
          onClick={saveBookingDate}
          className="rounded-full bg-[#E07B54] px-4 py-2 text-xs font-semibold text-white"
        >
          Save Booking
        </button>

        <button
          onClick={() => {
  setShowBookingForm(false);
  setPendingDate(null);
  setGuestName("");
  setBookingStatus("Confirmed");
}}
          className="rounded-full border border-[#E8DDD2] bg-white px-4 py-2 text-xs font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

            <div className="mt-6 rounded-2xl border border-[#EFE7DE] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#1C1917]">Upcoming Bookings</h3>
              <div className="mt-3 space-y-3">
                {workingDates.map((booking, index) => (
                  <div
                    key={`${booking.date}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-[#EDE5DB] bg-[#FCF7F0] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#E8DDD2]" />
                      <div>
                        <p className="text-sm font-semibold text-[#1C1917]">
                          {booking.guestName || "Guest"}
                        </p>
                        <div className="mt-1 space-y-0.5">
  <p className="text-xs text-[#6D6258]">
    {toLabel(booking.date)}
  </p>

  {booking.guestPhone && (
    <p className="text-xs font-medium text-[#B65D34]">
      {booking.guestPhone}
    </p>
  )}
</div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        booking.status === "Confirmed"
                          ? "bg-[#E6F4EA] text-[#2E7D32]"
                          : booking.status === "Pending"
                          ? "bg-[#FFF4EC] text-[#B65D34]"
                          : "bg-[#EAF0FF] text-[#3B5FCC]"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
