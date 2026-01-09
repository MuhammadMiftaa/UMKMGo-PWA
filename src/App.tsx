import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import VerifyOTPScreen from "./pages/VerifyOTPScreen";
// import CompleteProfileScreen from "./pages/CompleteProfileScreen";
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
import EditProfileScreen from "./pages/EditProfileScreen";
import NewsListScreen from "./pages/NewsListScreen";
import DetailNewsScreen from "./pages/DetailNewsScreen";
import ReviseApplicationScreen from "./pages/ReviseApplicationScreen";
import CompleteRegisterData from "./pages/CompleteRegisterData";

// Splash Screen Component
function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFadeOut(true), 200);
    }
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="from-primary/5 via-accent/5 to-secondary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br blur-3xl" />
        <div className="from-secondary/5 via-accent/5 to-primary/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-tr blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <div className="relative">
            <div className="from-primary via-accent to-secondary flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br shadow-lg shadow-blue-500/25">
              <img
                src="/logo.png"
                alt="UMKMGo Logo"
                className="h-16 w-16 object-contain brightness-10000"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Animated ring */}
            <div
              className="border-primary/30 absolute -inset-2 animate-spin rounded-3xl border-2 border-dashed"
              style={{ animationDuration: "3s" }}
            />
          </div>
        </div>

        {/* App Name */}
        <h1 className="from-primary via-accent to-secondary mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          UMKMGo
        </h1>
        <p className="mb-8 text-sm font-medium text-gray-500">
          Solusi Digital untuk UMKM Indonesia
        </p>

        {/* Progress Bar */}
        <div className="w-48">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="from-primary via-accent to-secondary h-full rounded-full bg-linear-to-r transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-xs font-medium text-gray-400">
            {progress < 100 ? "Memuat aplikasi..." : "Selesai!"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-400">Versi 1.0.0</p>
      </div>
    </div>
  );
}

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
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/verify-otp" element={<VerifyOTPScreen />} />
      {/* <Route path="/complete-profile" element={<CompleteProfileScreen />} /> */}
      <Route path="/complete-profile" element={<CompleteRegisterData />} />
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
        path="/activity/:id/revise"
        element={
          <ProtectedRoute>
            <ReviseApplicationScreen />
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
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsListScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:slug"
        element={
          <ProtectedRoute>
            <DetailNewsScreen />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
