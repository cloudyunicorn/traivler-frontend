"use client";

import { motion } from "framer-motion";
import { HiOutlineBuildingOffice, HiOutlineMapPin } from "react-icons/hi2";
import { HotelInfo } from "@/types/travel";

interface HotelCardProps {
  hotels: HotelInfo;
}

export default function HotelCard({ hotels }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple/10">
          <HiOutlineBuildingOffice className="w-5 h-5 text-purple" />
        </div>
        <h3 className="text-lg font-semibold">Hotels</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-dark uppercase tracking-wider mb-1">
            Avg. Price / Night
          </p>
          <p className="text-xl font-bold gradient-text">
            {hotels.avg_price_per_night}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-dark uppercase tracking-wider mb-2">
            Suggested Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {hotels.suggested_areas.map((area, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-card border border-card-border text-muted"
              >
                <HiOutlineMapPin className="w-3 h-3 text-purple" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
