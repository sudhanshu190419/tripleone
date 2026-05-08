import { Camera, MessageCircle, MapPin, Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Explore Stays", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const CONTACT = [
  { icon: Mail, text: "swapniltripleone@gmail.com", href: "mailto:swapniltripleone@gmail.com" },
  { icon: Phone, text: "+91 93111 49346", href: "tel:+919311149346" },
  { icon: MapPin, text: "Delhi / Noida, India", href: "#" },
];

const SOCIAL = [
  {
    icon: Camera,
    label: "Instagram",
    href: "#",
    hoverBg: "hover:bg-[#E1306C]",
    hoverText: "hover:text-white",
  },
  {
    icon: Globe,
    label: "Facebook",
    href: "#",
    hoverBg: "hover:bg-[#1877F2]",
    hoverText: "hover:text-white",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "#",
    hoverBg: "hover:bg-[#25D366]",
    hoverText: "hover:text-white",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative bg-[#FAF8F5] border-t border-[#EAE4DC] overflow-hidden">
      {/* Subtle warm top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E07B54]/30 to-transparent" />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-[1400px] px-6 pt-12 pb-8 lg:pt-14 lg:pb-10 lg:px-10
                   grid grid-cols-1 gap-10
                   md:grid-cols-2
                   lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12"
      >
        {/* ── Col 1: Brand ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Wordmark */}
          <div className="relative h-14 w-40 sm:h-16 sm:w-44">
            <Image
              src="/logo2.svg"
              alt="TripleOne"
              width={180}
              height={60}
              className="h-full w-auto object-contain"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="text-[12px] sm:text-[13px] font-medium tracking-[0.18em] text-[#9C8E82] uppercase mt-1">
            Stay&nbsp;·&nbsp;Experience&nbsp;·&nbsp;Partners
          </p>

          {/* Brand descriptor */}
          <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#7A6E65] max-w-[280px] lg:max-w-[240px]">
            Handpicked homestays and stays across India's finest neighbourhoods.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 sm:gap-2.5 mt-3">
            {SOCIAL.map(({ icon: Icon, label, href, hoverBg, hoverText }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={[
                  "w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center",
                  "border border-[#DDD6CD] text-[#8C7E74]",
                  "transition-all duration-200 ease-out",
                  "hover:scale-110 hover:border-transparent hover:shadow-sm",
                  hoverBg,
                  hoverText,
                ].join(" ")}
              >
                <Icon size={16} strokeWidth={1.8} className="sm:w-[15px] sm:h-[15px]" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Col 2: Links ──────────────────────────────────────────────── */}
        <div>
          <h3 className="text-[11px] sm:text-[12px] tracking-[0.12em] text-[#1C1917] uppercase mb-4 sm:mb-5 font-bold">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-1 sm:gap-3">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="group inline-flex items-center gap-1.5 text-[14px] sm:text-[13.5px] text-[#7A6E65]
                             font-medium transition-colors duration-150 hover:text-[#E07B54] py-1.5 sm:py-0"
                >
                  <span
                    className="w-0 h-[1.5px] bg-[#E07B54] transition-all duration-200
                               group-hover:w-3 rounded-full"
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Contact ────────────────────────────────────────────── */}
        <div>
          <h3 className="text-[11px] sm:text-[12px] tracking-[0.12em] text-[#1C1917] uppercase mb-4 sm:mb-5 font-bold">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-2 sm:gap-4">
            {CONTACT.map(({ icon: Icon, text, href }) => (
              <li key={text}>
                <a
                  href={href}
                  className="group flex items-start gap-3 text-[14px] sm:text-[13.5px] text-[#7A6E65]
                             font-medium transition-colors duration-150 hover:text-[#E07B54] py-1.5 sm:py-0"
                >
                  <span
                    className="mt-[2px] sm:mt-[1px] flex-shrink-0 w-[32px] h-[32px] sm:w-[30px] sm:h-[30px] rounded-lg
                               bg-[#F0EBE4] border border-[#E4DDD4] flex items-center justify-center
                               transition-all duration-200 group-hover:bg-[#E07B54]/10
                               group-hover:border-[#E07B54]/25"
                  >
                    <Icon
                      size={14}
                      strokeWidth={1.8}
                      className="text-[#C07850] group-hover:text-[#E07B54] transition-colors duration-150 sm:w-[13px] sm:h-[13px]"
                    />
                  </span>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div
          className="border-t border-[#E8E1D8] py-6 sm:py-5
                     flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[12px] text-[#A89890] font-medium text-center sm:text-left">
            © {new Date().getFullYear()} TripleOne. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-2 gap-y-2 text-[12px] text-[#A89890]">
            {["Privacy Policy", "Terms", "Sitemap"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                <a href="#" className="hover:text-[#E07B54] transition-colors duration-150 font-medium px-1 sm:px-0">
                  {item}
                </a>
                {i < arr.length - 1 && (
                  <span className="text-[#D4CAC0] select-none">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}