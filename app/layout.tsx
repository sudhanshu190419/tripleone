import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { cormorant } from "@/lib/fonts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Haven",
  description: "Curated stays and travel experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
  className={`${inter.className} ${cormorant.variable} min-h-full flex flex-col`}
>
        <Navbar isScrolled={false} forceSearch />
        {children}
      </body>
    </html>
  );
}
