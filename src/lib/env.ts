/**
 * Global type declaration for runtime environment variables
 * These are injected at container startup, not build time
 */
declare global {
  interface Window {
    __ENV__: {
      API_URL: string;
    };
  }
}

export {};

// Update src/lib/const.ts dengan kode berikut:

/**
 * Runtime environment configuration
 * Dibaca dari window.__ENV__ yang di-generate saat container start
 * Fallback ke localhost untuk development
 */
export const API_BASE_URL =
  typeof window !== "undefined" && window.__ENV__?.API_URL
    ? window.__ENV__.API_URL
    : "http://localhost:8080/v1";
