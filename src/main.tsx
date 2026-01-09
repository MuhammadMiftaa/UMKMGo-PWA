import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgramProvider } from "./contexts/ProgramContext";
import { NewsProvider } from "./contexts/NewsContext";
import { DashboardProvider } from "./contexts/DashboardContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <ProgramProvider>
            <NewsProvider>
              <App />
            </NewsProvider>
          </ProgramProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
