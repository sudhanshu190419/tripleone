"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "./AdminGuard";
const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Add Property",
    path: "/admin/add-property",
  },
  {
    name: "Manage Properties",
    path: "/admin/properties",
  },
  {
    name: "Availability",
    path: "/admin/availability",
  },
  {
    name: "Locations",
    path: "/admin/settings/locations",
  },
  {
    name: "Categories",
    path: "/admin/settings/categories",
  },
  {
    name: "Carousel",
    path: "/admin/settings/carousel",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-[#fafafa] md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-b bg-white p-3 md:w-[260px] md:border-b-0 md:border-r md:p-6">
        <h1 className="text-base font-bold sm:text-2xl md:mb-10">
          Haven Admin
        </h1>

        <nav className="mt-3 flex flex-wrap gap-2 pb-2 md:mt-0 md:flex-col md:space-y-3 md:gap-0 md:pb-0">
          {menuItems.map((item) => {
            const active =
              pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`shrink-0 whitespace-nowrap border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold leading-tight text-neutral-700 rounded-lg transition md:block md:px-4 md:py-3 md:text-sm md:rounded-xl md:border-transparent md:bg-transparent md:text-inherit ${
                  active
                    ? "bg-black text-white"
                    : "hover:bg-neutral-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
    </AdminGuard>
  );
}