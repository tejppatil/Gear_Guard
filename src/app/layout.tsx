import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GearGuard - Maintenance Tracker",
  description: "Ultimate Maintenance Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row",
          inter.variable
        )}
      >
        <Sidebar />
        <main className="flex-1 w-full overflow-y-auto h-screen p-4 md:p-8 pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
