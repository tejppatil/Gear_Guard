import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedLayout from "@/components/ProtectedLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GearGuard - Maintenance Tracker",
  description: "Efficiently manage equipment and maintenance requests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedLayout>
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                {children}
              </main>
            </div>
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
