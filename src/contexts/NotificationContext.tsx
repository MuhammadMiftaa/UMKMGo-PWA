// src/contexts/NotificationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { API_ENDPOINTS, STORAGE_KEYS } from "../lib/constants";
import { apiCall, ApiError } from "../lib/api";

// ===== INTERFACES =====
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string;
  created_at: string;
  application_id: number;
}

interface NotificationContextType {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: (notificationIds?: number[]) => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// ===== PROVIDER =====
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notifications
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiCall<Notification[]>(
        API_ENDPOINTS.NOTIFICATIONS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data) {
        setNotifications(response.data);
        // Also update unread count based on fetched data
        const unread = response.data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Gagal memuat notifikasi";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread count only
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return;

      const response = await apiCall<number>(
        API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data !== undefined) {
        setUnreadCount(response.data);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      await apiCall(`${API_ENDPOINTS.NOTIFICATION_MARK_AS_READ}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Gagal menandai notifikasi sebagai dibaca";
      setError(errorMessage);
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (notificationIds?: number[]) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get IDs to mark as read
      const idsToMark =
        notificationIds ||
        notifications.filter((n) => !n.is_read).map((n) => n.id);

      if (idsToMark.length === 0) return;

      await apiCall(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notification_ids: idsToMark }),
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          idsToMark.includes(n.id)
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnreadCount(0);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Gagal menandai semua notifikasi sebagai dibaca";
      setError(errorMessage);
      console.error("Error marking all notifications as read:", err);
    }
  };

  const clearError = () => setError(null);

  // Auto-fetch unread count on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      fetchUnreadCount();
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ===== HOOK =====
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
