import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgramProvider } from "./contexts/ProgramContext";
import { NewsProvider } from "./contexts/NewsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgramProvider>
          <NewsProvider>
            <App />
          </NewsProvider>
        </ProgramProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
