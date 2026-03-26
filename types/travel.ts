// Types matching backend Pydantic schemas

export interface TravelRequest {
  origin: string;
  destination: string;
  days: number;
  budget?: string;
  travelers: number;
  preferences: string[];
  hotel_type?: string;
  transport_mode?: string;
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
  total_estimate: string;
}

export interface TravelResponse {
  summary: string;
  flights: FlightInfo;
  hotels: HotelInfo;
  itinerary: DayPlan[];
  cost_breakdown: CostBreakdown;
}
