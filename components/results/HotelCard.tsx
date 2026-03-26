"use client";

import { motion } from "framer-motion";
import { HiOutlineBuildingOffice, HiOutlineMapPin } from "react-icons/hi2";
import { HotelInfo } from "@/types/travel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotels: HotelInfo;
}

export default function HotelCard({ hotels }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={cn("glass-card border-0 ring-0")}>
        <CardHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple/10">
              <HiOutlineBuildingOffice className="w-5 h-5 text-purple" />
            </div>
            <h3 className="text-lg font-semibold">Hotels</h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Avg. Price / Night
            </p>
            <p className="text-xl font-bold gradient-text-accent">
              {hotels.avg_price_per_night}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Suggested Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {hotels.suggested_areas.map((area, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-sm px-3 py-1.5 h-auto rounded-full border-card-border text-muted-foreground gap-1"
                >
                  <HiOutlineMapPin className="w-3 h-3 text-purple" />
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
