"use client";

import { useMutation } from "@tanstack/react-query";
import { planTrip } from "@/lib/api";
import { TravelRequest, TravelResponse } from "@/types/travel";

export function usePlanTrip() {
  return useMutation<TravelResponse, Error, TravelRequest>({
    mutationFn: planTrip,
  });
}
