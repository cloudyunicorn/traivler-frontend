"use client";

import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import { CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  summary: string;
  origin: string;
  destination: string;
  days: number;
  travelers: number;
}

export default function SummaryCard({
  summary,
  origin,
  destination,
  days,
  travelers,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-[60px]" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 blur-[40px]" />

      <CardContent className="relative pt-8 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineSparkles className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Trip Summary
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {origin} → {destination}
        </h2>
        <p className="text-white/70 text-sm mb-4">
          {days} days · {travelers} traveler{travelers > 1 ? "s" : ""}
        </p>

        <p className="text-white/90 leading-relaxed">{summary}</p>
      </CardContent>
    </motion.div>
  );
}
