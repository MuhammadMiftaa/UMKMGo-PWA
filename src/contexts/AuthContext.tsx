"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { API_ENDPOINTS, STORAGE_KEYS } from "../lib/constants";
import { apiCall, parseJwt, formatPhoneForApi, ApiError } from "../lib/api";

// ============================================
// TYPES
// ============================================

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
}

export interface MetaData {
  provinces: Province[];
  cities: City[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  kartu_type: "afirmatif" | "produktif";
  exp?: number;
  iat?: number;
}

export interface RegisterData {
  email: string;
  phone: string;
}

export interface VerifyOTPData {
  phone: string;
  otp_code: string;
}

export interface ProfileRegisterData {
  fullname: string;
  business_name: string;
  nik: string;
  gender: "male" | "female";
  birth_date: string;
  password: string;
  address: string;
  province_id: number;
  city_id: number;
  district: string;
  postal_code: string;
  kartu_type: "afirmatif" | "produktif";
  kartu_number: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface ResetPasswordData {
  password: string;
  confirm_password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  tempToken: string | null;
  metaData: MetaData | null;
  isLoading: boolean;

  // Auth actions
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (
    data: VerifyOTPData,
  ) => Promise<{ success: boolean; tempToken?: string; message?: string }>;
  completeProfile: (
    data: ProfileRegisterData,
    tempToken: string,
  ) => Promise<{ success: boolean; message?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (
    phone: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (
    data: ResetPasswordData,
    tempToken: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Utility actions
  fetchMetaData: () => Promise<void>;
  getCitiesByProvince: (provinceId: number) => City[];
  setTempToken: (token: string | null) => void;
}

// ============================================
// API RESPONSE TYPES
// ============================================

interface RegisterResponse {
  message: string;
}

interface VerifyOTPResponse {
  phone: string;
  temp_token: string;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - check for existing session
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedTempToken = localStorage.getItem(STORAGE_KEYS.TEMP_TOKEN);

        if (savedToken) {
          const userData = parseJwt<User>(savedToken);
          if (userData) {
            setToken(savedToken);
            setUser(userData);
          } else {
            // Invalid token, clear it
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }

        if (savedTempToken) {
          setTempToken(savedTempToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch meta data (provinces and cities)
  const fetchMetaData = async () => {
    try {
      const response = await apiCall<MetaData[]>(API_ENDPOINTS.META);
      if (response.data && response.data.length > 0) {
        setMetaData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching meta data:", error);
    }
  };

  // Get cities by province ID
  const getCitiesByProvince = (provinceId: number): City[] => {
    if (!metaData) return [];
    return metaData.cities.filter((city) => city.province_id === provinceId);
  };

  // Register - Step 1
  const register = async (
    data: RegisterData,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneForApi(data.phone);

      const response = await apiCall<RegisterResponse>(API_ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          phone: formattedPhone,
        }),
      });

      // Save temporary data for later use
      localStorage.setItem(STORAGE_KEYS.TEMP_PHONE, formattedPhone);
      localStorage.setItem(STORAGE_KEYS.TEMP_EMAIL, data.email);

      return {
        success: true,
        message:
          response.message || "Registration successful, please verify OTP",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "Registration failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP - Step 2
  const verifyOTP = async (
    data: VerifyOTPData,
  ): Promise<{ success: boolean; tempToken?: string; message?: string }> => {
    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneForApi(data.phone);

      const response = await apiCall<VerifyOTPResponse>(
        API_ENDPOINTS.VERIFY_OTP,
        {
          method: "POST",
          body: JSON.stringify({
            phone: formattedPhone,
            otp_code: data.otp_code,
          }),
        },
      );

      if (response.data?.temp_token) {
        const tempTokenValue = response.data.temp_token;
        setTempToken(tempTokenValue);
        localStorage.setItem(STORAGE_KEYS.TEMP_TOKEN, tempTokenValue);

        return {
          success: true,
          tempToken: tempTokenValue,
          message: response.message || "OTP verified successfully",
        };
      }

      return {
        success: false,
        message: "No temp token received",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "OTP verification failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Complete Profile - Step 3
  const completeProfile = async (
    data: ProfileRegisterData,
    tempTokenParam: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const response = await apiCall<string>(
        `${API_ENDPOINTS.PROFILE_REGISTER}?temp_token=${tempTokenParam}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      if (response.data) {
        const jwtToken = response.data;
        const userData = parseJwt<User>(jwtToken);

        if (userData) {
          setToken(jwtToken);
          setUser(userData);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, jwtToken);

          // Clear temporary data
          localStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.TEMP_PHONE);
          localStorage.removeItem(STORAGE_KEYS.TEMP_EMAIL);
          setTempToken(null);

          return {
            success: true,
            message: response.message || "Profile completed successfully",
          };
        }
      }

      return {
        success: false,
        message: "Failed to parse user data",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "Profile completion failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (
    data: LoginData,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneForApi(data.phone);

      const response = await apiCall<string>(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({
          phone: formattedPhone,
          password: data.password,
        }),
      });

      if (response.data) {
        const jwtToken = response.data;
        const userData = parseJwt<User>(jwtToken);

        if (userData) {
          setToken(jwtToken);
          setUser(userData);
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, jwtToken);

          return {
            success: true,
            message: response.message || "Login successful",
          };
        }
      }

      return {
        success: false,
        message: "Failed to parse user data",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "Login failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (
    phone: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneForApi(phone);

      const response = await apiCall(
        `${API_ENDPOINTS.FORGOT_PASSWORD}?phone=${formattedPhone}`,
        {
          method: "POST",
        },
      );

      // Save phone for later use
      localStorage.setItem(STORAGE_KEYS.TEMP_PHONE, formattedPhone);

      return {
        success: true,
        message:
          response.message || "Reset password request sent, please verify OTP",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Forgot password request failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (
    data: ResetPasswordData,
    tempTokenParam: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const response = await apiCall(
        `${API_ENDPOINTS.RESET_PASSWORD}?temp_token=${tempTokenParam}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      // Clear temporary data
      localStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TEMP_PHONE);
      setTempToken(null);

      return {
        success: true,
        message: response.message || "Password reset successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : "Password reset failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setTempToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TEMP_PHONE);
    localStorage.removeItem(STORAGE_KEYS.TEMP_EMAIL);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tempToken,
        metaData,
        isLoading,
        register,
        verifyOTP,
        completeProfile,
        login,
        forgotPassword,
        resetPassword,
        logout,
        fetchMetaData,
        getCitiesByProvince,
        setTempToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
