"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanTrip } from "@/hooks/usePlanTrip";
import { TravelRequest } from "@/types/travel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

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
    mutate(form, {
      onSuccess: (data) => {
        // Store the result in sessionStorage for the results page
        sessionStorage.setItem("tripResult", JSON.stringify(data));
        sessionStorage.setItem("tripRequest", JSON.stringify(form));
        router.push("/results");
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-2">
            Planning your trip to{" "}
            <span className="gradient-text">{form.destination}</span>
          </h2>
          <p className="text-muted mb-8">
            Our AI agents are working in parallel to find the best options…
          </p>
          <LoadingSpinner />
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
          <p className="text-muted">
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
                <button
                  onClick={() => {
                    if (isComplete) setCurrentStep(step.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent text-white"
                      : isComplete
                      ? "bg-accent/20 text-accent cursor-pointer"
                      : "bg-card text-muted-dark"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                  {step.title}
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-px ${
                      isComplete ? "bg-accent" : "bg-card-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Banner */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <strong>Error:</strong>{" "}
            {error?.message || "Something went wrong. Please try again."}
          </motion.div>
        )}

        {/* Form Steps */}
        <div className="glass-card p-8">
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
                <div>
                  <label
                    htmlFor="origin"
                    className="block text-sm font-medium text-muted mb-2"
                  >
                    From
                  </label>
                  <input
                    id="origin"
                    type="text"
                    className="input-field"
                    placeholder="e.g., New Delhi"
                    value={form.origin}
                    onChange={(e) => updateField("origin", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-muted mb-2"
                  >
                    To
                  </label>
                  <input
                    id="destination"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Bali, Indonesia"
                    value={form.destination}
                    onChange={(e) => updateField("destination", e.target.value)}
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
                <div>
                  <label
                    htmlFor="days"
                    className="block text-sm font-medium text-muted mb-2"
                  >
                    Duration (days)
                  </label>
                  <input
                    id="days"
                    type="number"
                    className="input-field"
                    placeholder="e.g., 5"
                    min={1}
                    max={30}
                    value={form.days}
                    onChange={(e) =>
                      updateField("days", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="travelers"
                    className="block text-sm font-medium text-muted mb-2"
                  >
                    Number of Travelers
                  </label>
                  <input
                    id="travelers"
                    type="number"
                    className="input-field"
                    placeholder="e.g., 2"
                    min={1}
                    max={20}
                    value={form.travelers}
                    onChange={(e) =>
                      updateField("travelers", parseInt(e.target.value) || 1)
                    }
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
                  <label className="block text-sm font-medium text-muted mb-3">
                    Budget
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateField("budget", opt.value)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          form.budget === opt.value
                            ? "bg-accent text-white"
                            : "bg-card border border-card-border text-muted hover:border-accent/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hotel Type */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-3">
                    Hotel Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {hotelTypes.map((ht) => (
                      <button
                        key={ht.value}
                        type="button"
                        onClick={() => updateField("hotel_type", ht.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          form.hotel_type === ht.value
                            ? "bg-accent text-white"
                            : "bg-card border border-card-border text-muted hover:border-accent/30"
                        }`}
                      >
                        <span className="text-xl">{ht.emoji}</span>
                        {ht.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-3">
                    What are you into? (pick at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {preferenceOptions.map((pref) => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePreference(pref.id)}
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                          form.preferences.includes(pref.id)
                            ? "bg-accent text-white"
                            : "bg-card border border-card-border text-muted hover:border-accent/30"
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-card-border">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 1}
              className="btn-secondary py-2.5! px-5! text-sm! flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
                className="btn-primary py-2.5! px-5! text-sm! flex items-center gap-2"
              >
                Next <HiOutlineArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                className="btn-primary py-2.5! px-6! text-sm! flex items-center gap-2"
              >
                Plan My Trip ✨
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
