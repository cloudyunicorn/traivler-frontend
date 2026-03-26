import { TravelRequest, TravelResponse } from "@/types/travel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function planTrip(data: TravelRequest): Promise<TravelResponse> {
  const response = await fetch(`${API_BASE}/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to plan trip");
  }

  return response.json();
}
