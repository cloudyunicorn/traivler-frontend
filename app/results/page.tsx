"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { TravelResponse, TravelRequest } from "@/types/travel";
import SummaryCard from "@/components/results/SummaryCard";
import FlightCard from "@/components/results/FlightCard";
import HotelCard from "@/components/results/HotelCard";
import ItineraryTimeline from "@/components/results/ItineraryTimeline";
import CostBreakdown from "@/components/results/CostBreakdown";
import { HiOutlineArrowPath, HiOutlineArrowLeft } from "react-icons/hi2";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<TravelResponse | null>(null);
  const [request, setRequest] = useState<TravelRequest | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tripResult");
    const storedReq = sessionStorage.getItem("tripRequest");

    if (stored && storedReq) {
      try {
        setResult(JSON.parse(stored));
        setRequest(JSON.parse(storedReq));
      } catch {
        router.push("/plan");
      }
    } else {
      router.push("/plan");
    }
  }, [router]);

  if (!result || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-muted-foreground">Loading results…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold">
              Your Trip to{" "}
              <span className="gradient-text-accent">{request.destination}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s your AI-crafted travel plan
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/plan"
              className="btn-secondary py-2! px-4! text-sm! flex items-center gap-2"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> New Trip
            </Link>
            <button
              onClick={() => router.push("/plan")}
              className="btn-primary py-2! px-4! text-sm! flex items-center gap-2"
            >
              <HiOutlineArrowPath className="w-4 h-4" /> Re-plan
            </button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="space-y-6">
          {/* Summary */}
          <SummaryCard
            summary={result.summary}
            origin={request.origin}
            destination={request.destination}
            days={request.days}
            travelers={request.travelers}
          />

          {/* Flight + Hotel side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FlightCard flights={result.flights} />
            <HotelCard hotels={result.hotels} />
          </div>

          {/* Itinerary */}
          <ItineraryTimeline itinerary={result.itinerary} />

          {/* Cost Breakdown */}
          <CostBreakdown costs={result.cost_breakdown} />
        </div>
      </div>
    </div>
  );
}
