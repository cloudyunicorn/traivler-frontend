"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanTrip } from "@/hooks/usePlanTrip";
import { TravelRequest } from "@/types/travel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LoadingPipeline from "@/components/ui/LoadingPipeline";
import {
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const preferenceOptions = [
  { id: "beach", label: "🏖️ Beach" },
  { id: "adventure", label: "🏔️ Adventure" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "culture", label: "🏛️ Culture" },
  { id: "food", label: "🍜 Food" },
  { id: "nature", label: "🌿 Nature" },
  { id: "nightlife", label: "🎶 Nightlife" },
  { id: "history", label: "📜 History" },
  { id: "wellness", label: "🧘 Wellness" },
];

const hotelTypes = [
  { value: "budget", label: "Budget", emoji: "🏠" },
  { value: "mid-range", label: "Mid-Range", emoji: "🏨" },
  { value: "luxury", label: "Luxury", emoji: "🏰" },
];

const budgetOptions = [
  { value: "budget", label: "Budget-Friendly" },
  { value: "moderate", label: "Moderate" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "No Limit" },
];

const steps = [
  { id: 1, title: "Where", icon: HiOutlineMapPin },
  { id: 2, title: "When & Who", icon: HiOutlineCalendarDays },
  { id: 3, title: "Preferences", icon: HiOutlineHeart },
];

export default function PlanPage() {
  const router = useRouter();
  const { mutate, isPending, isError, error } = usePlanTrip();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);

  const [form, setForm] = useState<TravelRequest>({
    origin: "",
    destination: "",
    days: 3,
    budget: "moderate",
    travelers: 2,
    preferences: [],
    hotel_type: "mid-range",
    transport_mode: "flight",
  });

  const updateField = <K extends keyof TravelRequest>(
    key: K,
    value: TravelRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePreference = (pref: string) => {
    setForm((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) return form.origin.trim() && form.destination.trim();
    if (currentStep === 2) return form.days > 0 && form.travelers > 0;
    if (currentStep === 3) return form.preferences.length > 0;
    return true;
  };

  const handleSubmit = () => {
    handleStreamSubmit();
  };

  const handleStreamSubmit = async () => {
    setIsStreaming(true);
    setStreamError(null);
    setCompletedNodes([]);
    
    try {
      const response = await fetch("http://localhost:8000/stream-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error("Failed to connect to AI agents");
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) return;

      let finalPlanData = null;
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr.trim() === "") continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.node) {
                 setCompletedNodes(prev => {
                    if (!prev.includes(data.node)) {
                       return [...prev, data.node];
                    }
                    return prev;
                 });
              }
              if (data.final_plan) {
                 finalPlanData = data.final_plan;
              }
            } catch (e) {
              console.error("Failed to parse stream chunk", dataStr);
            }
          }
        }
      }
      
      if (finalPlanData) {
        sessionStorage.setItem("tripResult", JSON.stringify(finalPlanData));
        sessionStorage.setItem("tripRequest", JSON.stringify(form));
        router.push("/results");
      } else {
        throw new Error("Pipeline finished without itinerary data.");
      }
      
    } catch (err: any) {
       console.error(err);
       setStreamError(err.message || "An error occurred during planning.");
       setIsStreaming(false);
    }
  };

  if (isStreaming || isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center w-full max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Crafting your <span className="gradient-text-accent">Perfect Trip</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Our specialized AI agents are working in parallel to build your itinerary...
          </p>
          {isStreaming ? (
            <LoadingPipeline completedNodes={completedNodes} />
          ) : (
            <LoadingSpinner />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-16 px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Plan Your <span className="gradient-text">Perfect Trip</span>
          </h1>
          <p className="text-muted-foreground">
            Tell us about your dream trip and our AI will handle the rest.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isComplete) setCurrentStep(step.id);
                  }}
                  disabled={!isComplete && !isActive}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 h-auto rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "bg-accent text-white hover:bg-accent/90"
                      : isComplete
                      ? "bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer"
                      : "bg-card text-muted-foreground"
                  )}
                >
                  <StepIcon className="w-4 h-4" />
                  {step.title}
                </Button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-px ${
                      isComplete ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Banner */}
        {(isError || streamError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Error:</strong>{" "}
                {streamError || (error as Error)?.message || "Something went wrong. Please try again."}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form Steps */}
        <Card className="glass-card border-0 ring-0">
          <CardContent className="pt-8 pb-0">
            <AnimatePresence mode="wait">
              {/* Step 1: Where */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="origin"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      From
                    </label>
                    <Input
                      id="origin"
                      type="text"
                      placeholder="e.g., New Delhi"
                      value={form.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                      className="bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="destination"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      To
                    </label>
                    <Input
                      id="destination"
                      type="text"
                      placeholder="e.g., Bali, Indonesia"
                      value={form.destination}
                      onChange={(e) =>
                        updateField("destination", e.target.value)
                      }
                      className="bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: When & Who */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="days"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Duration (days)
                    </label>
                    <Input
                      id="days"
                      type="number"
                      placeholder="e.g., 5"
                      min={1}
                      max={30}
                      value={form.days}
                      onChange={(e) =>
                        updateField("days", parseInt(e.target.value) || 1)
                      }
                      className="bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="travelers"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Number of Travelers
                    </label>
                    <Input
                      id="travelers"
                      type="number"
                      placeholder="e.g., 2"
                      min={1}
                      max={20}
                      value={form.travelers}
                      onChange={(e) =>
                        updateField(
                          "travelers",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Budget
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt) => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateField("budget", opt.value)}
                          className={cn(
                            "h-auto py-2 px-3 text-sm font-medium rounded-lg transition-all",
                            form.budget === opt.value
                              ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
                              : "bg-card border-card-border text-muted-foreground hover:border-accent/30 hover:bg-card hover:text-foreground"
                          )}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Type */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Hotel Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {hotelTypes.map((ht) => (
                        <Button
                          key={ht.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateField("hotel_type", ht.value)}
                          className={cn(
                            "h-auto py-3 px-3 text-sm font-medium rounded-lg transition-all flex flex-col items-center gap-1",
                            form.hotel_type === ht.value
                              ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
                              : "bg-card border-card-border text-muted-foreground hover:border-accent/30 hover:bg-card hover:text-foreground"
                          )}
                        >
                          <span className="text-xl">{ht.emoji}</span>
                          {ht.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      What are you into? (pick at least one)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {preferenceOptions.map((pref) => (
                        <Button
                          key={pref.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePreference(pref.id)}
                          className={cn(
                            "h-auto py-2 px-4 rounded-full text-sm font-medium transition-all",
                            form.preferences.includes(pref.id)
                              ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
                              : "bg-card border-card-border text-muted-foreground hover:border-accent/30 hover:bg-card hover:text-foreground"
                          )}
                        >
                          {pref.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 pb-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 1}
                className="flex items-center gap-2 border-card-border text-foreground hover:border-accent hover:bg-accent/10 disabled:opacity-30"
              >
                <HiOutlineArrowLeft className="w-4 h-4" /> Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="btn-primary border-0 h-auto py-2.5 px-5 text-sm flex items-center gap-2"
                >
                  Next <HiOutlineArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isStreaming || isPending}
                  className="btn-primary border-0 h-auto py-2.5 px-6 text-sm flex items-center gap-2"
                >
                  Plan My Trip ✨
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
