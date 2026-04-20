import api from "./api";
import type { Route, BusStop, ApiResponse } from "@/types";

/**
 * Fetch all available routes from the backend.
 */
export async function getRoutes(): Promise<Route[]> {
  const res = await api.get<ApiResponse<Route[]>>("/routes");
  return res.data.data;
}

/**
 * Fetch a single route by its ID including stop list and path.
 */
export async function getRouteById(routeId: string): Promise<Route> {
  const res = await api.get<ApiResponse<Route>>(`/routes/${routeId}`);
  return res.data.data;
}

/**
 * Search routes by keyword (name, stop, destination).
 */
export async function searchRoutes(query: string): Promise<Route[]> {
  const res = await api.get<ApiResponse<Route[]>>("/routes/search", {
    params: { q: query },
  });
  return res.data.data;
}

/**
 * Fetch all bus stops, optionally filtered by routeNumber.
 */
export async function getBusStops(routeNumber?: string): Promise<BusStop[]> {
  const res = await api.get<ApiResponse<BusStop[]>>("/routes/stops", {
    params: routeNumber ? { route: routeNumber } : undefined,
  });
  return res.data.data;
}

/**
 * Get the Google Maps Directions route path between two stops.
 * Returns a list of LatLng waypoints for polyline rendering.
 */
export async function getRoutePath(
  origin: string,
  destination: string
): Promise<{ lat: number; lng: number }[]> {
  const res = await api.get<ApiResponse<{ path: { lat: number; lng: number }[] }>>(
    "/routes/path",
    { params: { origin, destination } }
  );
  return res.data.data.path;
}
