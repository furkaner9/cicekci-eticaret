import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: "Çiçek Dükkanım - Taze Çiçek Siparişi",
  description: "Taze ve kaliteli çiçeklerle sevdiklerinize özel anlar yaşatın",
  openGraph: {
    title: "Çiçek Dükkanım - Taze Çiçek Siparişi",
    description: "Taze ve kaliteli çiçeklerle sevdiklerinize özel anlar yaşatın",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Çiçek Dükkanım - Taze Çiçek Siparişi",
    description: "Taze ve kaliteli çiçeklerle sevdiklerinize özel anlar yaşatın",
  },
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
        <Toaster richColors />
      </body>
    </html>
  );
}