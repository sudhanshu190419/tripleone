"use client";
import { useState } from "react";

// Professional SVG alternatives to emojis
const AMENITIES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    label: "High-speed WiFi",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    label: "Fully equipped kitchen",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    label: "Free parking",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Smart TV",
  },
];

interface Property {
  location: string;
  description: string;
  hostName?: string;
  address?: string;
  phone?: string;
  email?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function PropertyInfo({ property }: { property: Property }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Highlights / Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pb-6 sm:pb-8 border-b border-neutral-100">
        {[
          {
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            ),
            title: "Premium Host",
            desc: "Top-rated for excellence.",
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            title: "Prime Location",
            desc: "Perfect for exploration.",
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            ),
            title: "Keyless Entry",
            desc: "Secure digital access.",
          },
        ].map((h, i) => (
          <div key={i} className="flex flex-col items-center text-center rounded-2xl border border-neutral-100 bg-neutral-50/70 px-4 py-4 sm:px-5 sm:py-5">
            <span className="mb-3 text-zinc-900">{h.icon}</span>
            <h3 className="font-semibold text-sm text-neutral-900 mb-1">{h.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* ── HOTEL INFORMATION ── */}
      <section>
        {/* Section heading + badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Hotel Information</h2>
          <span
            className="text-[10px] sm:text-[11px] font-semibold tracking-wide px-2.5 sm:px-3 py-1 rounded-full"
            style={{ background: "#FAECE7", color: "#993C1D" }}
          >
            Open now
          </span>
        </div>

        {/* Main card wrapper */}
        <div className="rounded-[22px] sm:rounded-2xl overflow-hidden border border-[#E07B54] bg-white shadow-[0_30px_90px_rgba(17,24,39,0.14),0_12px_30px_rgba(224,123,84,0.12),0_2px_8px_rgba(17,24,39,0.08)]">

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">

            {/* ── Contact ── */}
            <div className="bg-white p-5 sm:p-6">
              <p
                className="text-[11px] font-semibold tracking-widest uppercase mb-3"
                style={{ color: "#D85A30" }}
              >
                Contact
              </p>

              {/* Address */}
              <div className="flex items-start gap-3 mb-2">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-neutral-700 leading-relaxed">{property.address}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-4" />

              {/* Phone */}
              <div className="flex items-start gap-3 mb-3">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h2l3.6 7.59a1 1 0 01-.21 1.09l-2.3 2.3a16 16 0 006.59 6.59l2.3-2.3a1 1 0 011.09-.21L19 19v2a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1z" />
                </svg>
                <div>
                  <a
                    href={`tel:${property.phone}`}
                    className="text-sm font-medium text-neutral-900 hover:text-[#D85A30] transition-colors"
                  >
                    {property.phone}
                  </a>
                  <p className="text-xs text-neutral-600 mt-0.5">24/7 front desk</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-neutral-700">{property.email}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">Replies within 2 hours</p>
                </div>
              </div>
            </div>

            {/* ── Check-in / Check-out ── */}
            <div className="bg-white p-5 sm:p-6">
              <p
                className="text-[11px] font-semibold tracking-widest uppercase mb-4 sm:mb-5"
                style={{ color: "#D85A30" }}
              >
                Check-in &amp; Check-out
              </p>

              {/* Time rows */}
              {[
                { label: "Check-in from", value: property.checkIn ?? "3:00 PM" },
                { label: "Check-out by", value: property.checkOut ?? "11:00 AM" },
                
              ].map((row, i, arr) => (
                <div
                  key={i}
                  className={`flex flex-wrap items-center gap-x-2 gap-y-1 py-3 ${
                    i < arr.length - 1 ? "border-b border-neutral-100" : ""
                  }`}
                >
                  <span className="text-sm text-neutral-500">{row.label}</span>
                  <span className="text-sm text-neutral-300" aria-hidden="true">-</span>
                  <span className="text-sm font-semibold text-neutral-900 text-right">{row.value}</span>
                </div>
              ))}

              {/* ID notice */}
              <div className="mt-4 sm:mt-5 flex items-start gap-2.5 rounded-xl bg-neutral-50 border border-neutral-100 px-4 py-2.5">
                <svg
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  A valid government-issued photo ID is required at check-in for all guests.
                </p>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center gap-2 px-6 py-3.5 bg-neutral-50 border-t border-neutral-100">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Verified property — identity and licensing confirmed by our trust team.
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <div className="pb-7 sm:pb-8 border-b border-neutral-100">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-3 sm:mb-4">About this space</h2>
        <div className={`relative ${!expanded && "max-h-32 overflow-hidden"}`}>
          <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-line">
            {property.description}
          </p>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-1"
        >
          {expanded ? "Read less" : "Read more"}
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Amenities List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-5 sm:mb-6">Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-8">
          {AMENITIES.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-neutral-700">
              <span className="text-neutral-600">{a.icon}</span>
              <span className="text-sm font-medium">{a.label}</span>
            </div>
          ))}
        </div>
        <button className="mt-6 sm:mt-8 w-full sm:w-auto px-6 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 hover:border-neutral-900 transition-colors">
          View all amenities
        </button>
      </div>
    </div>
  );
}