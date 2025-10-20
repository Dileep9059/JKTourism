import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { Toaster } from "sonner";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import FullScreenLoader from "./components/loader/FullScreenLoader.tsx";
import { ThemeProvider } from "./context/theme-context.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const base = import.meta.env.VITE_BASE || "/";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={base}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <LoadingProvider>
              <FullScreenLoader />
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
              <Toaster richColors position="top-right" />
            </LoadingProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
