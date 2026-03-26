"use client";

import { motion } from "framer-motion";
import { 
  HiOutlineSparkles, 
  HiOutlinePaperAirplane, 
  HiOutlineBuildingOffice, 
  HiOutlineMapPin, 
  HiOutlineDocumentText, 
  HiOutlineCog6Tooth 
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface LoadingPipelineProps {
  completedNodes: string[];
}

export default function LoadingPipeline({ completedNodes }: LoadingPipelineProps) {
  // Define our stages based on completed nodes.
  const hasPlanner = completedNodes.includes("planner");
  const hasSearch = completedNodes.includes("search");
  const hasFlight = completedNodes.includes("flight");
  const hasHotel = completedNodes.includes("hotel");
  const hasItinerary = completedNodes.includes("itinerary");
  const hasOptimizer = completedNodes.includes("optimizer");

  // A node is "active" (animating/loading) if its prerequisites are met but it hasn't completed yet.
  const isPlannerActive = !hasPlanner; 
  // For the parallel agents to be active, Planner must be done, and they must NOT be done themselves
  const isSearchActive = hasPlanner && !hasSearch;
  const isFlightActive = hasPlanner && !hasFlight;
  const isHotelActive = hasPlanner && !hasHotel;
  const parallelGroupActive = isSearchActive || isFlightActive || isHotelActive;
  const parallelGroupCompleted = hasSearch && hasFlight && hasHotel;

  const isItineraryActive = parallelGroupCompleted && !hasItinerary;
  const isOptimizerActive = hasItinerary && !hasOptimizer;

  const NodeIcon = ({ 
    icon: Icon, 
    active, 
    completed, 
    label, 
    delay = 0 
  }: { 
    icon: any; 
    active: boolean; 
    completed: boolean; 
    label: string; 
    delay?: number;
  }) => {
    return (
      <div className="flex flex-col items-center gap-3">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay, duration: 0.4 }}
           className={cn(
             "relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500",
             completed ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]" :
             active ? "bg-card border-primary text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-pulse-glow" :
             "bg-card border-muted text-muted-foreground"
           )}
        >
          {active && !completed && (
             <motion.div 
               className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
             />
          )}
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
        <span className={cn(
          "text-xs md:text-sm font-medium px-2 py-1 rounded-full text-center whitespace-nowrap",
          completed ? "text-primary" :
          active ? "text-foreground bg-accent/10" :
          "text-muted-foreground"
        )}>{label}</span>
      </div>
    );
  };

  const Connector = ({ active, completed }: { active: boolean; completed: boolean }) => (
    <div className="flex-1 px-2 mb-8 hidden sm:block">
      <div className={cn(
        "h-1 w-full rounded-full transition-all duration-700",
        completed ? "bg-primary" :
        active ? "bg-primary/30 animate-pulse" :
        "bg-muted"
      )} />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full min-w-[600px] gap-4 sm:gap-0">
        
        {/* Stage 1: Planner */}
        <NodeIcon icon={HiOutlineSparkles} active={isPlannerActive} completed={hasPlanner} label="Trip Planner" />
        
        <Connector active={parallelGroupActive} completed={parallelGroupCompleted} />
        
        {/* Stage 2: Parallel Group (Search, Flight, Hotel) */}
        <div className="flex flex-col gap-6 relative p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
             <div className="flex items-center gap-4 md:gap-8 justify-center">
                 <NodeIcon icon={HiOutlineMapPin} active={isSearchActive} completed={hasSearch} label="Places" delay={0.1} />
                 <NodeIcon icon={HiOutlinePaperAirplane} active={isFlightActive} completed={hasFlight} label="Flights" delay={0.2} />
                 <NodeIcon icon={HiOutlineBuildingOffice} active={isHotelActive} completed={hasHotel} label="Hotels" delay={0.3} />
             </div>
        </div>

        <Connector active={isItineraryActive} completed={hasItinerary} />

        {/* Stage 3: Itinerary Modeler */}
        <NodeIcon icon={HiOutlineDocumentText} active={isItineraryActive} completed={hasItinerary} label="Itinerary" />

        <Connector active={isOptimizerActive} completed={hasOptimizer} />

        {/* Stage 4: Finalizing Output */}
        <NodeIcon icon={HiOutlineCog6Tooth} active={isOptimizerActive} completed={hasOptimizer} label="Finalizing" />
      </div>
    </div>
  );
}
