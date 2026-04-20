/**
 * Shared TypeScript types for SafeSafar
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Routes & Buses ──────────────────────────────────────────────────────────

export type OccupancyLevel = "low" | "medium" | "high";
export type BusStatus = "on-time" | "delayed" | "cancelled";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  location: LatLng;
  routes: string[];
  address?: string;
}

export interface Route {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  duration: number;
  distance: string;
  frequency: string;
  activeBuses: number;
  nextArrival: number;
  occupancy: OccupancyLevel;
  stops?: BusStop[];
  path?: LatLng[];
}

export interface BusLocation {
  id: string;
  routeNumber: string;
  location: LatLng;
  heading?: number;
  occupancy: OccupancyLevel;
  status: BusStatus;
  eta: number;
  speed?: number;
  busNumber?: string;
  driverName?: string;
}

export interface LiveBusData extends BusLocation {
  currentLocation: string;
  nextStop: string;
  totalStops: number;
  completedStops: number;
  busNumber: string;
  driverName: string;
}

// ─── Activity / Trips ────────────────────────────────────────────────────────

export type ActivityType = "trip" | "search" | "alert" | "emergency";

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  routeNumber?: string;
  fromStop?: string;
  toStop?: string;
  startedAt: string;
  endedAt?: string;
  notes?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Email ───────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TripAlertData {
  userId: string;
  email: string;
  routeNumber: string;
  nextStop: string;
  eta: number;
}
