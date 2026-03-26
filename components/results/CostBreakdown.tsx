"use client";

import { motion } from "framer-motion";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { CostBreakdown as CostBreakdownType } from "@/types/travel";

interface CostBreakdownProps {
  costs: CostBreakdownType;
}

export default function CostBreakdown({ costs }: CostBreakdownProps) {
  const items = [
    { label: "Flights", value: costs.flights, color: "#2dd4bf" },
    { label: "Hotels", value: costs.hotels, color: "#a78bfa" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10">
          <HiOutlineBanknotes className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold">Cost Breakdown</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 border-b border-card-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-muted text-sm">{item.label}</span>
            </div>
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
        ))}

        {/* Total */}
        <div className="pt-2 flex items-center justify-between">
          <span className="font-semibold text-foreground">Total Estimate</span>
          <span className="text-2xl font-bold gradient-text">
            {costs.total_estimate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
