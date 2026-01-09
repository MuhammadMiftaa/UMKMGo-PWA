// src/lib/api.ts
import { API_BASE_URL } from "./constants";

export interface ApiResponse<T = unknown> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * API call wrapper with error handling
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };
  console.log("API URL => ", url);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.status) {
    throw new ApiError(
      data.statusCode || response.status,
      data.message || "Something went wrong",
      data,
    );
  }

  return data;
}

/**
 * Parse JWT token to extract user data
 */
export function parseJwt<T = unknown>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

/**
 * Format phone number for API (remove +62 prefix, ensure starts with 0)
 */
export function formatPhoneForApi(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Remove +62 prefix if exists
  if (cleaned.startsWith("62")) {
    cleaned = "0" + cleaned.substring(2);
  }

  // Ensure it starts with 0
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
}

/**
 * Format phone for display (+62xxx)
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = formatPhoneForApi(phone);
  // Convert 08xxx to +628xxx
  if (cleaned.startsWith("0")) {
    return "+62" + cleaned.substring(1);
  }
  return "+62" + cleaned;
}
