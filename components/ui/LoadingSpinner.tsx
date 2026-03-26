"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice,
  HiOutlineMapPin,
  HiOutlineSparkles,
} from "react-icons/hi2";

const stages = [
  { icon: HiOutlinePaperAirplane, text: "Searching flights…", color: "#f97316" },
  { icon: HiOutlineBuildingOffice, text: "Finding hotels…", color: "#2dd4bf" },
  { icon: HiOutlineMapPin, text: "Discovering places…", color: "#a78bfa" },
  { icon: HiOutlineSparkles, text: "Building your itinerary…", color: "#fbbf24" },
];

export default function LoadingSpinner() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stage = stages[currentStage];
  const StageIcon = stage.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      {/* Animated ring */}
      <div className="relative">
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-card-border"
          style={{ borderTopColor: stage.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StageIcon className="w-8 h-8" style={{ color: stage.color }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Stage text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium text-muted"
        >
          {stage.text}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2">
        {stages.map((s, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            animate={{
              background: i <= currentStage ? s.color : "var(--card-border)",
              scale: i === currentStage ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
