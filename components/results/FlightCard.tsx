"use client";

import { motion } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { FlightInfo } from "@/types/travel";

interface FlightCardProps {
  flights: FlightInfo;
}

export default function FlightCard({ flights }: FlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal/10">
          <HiOutlinePaperAirplane className="w-5 h-5 text-teal" />
        </div>
        <h3 className="text-lg font-semibold">Flights</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-dark uppercase tracking-wider mb-1">
            Route
          </p>
          <p className="text-foreground font-medium">{flights.route}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-dark uppercase tracking-wider mb-1">
              Avg. Cost
            </p>
            <p className="text-xl font-bold gradient-text">{flights.avg_cost}</p>
          </div>
          <div>
            <p className="text-xs text-muted-dark uppercase tracking-wider mb-1">
              Duration
            </p>
            <p className="text-foreground font-medium">{flights.duration}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
