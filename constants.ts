import { RideEstimate } from "./types";

// Pricing Constants
export const RATE_PER_KM = 40;
export const RATE_PER_MIN = 5;

// Fallback logic for demo purposes if Google Maps API fails or key is missing
export const MOCK_ESTIMATE: RideEstimate = {
  distanceKm: 25.5,
  durationMin: 45,
  fare: (25.5 * 40) + (45 * 5), // 1020 + 225 = 1245
};

export const ADMIN_EMAILS = [
  "jamhuriairporttranfers@gmail.com",
  "orukodickson426@gmail.com"
];

export const APP_NAME = "Jamhuri Transfers";
export const TAGLINE = "Karibu Nyumbani with smooth rides.";

// This would typically come from process.env, but handling gracefully if missing
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ''; 
