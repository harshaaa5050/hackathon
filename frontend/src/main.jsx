import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
