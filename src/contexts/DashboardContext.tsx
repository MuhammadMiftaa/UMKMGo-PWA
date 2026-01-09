// src/contexts/DashboardContext.tsx
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
export interface DashboardData {
  name: string;
  kartu_type: "afirmatif" | "produktif";
  kartu_number: string;
  qrcode: string;
  notifications_count: number;
  total_applications: number;
  approved_applications: number;
}

// ===== CONTEXT =====
interface DashboardContextType {
  // State
  dashboardData: DashboardData | null;
  isLoading: boolean;

  // Methods
  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

// ===== PROVIDER =====
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall<DashboardData>(API_ENDPOINTS.DASHBOARD, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Dashboard API Error:", error.message);
      }
      console.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh dashboard (for pull-to-refresh or manual refresh)
  const refreshDashboard = async () => {
    await fetchDashboard();
  };

  // Auto-fetch dashboard on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      fetchDashboard();
    }
  }, []);

  const value: DashboardContextType = {
    dashboardData,
    isLoading,
    fetchDashboard,
    refreshDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ===== HOOK =====
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
