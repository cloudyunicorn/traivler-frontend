// Types matching backend Pydantic schemas

export interface TravelRequest {
  origin: string;
  destination: string;      // IATA / country code (e.g. "GB", "LON")
  destination_name?: string; // Full human-readable name (e.g. "United Kingdom")
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  days: number;
  budget?: string;
  travelers: number;
  preferences: string[];
  hotel_type?: string;
  transport_mode?: string;
  // Personalization fields
  travel_intent: string;
  group_type: string;
  age_group: string;
  has_kids: boolean;
  fitness_level: string;
  food_preferences: string[];
  trip_pace: string;
  must_avoid: string[];
  special_occasion?: string;
  special_notes?: string;
}

export interface FlightInfo {
  route: string;
  avg_cost: string;
  duration: string;
}

export interface HotelInfo {
  avg_price_per_night: string;
  suggested_areas: string[];
}

export interface DayPlan {
  day: number;
  activities: string[];
}

export interface CostBreakdown {
  flights: string;
  hotels: string;
  food: string;
  local_transport: string;
  activities: string;
  total_estimate: string;
}

export interface TravelResponse {
  summary: string;
  flights: FlightInfo;
  hotels: HotelInfo;
  itinerary: DayPlan[];
  cost_breakdown: CostBreakdown;
}
