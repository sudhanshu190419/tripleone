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
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminGuard>
    <div className="min-h-screen flex bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-[260px] border-r bg-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          Haven Admin
        </h1>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const active =
              pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-xl transition ${
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
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
    </AdminGuard>
  );
}