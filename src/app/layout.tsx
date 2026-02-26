import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pantry Chef - Recipe & Meal Planner",
  description: "Find recipes based on your pantry ingredients and plan your meals",
  manifest: "/manifest.json",
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
