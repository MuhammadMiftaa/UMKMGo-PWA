// src/contexts/NewsContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { API_ENDPOINTS, STORAGE_KEYS } from "../lib/constants";
import { apiCall, ApiError } from "../lib/api";

// ===== INTERFACES =====
export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  author_name: string;
  views_count: number;
  created_at: string;
}

export interface NewsDetail extends News {
  content: string;
  tags: string[];
}

// ===== CONTEXT =====
interface NewsContextType {
  // State
  newsList: News[];
  isLoading: boolean;

  // Methods
  fetchNews: () => Promise<void>;
  getNewsDetail: (slug: string) => Promise<NewsDetail>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

// ===== PROVIDER =====
export function NewsProvider({ children }: { children: ReactNode }) {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch news list
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await apiCall<News[]>(
        API_ENDPOINTS.NEWS,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (response?.data) {
        setNewsList(response.data);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch news");
    } finally {
      setIsLoading(false);
    }
  };

  // Get news detail by slug
  const getNewsDetail = async (slug: string): Promise<NewsDetail> => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await apiCall<NewsDetail>(
        `${API_ENDPOINTS.NEWS_DETAIL}/${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.data) {
        throw new Error("No data received from API");
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch news detail");
    }
  };

  const value: NewsContextType = {
    newsList,
    isLoading,
    fetchNews,
    getNewsDetail,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

// ===== HOOK =====
export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
}
