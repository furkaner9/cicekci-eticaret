import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner"; // ✅ Sonner Toaster importu

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Çiçek Dükkanım - Taze Çiçek Siparişi",
  description: "Taze ve kaliteli çiçeklerle sevdiklerinize özel anlar yaşatın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster /> {/* ✅ Toast mesajlarını gösterecek bileşen */}
      </body>
    </html>
  );
}
