// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  META: "/mobileauth/meta",
  REGISTER: "/mobileauth/register",
  VERIFY_OTP: "/mobileauth/verify/otp",
  PROFILE_REGISTER: "/mobileauth/register/profile",
  LOGIN: "/mobileauth/login",
  FORGOT_PASSWORD: "/mobileauth/forgot-password",
  RESET_PASSWORD: "/mobileauth/reset-password",

  // Profile
  PROFILE: "/mobile/profile",

  // Dashboard
  DASHBOARD: "/mobile/dashboard",

  // Programs
  PROGRAMS_TRAINING: "/mobile/programs/training",
  PROGRAMS_CERTIFICATION: "/mobile/programs/certification",
  PROGRAMS_FUNDING: "/mobile/programs/funding",
  PROGRAM_DETAIL: "/mobile/programs", // + /:id

  // Applications
  APPLICATIONS: "/mobile/applications",
  APPLICATION_DETAIL: "/mobile/applications", // + /:id
  APPLICATION_REVISE: "/mobile/applications", // + /:id (PUT)
  APPLY_TRAINING: "/mobile/applications/training",
  APPLY_CERTIFICATION: "/mobile/applications/certification",
  APPLY_FUNDING: "/mobile/applications/funding",

  // Notifications
  NOTIFICATIONS: "/mobile/notifications/list",
  NOTIFICATIONS_UNREAD_COUNT: "/mobile/notifications/unread-count",
  NOTIFICATION_MARK_AS_READ: "/mobile/notifications/mark-as-read", // + /:id
  NOTIFICATIONS_MARK_ALL_READ: "/mobile/notifications/mark-all-as-read",

  // News
  NEWS: "/mobile/news",
  NEWS_DETAIL: "/mobile/news", // + /:slug

  // Documents
  DOCUMENTS: "/mobile/documents",
  DOCUMENT_UPLOAD: "/mobile/documents/upload",
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  TEMP_TOKEN: "tempToken",
  USER: "user",
  TEMP_PHONE: "tempPhone",
  TEMP_EMAIL: "tempEmail",
} as const;
