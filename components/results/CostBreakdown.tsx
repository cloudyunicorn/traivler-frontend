"use client";

import { motion } from "framer-motion";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { CostBreakdown as CostBreakdownType } from "@/types/travel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  costs: CostBreakdownType;
}

export default function CostBreakdown({ costs }: CostBreakdownProps) {
  const items = [
    { label: "Flights", value: costs.flights, color: "#0d9488" },
    { label: "Hotels", value: costs.hotels, color: "#9333ea" },
    { label: "Food & Dining", value: costs.food, color: "#f59e0b" },
    { label: "Local Transport", value: costs.local_transport, color: "#3b82f6" },
    { label: "Activities & Sightseeing", value: costs.activities, color: "#f43f5e" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="min-w-0"
    >
      <Card className={cn("glass-card border-0 ring-0 min-w-0")}>
        <CardHeader className="pb-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-500/10">
              <HiOutlineBanknotes className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold truncate">Cost Breakdown</h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-1 min-w-0">
          {items.map((item, i) => (
            <div key={item.label}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-muted-foreground text-sm truncate">{item.label}</span>
                </div>
                <span className="font-medium text-foreground sm:text-right break-words">{item.value}</span>
              </div>
              {i < items.length - 1 && <Separator className="bg-border/50" />}
            </div>
          ))}

          <Separator className="bg-border/50" />

          {/* Total */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="font-semibold text-foreground shrink-0">Total Estimate</span>
            <span className="text-2xl font-bold gradient-text-accent sm:text-right break-words">
              {costs.total_estimate}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
