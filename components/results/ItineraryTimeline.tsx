"use client";

import { motion } from "framer-motion";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { DayPlan } from "@/types/travel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ItineraryTimelineProps {
  itinerary: DayPlan[];
}

export default function ItineraryTimeline({
  itinerary,
}: ItineraryTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className={cn("glass-card border-0 ring-0")}>
        <CardHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10">
              <HiOutlineCalendarDays className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-teal to-purple" />

            <div className="space-y-6">
              {itinerary.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${
                          index % 3 === 0
                            ? "#4f46e5"
                            : index % 3 === 1
                            ? "#0d9488"
                            : "#9333ea"
                        }, ${
                          index % 3 === 0
                            ? "#3730a3"
                            : index % 3 === 1
                            ? "#0f766e"
                            : "#7e22ce"
                        })`,
                      }}
                    >
                      {day.day}
                    </div>
                  </div>

                  {/* Day content */}
                  <div className="flex-1 pb-2">
                    <h4 className="font-semibold text-foreground mb-2">
                      Day {day.day}
                    </h4>
                    <ul className="space-y-1.5">
                      {day.activities.map((activity, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-accent mt-0.5">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
