"use client";

import { MenuIcon, UserIcon } from "@/components/havenIcons";
import { navLinks } from "@/components/homeData";

type HavenNavbarProps = {
  ready: boolean;
  scrolled: boolean;
};

export default function HavenNavbar({ ready, scrolled }: HavenNavbarProps) {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] h-[68px] border-b px-[clamp(20px,5vw,56px)]"
      style={{
        background: scrolled ? "rgba(250,248,245,0.95)" : "#FAF8F5",
        borderColor: scrolled ? "#EDE8E2" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all .3s ease",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between gap-4">
        <div className="flex items-center gap-2" style={{ opacity: ready ? 1 : 0, transition: "opacity .5s ease .1s" }}>
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#E07B54] text-base font-bold text-white font-display">H</div>
          <span className="text-[21px] font-bold tracking-[0.01em] font-display">Haven</span>
        </div>

        <div className="hidden items-center gap-8 md:flex" style={{ opacity: ready ? 1 : 0, transition: "opacity .5s ease .2s" }}>
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-[#78716C] transition-colors hover:text-[#1C1917]">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2" style={{ opacity: ready ? 1 : 0, transition: "opacity .5s ease .3s" }}>
          <button className="flex items-center gap-2 rounded-[24px] border border-[#EDE8E2] bg-white px-3 py-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:bg-[#F5F0EC]" aria-label="Menu">
            <MenuIcon />
            <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#FDF0EA] text-[#E07B54]">
              <UserIcon />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}