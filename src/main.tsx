import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgramProvider } from "./contexts/ProgramContext";
import { NewsProvider } from "./contexts/NewsContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProfileProvider } from "./contexts/ProfileContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <NotificationProvider>
            <ProfileProvider>
              <ProgramProvider>
                <NewsProvider>
                  <App />
                </NewsProvider>
              </ProgramProvider>
            </ProfileProvider>
          </NotificationProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
