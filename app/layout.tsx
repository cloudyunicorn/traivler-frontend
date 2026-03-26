import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Traivler — AI Travel Planner",
  description:
    "Plan your perfect trip with AI-powered travel planning. Get personalized flights, hotels, and day-by-day itineraries in seconds.",
  keywords: ["travel", "AI", "trip planner", "flights", "hotels", "itinerary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
