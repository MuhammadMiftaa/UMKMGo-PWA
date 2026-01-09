// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api-umkmgo-staging.miftech.web.id";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  META: "/v1/mobileauth/meta",
  REGISTER: "/v1/mobileauth/register",
  VERIFY_OTP: "/v1/mobileauth/verify/otp",
  PROFILE_REGISTER: "/v1/mobileauth/register/profile",
  LOGIN: "/v1/mobileauth/login",
  FORGOT_PASSWORD: "/v1/mobileauth/forgot-password",
  RESET_PASSWORD: "/v1/mobileauth/reset-password",

  // Profile
  PROFILE: "/v1/mobile/profile",

  // Dashboard
  DASHBOARD: "/v1/mobile/dashboard",

  // Programs
  PROGRAMS_TRAINING: "/v1/mobile/programs/training",
  PROGRAMS_CERTIFICATION: "/v1/mobile/programs/certification",
  PROGRAMS_FUNDING: "/v1/mobile/programs/funding",
  PROGRAM_DETAIL: "/v1/mobile/programs", // + /:id

  // Applications
  APPLICATIONS: "/v1/mobile/applications",
  APPLICATION_DETAIL: "/v1/mobile/applications", // + /:id
  APPLY_TRAINING: "/v1/mobile/applications/training",
  APPLY_CERTIFICATION: "/v1/mobile/applications/certification",
  APPLY_FUNDING: "/v1/mobile/applications/funding",

  // News
  NEWS: "/v1/mobile/news",
  NEWS_DETAIL: "/v1/mobile/news", // + /:slug
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  TEMP_TOKEN: "tempToken",
  USER: "user",
  TEMP_PHONE: "tempPhone",
  TEMP_EMAIL: "tempEmail",
} as const;
