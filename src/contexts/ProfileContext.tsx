// src/contexts/ProfileContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { API_ENDPOINTS, STORAGE_KEYS } from "../lib/constants";
import { apiCall, ApiError } from "../lib/api";

// ===== INTERFACES =====
export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  business_name: string;
  nik: string;
  gender: "male" | "female";
  birth_date: string;
  phone: string;
  address: string;
  province_id: number;
  city_id: number;
  district: string;
  subdistrict?: string;
  postal_code: string;
  kartu_type: "afirmatif" | "produktif";
  kartu_number: string;
  photo: string;
  nib?: string;
  npwp?: string;
  revenue_record?: string;
  business_permit?: string;
  province: Province;
  city: City;
  user: UserInfo;
}

export interface ProfileUpdateData {
  business_name?: string;
  gender?: "male" | "female";
  birth_date?: string;
  address?: string;
  province_id?: number;
  city_id?: number;
  district?: string;
  postal_code?: string;
  name?: string;
  photo?: string; // base64
}

export type DocumentType =
  | "nib"
  | "npwp"
  | "revenue_record"
  | "business_permit";

export interface UserDocument {
  document_type: string;
  document_url: string;
}

interface ProfileContextType {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: ProfileUpdateData,
  ) => Promise<{ success: boolean; message?: string }>;
  uploadDocument: (
    type: DocumentType,
    document: string,
  ) => Promise<{ success: boolean; message?: string }>;
  getDocuments: () => Promise<UserDocument[]>;
  clearError: () => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ===== PROVIDER =====
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiCall<UserProfile>(API_ENDPOINTS.PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        setProfile(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Gagal memuat profil";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (
    data: ProfileUpdateData,
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiCall(API_ENDPOINTS.PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Refresh profile after update
      await fetchProfile();

      return {
        success: true,
        message: response.message || "Profil berhasil diperbarui",
      };
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Gagal memperbarui profil";
      setError(errorMessage);
      console.error("Error updating profile:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  // Upload document (NIB, NPWP, etc.)
  const uploadDocument = async (
    type: DocumentType,
    document: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiCall(API_ENDPOINTS.DOCUMENT_UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, document }),
      });

      // Refresh profile after upload
      await fetchProfile();

      return {
        success: true,
        message: response.message || "Dokumen berhasil diupload",
      };
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Gagal mengupload dokumen";
      setError(errorMessage);
      console.error("Error uploading document:", err);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get user documents (for Apply screens)
  const getDocuments = async (): Promise<UserDocument[]> => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        return [];
      }

      const response = await apiCall<UserDocument[]>(API_ENDPOINTS.DOCUMENTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || [];
    } catch (err) {
      console.error("Error fetching documents:", err);
      return [];
    }
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    uploadDocument,
    getDocuments,
    clearError,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// ===== HOOK =====
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
