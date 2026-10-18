import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { BookingCartProvider } from "@/components/booking/BookingCartProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Hunza Expeditions — Custom Tourism & Journeys in Gilgit-Baltistan",
    template: "%s | Hunza Expeditions",
  },
  description:
    "Plan and arrange well-organized journeys through northern Pakistan, combining dramatic Karakoram landscapes and heritage with authentic community-hosted experiences.",
  keywords: [
    "Hunza Valley tours",
    "Gilgit-Baltistan travel",
    "Pakistan expeditions",
    "Passu Cones",
    "Baltit Fort",
    "Attabad Lake",
    "Skardu travel",
    "Karakoram Highway",
  ],
  authors: [{ name: "Hunza Expeditions" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Hunza Expeditions — Custom Tourism & Journeys in Gilgit-Baltistan",
    description:
      "Plan well-organized journeys through northern Pakistan with local expertise, clear expectations, and confirmed arrangements.",
    siteName: "Hunza Expeditions",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <div className={`website-shell min-h-full flex flex-col bg-[#fbfaf7] text-stone-900 selection:bg-[#12283a] selection:text-white ${inter.variable}`} style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <BookingCartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        </BookingCartProvider>
        </div>
      </body>
    </html>
  );
}
