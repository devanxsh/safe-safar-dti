import api from "./api";
import type { AuthResponse, LoginRequest, SignupRequest, ApiResponse } from "@/types";

/**
 * Register a new user account.
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  const { tokens } = res.data.data;
  localStorage.setItem("safesafar_access_token", tokens.accessToken);
  localStorage.setItem("safesafar_refresh_token", tokens.refreshToken);
  return res.data.data;
}

/**
 * Log in with email and password.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  const { tokens } = res.data.data;
  localStorage.setItem("safesafar_access_token", tokens.accessToken);
  localStorage.setItem("safesafar_refresh_token", tokens.refreshToken);
  return res.data.data;
}

/**
 * Log out the current user and clear stored tokens.
 */
export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("safesafar_refresh_token");
  try {
    await api.post("/auth/logout", { refreshToken });
  } finally {
    localStorage.removeItem("safesafar_access_token");
    localStorage.removeItem("safesafar_refresh_token");
  }
}

/**
 * Fetch the authenticated user's profile.
 */
export async function getProfile() {
  const res = await api.get<ApiResponse<{ user: AuthResponse["user"] }>>("/auth/profile");
  return res.data.data.user;
}
