import api from "./api";
import type { ContactFormData, TripAlertData, ApiResponse } from "@/types";

/**
 * Submit a contact / support form.
 */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  await api.post<ApiResponse<void>>("/email/contact", data);
}

/**
 * Send a trip progress alert email to the user's emergency contacts.
 */
export async function sendTripAlert(data: TripAlertData): Promise<void> {
  await api.post<ApiResponse<void>>("/email/trip-alert", data);
}

/**
 * Send an emergency notification with user's current location.
 */
export async function sendEmergencyAlert(payload: {
  userId: string;
  email: string;
  location: { lat: number; lng: number };
  message?: string;
}): Promise<void> {
  await api.post<ApiResponse<void>>("/email/emergency", payload);
}
