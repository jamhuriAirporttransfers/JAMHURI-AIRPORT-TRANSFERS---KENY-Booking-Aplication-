import { RATE_PER_KM, RATE_PER_MIN, MOCK_ESTIMATE } from '../constants';
import { LocationData, RideEstimate } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

// Helper to calculate distance between two coords (Haversine)
// Used as a fallback if Google Maps API is not loaded/fails
const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const calculateFareAndRoute = async (
  pickup: LocationData,
  dropoff: LocationData
): Promise<RideEstimate> => {
  
  // Try to use Google Maps Distance Matrix Service if available
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    try {
      const service = new window.google.maps.DistanceMatrixService();
      const response = await service.getDistanceMatrix({
        origins: [{ lat: pickup.lat, lng: pickup.lng }],
        destinations: [{ lat: dropoff.lat, lng: dropoff.lng }],
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      if (response.rows[0]?.elements[0]?.status === 'OK') {
        const distanceVal = response.rows[0].elements[0].distance.value; // meters
        const durationVal = response.rows[0].elements[0].duration.value; // seconds

        const distanceKm = parseFloat((distanceVal / 1000).toFixed(1));
        const durationMin = Math.ceil(durationVal / 60);

        const fare = (distanceKm * RATE_PER_KM) + (durationMin * RATE_PER_MIN);

        return {
          distanceKm,
          durationMin,
          fare: Math.round(fare)
        };
      }
    } catch (error) {
      console.warn("Google Maps Matrix API failed, using fallback calculation.", error);
    }
  }

  // Fallback Calculation
  const distanceKm = calculateHaversineDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  // Assume average speed of 40km/h in Nairobi traffic
  const durationMin = Math.ceil((distanceKm / 40) * 60) + 10; // +10 mins buffer
  const fare = (distanceKm * RATE_PER_KM) + (durationMin * RATE_PER_MIN);

  return {
    distanceKm: distanceKm || MOCK_ESTIMATE.distanceKm, // Fallback to mock if 0
    durationMin: durationMin || MOCK_ESTIMATE.durationMin,
    fare: Math.round(fare) || MOCK_ESTIMATE.fare
  };
};

export const getPlacePredictions = async (input: string): Promise<LocationData[]> => {
    // In a real app, use google.maps.places.AutocompleteService
    // For this demo, we mock some Nairobi locations
    const mockLocations: LocationData[] = [
        { address: "Jomo Kenyatta International Airport (JKIA)", lat: -1.3192, lng: 36.9275 },
        { address: "Nairobi CBD", lat: -1.2921, lng: 36.8219 },
        { address: "Westlands, Nairobi", lat: -1.2683, lng: 36.8066 },
        { address: "Karen, Nairobi", lat: -1.3283, lng: 36.7049 },
        { address: "Wilson Airport", lat: -1.3235, lng: 36.8159 },
        { address: "Gigiri (UN Complex)", lat: -1.2330, lng: 36.8136 },
    ];

    return mockLocations.filter(l => l.address.toLowerCase().includes(input.toLowerCase()));
};