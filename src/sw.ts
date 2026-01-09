import { BackgroundSyncPlugin } from "workbox-background-sync";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { API_BASE_URL } from "./lib/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => Promise<void>; clients: any };

// Clean up old caches
cleanupOutdatedCaches();

// Precache all static assets from build
precacheAndRoute(self.__WB_MANIFEST);

// Skip waiting and claim clients immediately for faster updates
self.addEventListener("install", () => {
  void self.skipWaiting();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener("activate", (event: any) => {
  event.waitUntil(self.clients.claim());
});

// ============================================
// STATIC ASSETS CACHING
// ============================================

// Cache images with CacheFirst (long-term cache)
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);
registerRoute(imageRoute);

// Cache external images (API images, CDN)
const externalImageRoute = new Route(
  ({ request, sameOrigin }) => {
    return !sameOrigin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "external-images-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  }),
);
registerRoute(externalImageRoute);

// Cache fonts with CacheFirst
const fontRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "font";
  },
  new CacheFirst({
    cacheName: "fonts-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  }),
);
registerRoute(fontRoute);

// Cache CSS and JS with StaleWhileRevalidate
const staticAssetsRoute = new Route(
  ({ request, sameOrigin }) => {
    return (
      sameOrigin &&
      (request.destination === "script" || request.destination === "style")
    );
  },
  new StaleWhileRevalidate({
    cacheName: "static-assets-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  }),
);
registerRoute(staticAssetsRoute);

// ============================================
// API CACHING - READ OPERATIONS (GET)
// ============================================

// Cache Dashboard API - NetworkFirst with fallback
const dashboardRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/dashboard")
    );
  },
  new NetworkFirst({
    cacheName: "api-dashboard",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  }),
);
registerRoute(dashboardRoute);

// Cache Profile API
const profileRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/profile")
    );
  },
  new NetworkFirst({
    cacheName: "api-profile",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  }),
);
registerRoute(profileRoute);

// Cache Programs API (Training, Certification, Funding)
const programsRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/programs")
    );
  },
  new NetworkFirst({
    cacheName: "api-programs",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 12 * 60 * 60, // 12 hours
      }),
    ],
  }),
);
registerRoute(programsRoute);

// Cache Applications API
const applicationsRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/applications")
    );
  },
  new NetworkFirst({
    cacheName: "api-applications",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 6 * 60 * 60, // 6 hours
      }),
    ],
  }),
);
registerRoute(applicationsRoute);

// Cache Notifications API
const notificationsRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/notifications")
    );
  },
  new NetworkFirst({
    cacheName: "api-notifications",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 1 * 60 * 60, // 1 hour
      }),
    ],
  }),
);
registerRoute(notificationsRoute);

// Cache News API
const newsRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/news")
    );
  },
  new NetworkFirst({
    cacheName: "api-news",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 6 * 60 * 60, // 6 hours
      }),
    ],
  }),
);
registerRoute(newsRoute);

// Cache Documents API
const documentsRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobile/documents")
    );
  },
  new NetworkFirst({
    cacheName: "api-documents",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  }),
);
registerRoute(documentsRoute);

// Cache Meta API (provinces, cities)
const metaRoute = new Route(
  ({ request }) => {
    return (
      request.method === "GET" &&
      request.url.includes(API_BASE_URL + "/mobileauth/meta")
    );
  },
  new CacheFirst({
    cacheName: "api-meta",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days (rarely changes)
      }),
    ],
  }),
);
registerRoute(metaRoute);

// ============================================
// NAVIGATION CACHING
// ============================================

// Cache navigations with NetworkFirst and offline fallback
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);
registerRoute(navigationRoute);

// ============================================
// BACKGROUND SYNC FOR WRITE OPERATIONS
// ============================================

// Background sync plugin for offline submissions
const bgSyncPlugin = new BackgroundSyncPlugin("offlineSubmitQueue", {
  maxRetentionTime: 24 * 60, // 24 hours in minutes
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log("Background sync: Request replayed successfully");
      } catch (error) {
        console.error("Background sync: Replay failed", error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Background sync for application submissions (Training)
const trainingSubmitRoute = new Route(
  ({ request }) => {
    return request.url.includes(
      API_BASE_URL + "/mobile/applications/training",
    );
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(trainingSubmitRoute);

// Background sync for application submissions (Certification)
const certificationSubmitRoute = new Route(
  ({ request }) => {
    return request.url.includes(
      API_BASE_URL + "/mobile/applications/certification",
    );
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(certificationSubmitRoute);

// Background sync for application submissions (Funding)
const fundingSubmitRoute = new Route(
  ({ request }) => {
    return request.url.includes(
      API_BASE_URL + "/mobile/applications/funding",
    );
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(fundingSubmitRoute);

// Background sync for profile updates
const profileUpdateRoute = new Route(
  ({ request }) => {
    return request.url.includes(API_BASE_URL + "/mobile/profile");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PUT",
);
registerRoute(profileUpdateRoute);

// Background sync for document uploads
const documentUploadRoute = new Route(
  ({ request }) => {
    return request.url.includes(API_BASE_URL + "/mobile/documents/upload");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(documentUploadRoute);

// Background sync for application revisions
const revisionRoute = new Route(
  ({ request }) => {
    return (
      request.url.includes(API_BASE_URL + "/mobile/applications") &&
      request.method === "PUT"
    );
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PUT",
);
registerRoute(revisionRoute);

// Background sync for marking notifications as read
const markNotificationRoute = new Route(
  ({ request }) => {
    return request.url.includes(API_BASE_URL + "/mobile/notifications/mark");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PUT",
);
registerRoute(markNotificationRoute);

// ============================================
// OFFLINE FALLBACK MESSAGE HANDLER
// ============================================

// Listen for messages from the main thread
// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener("message", (event: any) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});

// Log service worker status
console.log("Service Worker: UMKMGO PWA with offline support loaded");
