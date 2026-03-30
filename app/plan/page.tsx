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
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AirportAutocomplete } from "@/components/forms/AirportAutocomplete";
import { DateRangePicker } from "@/components/forms/DateRangePicker";

// --- Option Arrays ---

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

const groupTypeOptions = [
  { value: "solo", label: "Solo", emoji: "🧑" },
  { value: "couple", label: "Couple", emoji: "💑" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", emoji: "👯" },
];

const ageGroupOptions = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-50", label: "36-50" },
  { value: "50+", label: "50+" },
];

const intentOptions = [
  { value: "relaxation", label: "Relaxation", emoji: "🧘" },
  { value: "exploration", label: "Exploration", emoji: "🗺️" },
  { value: "adventure", label: "Adventure", emoji: "🏔️" },
  { value: "cultural_immersion", label: "Cultural", emoji: "🏛️" },
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "party", label: "Party", emoji: "🎉" },
];

const paceOptions = [
  { value: "relaxed", label: "Relaxed", emoji: "🐢" },
  { value: "moderate", label: "Moderate", emoji: "⚖️" },
  { value: "packed", label: "Packed", emoji: "🚀" },
];

const fitnessOptions = [
  { value: "low", label: "Low", emoji: "🛋️" },
  { value: "moderate", label: "Moderate", emoji: "🚶" },
  { value: "high", label: "High", emoji: "🏃" },
];

const foodOptions = [
  { id: "vegetarian", label: "🥗 Vegetarian" },
  { id: "vegan", label: "🌱 Vegan" },
  { id: "seafood", label: "🍣 Seafood" },
  { id: "local_cuisine", label: "🍛 Local Cuisine" },
  { id: "halal", label: "🥙 Halal" },
  { id: "street_food", label: "🍜 Street Food" },
  { id: "no_pref", label: "🤷 No Preference" },
];

const mustAvoidOptions = [
  { id: "crowds", label: "🚫 Crowds" },
  { id: "long_travel", label: "🚗 Long Travel" },
  { id: "expensive_places", label: "💸 Expensive Places" },
  { id: "adventure_sports", label: "🧗 Adventure Sports" },
  { id: "spicy_food", label: "🌶️ Spicy Food" },
  { id: "heights", label: "🏔️ Heights" },
];

const occasionOptions = [
  { value: "honeymoon", label: "Honeymoon", emoji: "💒" },
  { value: "anniversary", label: "Anniversary", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "", label: "None", emoji: "❌" },
];

// --- Step Definitions ---

const steps = [
  { id: 1, title: "Where", icon: HiOutlineMapPin },
  { id: 2, title: "Travelers", icon: HiOutlineUserGroup },
  { id: 3, title: "Trip Style", icon: HiOutlineSparkles },
  { id: 4, title: "Preferences", icon: HiOutlineHeart },
  { id: 5, title: "Final Touches", icon: HiOutlineChatBubbleBottomCenterText },
];

// --- Page Component ---

export default function PlanPage() {
  const router = useRouter();
  const { isPending } = usePlanTrip();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  const [form, setForm] = useState<TravelRequest>({
    origin: "",
    destination: "",
    start_date: "",
    end_date: "",
    days: 3,
    budget: "moderate",
    travelers: 2,
    preferences: [],
    hotel_type: "mid-range",
    transport_mode: "flight",
    // New personalization fields
    travel_intent: "",
    group_type: "",
    age_group: "",
    has_kids: false,
    fitness_level: "",
    food_preferences: [],
    trip_pace: "",
    must_avoid: [],
    special_occasion: "",
    special_notes: "",
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

  const toggleArrayField = (field: "food_preferences" | "must_avoid", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value],
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) return form.origin.trim() && form.destination.trim() && form.start_date && form.end_date;
    if (currentStep === 2) return form.days > 0 && form.travelers > 0 && form.group_type && form.age_group;
    if (currentStep === 3) return form.travel_intent && form.trip_pace && form.fitness_level;
    if (currentStep === 4) return form.preferences.length > 0 && form.food_preferences.length > 0;
    return true; // Step 5 always passes
  };

  const handleSubmit = () => {
    handleStreamSubmit();
  };

  const handleStreamSubmit = async () => {
    setIsStreaming(true);
    setCompletedNodes([]);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://traivler-backend-production.up.railway.app";
      const response = await fetch(`${API_BASE}/stream-plan`, {
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
      toast.error("Pipeline Error", {
        description: err.message || "An error occurred during planning.",
      });
      setIsStreaming(false);
    }
  };

  // --- Loading State ---
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
            Our specialized AI agents are working in parallel to build your personalized itinerary...
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

  // --- Shared UI Helpers ---
  const inputClass = "bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4";

  const pillBtn = (isActive: boolean) =>
    cn(
      "h-auto py-2 px-4 rounded-full text-sm font-medium transition-all",
      isActive
        ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
        : "bg-card border-card-border text-muted-foreground hover:border-accent/30 hover:bg-card hover:text-foreground"
    );

  const cardBtn = (isActive: boolean) =>
    cn(
      "h-auto py-3 px-3 text-sm font-medium rounded-lg transition-all flex flex-col items-center gap-1",
      isActive
        ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
        : "bg-card border-card-border text-muted-foreground hover:border-accent/30 hover:bg-card hover:text-foreground"
    );

  // --- Form Render ---
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
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10 flex-wrap">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isComplete) setCurrentStep(step.id);
                  }}
                  disabled={!isComplete && !isActive}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 h-auto rounded-full text-xs sm:text-sm font-medium transition-all",
                    isActive
                      ? "bg-accent text-white hover:bg-accent/90"
                      : isComplete
                        ? "bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer"
                        : "bg-card text-muted-foreground"
                  )}
                >
                  <StepIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </Button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-4 sm:w-8 h-px ${isComplete ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Steps */}
        <Card className="glass-card border-0 ring-0">
          <CardContent className="pt-8 pb-0">
            <AnimatePresence mode="wait">

              {/* ===== Step 1: Where ===== */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <AirportAutocomplete
                      id="origin"
                      label="From"
                      placeholder="Search city or airport (e.g., New Delhi)"
                      value={form.origin}
                      onChange={(iata) => updateField("origin", iata)}
                    />
                    <AirportAutocomplete
                      id="destination"
                      label="To"
                      placeholder="Search city or airport (e.g., Bali)"
                      value={form.destination}
                      onChange={(iata) => updateField("destination", iata)}
                    />
                    <DateRangePicker
                      startDate={form.start_date}
                      endDate={form.end_date}
                      onStartDateChange={(date) => updateField("start_date", date)}
                      onEndDateChange={(date) => {
                        updateField("end_date", date);
                        // Auto-calculate days from date range
                        if (form.start_date && date) {
                          const diffMs = new Date(date + "T00:00:00").getTime() - new Date(form.start_date + "T00:00:00").getTime();
                          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                          if (diffDays > 0) updateField("days", diffDays);
                        }
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* ===== Step 2: Travelers ===== */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Days & Travelers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="days" className="block text-sm font-medium text-muted-foreground">Duration (days)</label>
                      <Input id="days" type="number" min={1} max={30} value={form.days}
                        onChange={(e) => updateField("days", parseInt(e.target.value) || 1)} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="travelers" className="block text-sm font-medium text-muted-foreground">Travelers</label>
                      <Input id="travelers" type="number" min={1} max={20} value={form.travelers}
                        onChange={(e) => updateField("travelers", parseInt(e.target.value) || 1)} className={inputClass} />
                    </div>
                  </div>

                  {/* Group Type */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Group Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {groupTypeOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("group_type", opt.value)}
                          className={cardBtn(form.group_type === opt.value)}>
                          <span className="text-xl">{opt.emoji}</span>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Age Group</label>
                    <div className="grid grid-cols-4 gap-2">
                      {ageGroupOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("age_group", opt.value)}
                          className={pillBtn(form.age_group === opt.value)}>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Has Kids Toggle */}
                  <div className="flex items-center justify-between rounded-xl bg-card border border-card-border p-4">
                    <span className="text-sm font-medium text-foreground">Traveling with children?</span>
                    <button
                      type="button"
                      onClick={() => updateField("has_kids", !form.has_kids)}
                      className={cn(
                        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                        form.has_kids ? "bg-accent" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200",
                          form.has_kids ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ===== Step 3: Trip Style ===== */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Travel Intent */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">What's this trip about?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {intentOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("travel_intent", opt.value)}
                          className={cardBtn(form.travel_intent === opt.value)}>
                          <span className="text-xl">{opt.emoji}</span>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Trip Pace */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Preferred Pace</label>
                    <div className="grid grid-cols-3 gap-2">
                      {paceOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("trip_pace", opt.value)}
                          className={cardBtn(form.trip_pace === opt.value)}>
                          <span className="text-xl">{opt.emoji}</span>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Fitness Level */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Fitness Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {fitnessOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("fitness_level", opt.value)}
                          className={cardBtn(form.fitness_level === opt.value)}>
                          <span className="text-xl">{opt.emoji}</span>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ===== Step 4: Preferences ===== */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Budget</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("budget", opt.value)}
                          className={pillBtn(form.budget === opt.value)}>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Type */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Hotel Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {hotelTypes.map((ht) => (
                        <Button key={ht.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("hotel_type", ht.value)}
                          className={cardBtn(form.hotel_type === ht.value)}>
                          <span className="text-xl">{ht.emoji}</span>
                          {ht.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Activity Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      What are you into? (pick at least one)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {preferenceOptions.map((pref) => (
                        <Button key={pref.id} type="button" variant="outline" size="sm"
                          onClick={() => togglePreference(pref.id)}
                          className={pillBtn(form.preferences.includes(pref.id))}>
                          {pref.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Food Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Food Preferences (pick at least one)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {foodOptions.map((opt) => (
                        <Button key={opt.id} type="button" variant="outline" size="sm"
                          onClick={() => toggleArrayField("food_preferences", opt.id)}
                          className={pillBtn(form.food_preferences.includes(opt.id))}>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Must Avoid */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Must Avoid (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {mustAvoidOptions.map((opt) => (
                        <Button key={opt.id} type="button" variant="outline" size="sm"
                          onClick={() => toggleArrayField("must_avoid", opt.id)}
                          className={pillBtn(form.must_avoid.includes(opt.id))}>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ===== Step 5: Final Touches ===== */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Special Occasion */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Celebrating something special?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {occasionOptions.map((opt) => (
                        <Button key={opt.value} type="button" variant="outline" size="sm"
                          onClick={() => updateField("special_occasion", opt.value)}
                          className={cardBtn(form.special_occasion === opt.value)}>
                          <span className="text-xl">{opt.emoji}</span>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div className="space-y-2">
                    <label htmlFor="special_notes" className="block text-sm font-medium text-muted-foreground">
                      Anything else your AI planner should know?
                    </label>
                    <textarea
                      id="special_notes"
                      placeholder="e.g., We love sunsets, prefer outdoor dining, hate touristy spots..."
                      value={form.special_notes || ""}
                      onChange={(e) => updateField("special_notes", e.target.value.slice(0, 500))}
                      maxLength={500}
                      rows={4}
                      className={cn(
                        "w-full bg-card border border-card-border text-foreground placeholder:text-muted-foreground",
                        "focus-visible:ring-accent focus-visible:border-accent focus:outline-none focus:ring-2",
                        "rounded-xl px-4 py-3 text-sm resize-none"
                      )}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {(form.special_notes || "").length}/500
                    </p>
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

              {currentStep < 5 ? (
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
