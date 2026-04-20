import api from "./api";
import type { BusLocation, LiveBusData, ApiResponse } from "@/types";

/**
 * Fetch current positions of all active buses.
 * Optionally filtered to a specific route number.
 */
export async function getActiveBuses(routeNumber?: string): Promise<BusLocation[]> {
  const res = await api.get<ApiResponse<BusLocation[]>>("/buses", {
    params: routeNumber ? { route: routeNumber } : undefined,
  });
  return res.data.data;
}

/**
 * Fetch live tracking details for a specific bus.
 */
export async function getBusLiveData(busId: string): Promise<LiveBusData> {
  const res = await api.get<ApiResponse<LiveBusData>>(`/buses/${busId}/live`);
  return res.data.data;
}

/**
 * Fetch live tracking summary for a route (used by BusTracker).
 */
export async function getRouteLiveData(routeNumber: string): Promise<LiveBusData> {
  const res = await api.get<ApiResponse<LiveBusData>>("/buses/route/live", {
    params: { route: routeNumber },
  });
  return res.data.data;
}

/**
 * Report a bus issue (overcrowding, breakdown, etc.).
 */
export async function reportBusIssue(payload: {
  busId: string;
  type: "overcrowding" | "breakdown" | "delay" | "other";
  description?: string;
}): Promise<void> {
  await api.post("/buses/report", payload);
}
