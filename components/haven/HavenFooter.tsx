import { footerColumns } from "@/components/homeData";

export default function HavenFooter() {
  return (
    <footer className="border-t border-[#EDE8E2] bg-white px-[clamp(20px,5vw,56px)] pb-7 pt-[52px]">
      <div className="mx-auto mb-11 grid w-full max-w-[1760px] gap-9 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <div className="font-display flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E07B54] text-[15px] font-bold text-white">H</div>
            <span className="font-display text-[19px] font-bold text-[#1C1917]">Haven</span>
          </div>
          <p className="max-w-[200px] text-[13px] leading-[1.7] text-[#A8A29E]">Curating the world's most extraordinary places to stay.</p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1C1917]">{column.title}</div>
            {column.links.map((link) => (
              <div key={link} className="mb-2.5">
                <a href="#" className="text-[13px] font-normal text-[#A8A29E] transition-colors hover:text-[#1C1917]">
                  {link}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-[1760px] flex-wrap items-center justify-between gap-3 border-t border-[#EDE8E2] pt-[22px]">
        <span className="text-xs text-[#C4BAB4]">© 2025 Haven, Inc. All rights reserved.</span>
        <div className="flex gap-[22px]">
          {"Privacy|Terms|Sitemap".split("|").map((label) => (
            <a key={label} href="#" className="text-xs text-[#C4BAB4] transition-colors hover:text-[#78716C]">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}