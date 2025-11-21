export enum RideType {
  INSTANT = 'Instant',
  SCHEDULED = 'Scheduled'
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export interface RideEstimate {
  distanceKm: number;
  durationMin: number;
  fare: number;
  routePolyline?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  favorites: LocationData[];
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  pickup: LocationData;
  dropoff: LocationData;
  type: RideType;
  scheduledTime?: string; // ISO String
  estimate: RideEstimate;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface GeminiChatMessage {
  role: 'user' | 'model';
  text: string;
}