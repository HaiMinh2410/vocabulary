import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocab OS | Learning Dashboard",
  description: "A premium context-aware vocabulary learning operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full bg-[#f8fafc] text-[#1A1A1A]`} suppressHydrationWarning>
        <div className="flex min-h-screen" suppressHydrationWarning>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
