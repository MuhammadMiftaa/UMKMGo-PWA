import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import VerifyOTPScreen from "./pages/VerifyOTPScreen";
import CompleteProfileScreen from "./pages/CompleteProfileScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import DashboardScreen from "./pages/DashboardScreen";
import ActivityScreen from "./pages/ActivityScreen";
import DetailActivityScreen from "./pages/DetailActivityScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ProgramListScreen from "./pages/ProgramListcreen";
import TrainingDetailScreen from "./pages/TrainingProgramDetailScreen";
import ApplyTrainingScreen from "./pages/ApplyTrainingScreen";
import CertificationDetailScreen from "./pages/CertificationProgramDetailScreen";
import FundingDetailScreen from "./pages/FundingDetailScreen";
import ApplyCertificationScreen from "./pages/ApplyCertificationScreen";
import ApplyFundingScreen from "./pages/ApplyFundingScreen";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="from-primary to-accent flex min-h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <div className="text-primary-foreground mb-4 text-4xl font-bold">
            UMKMGo
          </div>
          <div className="border-primary-foreground mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/verify-otp" element={<VerifyOTPScreen />} />
      <Route path="/complete-profile" element={<CompleteProfileScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/programs"
        element={
          <ProtectedRoute>
            <ProgramListScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/program/training/:id"
        element={
          <ProtectedRoute>
            <TrainingDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/program/certification/:id"
        element={
          <ProtectedRoute>
            <CertificationDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/program/funding/:id"
        element={
          <ProtectedRoute>
            <FundingDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/training/:id"
        element={
          <ProtectedRoute>
            <ApplyTrainingScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/certification/:id"
        element={
          <ProtectedRoute>
            <ApplyCertificationScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/funding/:id"
        element={
          <ProtectedRoute>
            <ApplyFundingScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity/:id"
        element={
          <ProtectedRoute>
            <DetailActivityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
