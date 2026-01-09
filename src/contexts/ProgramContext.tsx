// src/contexts/ProgramContext.tsx
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
export interface Program {
  id: number;
  title: string;
  description: string;
  banner?: string;
  provider: string;
  provider_logo?: string;
  type: "training" | "certification" | "funding";

  // Training & Certification specific
  training_type?: "online" | "offline" | "hybrid";
  batch?: number;
  batch_start_date?: string;
  batch_end_date?: string;
  location?: string;

  // Certification specific
  certification_type?: string;
  validity_period?: string;

  // Funding specific
  min_amount?: number;
  max_amount?: number;
  interest_rate?: number;
  max_tenure_months?: number;

  application_deadline?: string;
  is_active: boolean;
  benefits?: string[];
  requirements?: string[];
}

export interface Application {
  id: number;
  program_id: number;
  program_name: string;
  type: "training" | "certification" | "funding";
  status: "screening" | "revision" | "final" | "rejected";
  submitted_at: string;
  expired_at: string;
}

export interface ApplicationDetail extends Application {
  umkm_id: number;
  documents: ApplicationDocument[];
  histories: ApplicationHistory[];
  program: Program;
  training_data?: TrainingApplicationData;
  certification_data?: CertificationApplicationData;
  funding_data?: FundingApplicationData;
}

export interface ApplicationDocument {
  id: number;
  application_id: number;
  type: string;
  file: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationHistory {
  id: number;
  application_id: number;
  status: string;
  notes: string;
  actioned_at: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingApplicationData {
  motivation: string;
  business_experience: string;
  learning_objectives: string;
  availability_notes: string;
}

export interface CertificationApplicationData {
  business_sector: string;
  product_or_service: string;
  business_description: string;
  years_operating: number;
  current_standards: string;
  certification_goals: string;
}

export interface FundingApplicationData {
  business_sector: string;
  business_description: string;
  years_operating: number;
  requested_amount: number;
  fund_purpose: string;
  business_plan: string;
  revenue_projection: number;
  monthly_revenue: number;
  requested_tenure_months: number;
  collateral_description: string;
}

export interface TrainingApplicationInput extends TrainingApplicationData {
  program_id: number;
  documents: {
    ktp: string;
    portfolio?: string;
  };
}

export interface CertificationApplicationInput
  extends CertificationApplicationData {
  program_id: number;
  documents: {
    ktp: string;
    nib: string;
    npwp: string;
    portfolio: string;
    izin_usaha?: string;
  };
}

export interface FundingApplicationInput extends FundingApplicationData {
  program_id: number;
  documents: {
    ktp: string;
    nib: string;
    npwp: string;
    rekening: string;
    proposal: string;
    financial_records: string;
    dokumen_agunan?: string;
  };
}

export interface ReviseDocumentInput {
  type: string; // ktp / portfolio / nib / npwp / rekening / proposal / financial_records
  document: string; // base64 (new file) / url (existing file)
}

// ===== CONTEXT =====
interface ProgramContextType {
  // State
  programs: Program[];
  applications: Application[];
  isLoading: boolean;

  // Methods
  fetchPrograms: (
    type: "training" | "certification" | "funding",
  ) => Promise<void>;
  getProgramDetail: (id: number) => Promise<Program>;
  fetchApplications: () => Promise<void>;
  getApplicationDetail: (id: number) => Promise<ApplicationDetail>;
  applyTraining: (data: TrainingApplicationInput) => Promise<void>;
  applyCertification: (data: CertificationApplicationInput) => Promise<void>;
  applyFunding: (data: FundingApplicationInput) => Promise<void>;
  reviseApplication: (
    id: number,
    documents: ReviseDocumentInput[],
  ) => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// ===== PROVIDER =====
export function ProgramProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch programs by type
  const fetchPrograms = async (
    type: "training" | "certification" | "funding",
  ) => {
    setIsLoading(true);
    try {
      let endpoint = "";
      switch (type) {
        case "training":
          endpoint = API_ENDPOINTS.PROGRAMS_TRAINING;
          break;
        case "certification":
          endpoint = API_ENDPOINTS.PROGRAMS_CERTIFICATION;
          break;
        case "funding":
          endpoint = API_ENDPOINTS.PROGRAMS_FUNDING;
          break;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await apiCall<Program[]>(endpoint, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response?.data) {
        setPrograms(response.data);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch programs");
    } finally {
      setIsLoading(false);
    }
  };

  // Get program detail
  const getProgramDetail = async (id: number): Promise<Program> => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await apiCall<Program>(
        `${API_ENDPOINTS.PROGRAM_DETAIL}/${id}`,
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
      throw new Error("Failed to fetch program detail");
    }
  };

  // Fetch user applications
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await apiCall<Application[]>(
        API_ENDPOINTS.APPLICATIONS,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data) {
        setApplications(response.data);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  // Get application detail
  const getApplicationDetail = async (
    id: number,
  ): Promise<ApplicationDetail> => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiCall<ApplicationDetail>(
        `${API_ENDPOINTS.APPLICATION_DETAIL}/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
      throw new Error("Failed to fetch application detail");
    }
  };

  // Apply for training program
  const applyTraining = async (data: TrainingApplicationInput) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      await apiCall(API_ENDPOINTS.APPLY_TRAINING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Refresh applications list
      await fetchApplications();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to submit training application");
    }
  };

  // Apply for certification program
  const applyCertification = async (data: CertificationApplicationInput) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      await apiCall(API_ENDPOINTS.APPLY_CERTIFICATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Refresh applications list
      await fetchApplications();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to submit certification application");
    }
  };

  // Apply for funding program
  const applyFunding = async (data: FundingApplicationInput) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      await apiCall(API_ENDPOINTS.APPLY_FUNDING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Refresh applications list
      await fetchApplications();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to submit funding application");
    }
  };

  // Revise application documents
  const reviseApplication = async (
    id: number,
    documents: ReviseDocumentInput[],
  ) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      await apiCall(`${API_ENDPOINTS.APPLICATION_REVISE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documents),
      });

      // Refresh applications list
      await fetchApplications();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to revise application");
    }
  };

  // Auto-fetch applications on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      fetchApplications().catch(console.error);
    }
  }, []);

  const value: ProgramContextType = {
    programs,
    applications,
    isLoading,
    fetchPrograms,
    getProgramDetail,
    fetchApplications,
    getApplicationDetail,
    applyTraining,
    applyCertification,
    applyFunding,
    reviseApplication,
  };

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}

// ===== HOOK =====
export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
}
