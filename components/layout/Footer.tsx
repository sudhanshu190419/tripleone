export default function Footer() {
  const footerColumns = [
    {
      title: "Support",
      links: ["Help Center", "Cancellation options", "Neighborhood support", "Trust and safety"],
    },
    {
      title: "Hosting",
      links: ["Become a host", "Host resources", "Community forum", "Responsible hosting"],
    },
    {
      title: "Stayfinder",
      links: ["Newsroom", "Careers", "Investors", "Gift cards"],
    },
  ];

  return (
    <footer className="border-t border-[#e5e5e5] bg-[#f7f7f7] px-4 py-10 sm:px-6 lg:px-10">
      
      {/* 🔹 TOP SECTION */}
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-[#222222] mb-3">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[#6a6a6a] hover:text-[#222222] transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔹 BOTTOM SECTION */}
      <div className="mx-auto mt-8 flex w-full max-w-[1400px] flex-col gap-3 border-t border-[#e5e5e5] pt-5 text-sm text-[#6a6a6a] sm:flex-row sm:items-center sm:justify-between">
        
        <p>© 2026 Stayfinder, Inc.</p>

        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Sitemap</a>
        </div>

      </div>
    </footer>
  );
}