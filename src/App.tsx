
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SpiderDatabase from "./pages/SpiderDatabase";
import SpiderDetails from "./pages/SpiderDetails";
import LogEncounter from "./pages/LogEncounter";
import EncountersList from "./pages/EncountersList";
import EncounterDetails from "./pages/EncounterDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/database" element={<ProtectedRoute><SpiderDatabase /></ProtectedRoute>} />
            <Route path="/spider/:id" element={<ProtectedRoute><SpiderDetails /></ProtectedRoute>} />
            <Route path="/log-encounter/:id" element={<ProtectedRoute><LogEncounter /></ProtectedRoute>} />
            <Route path="/encounters" element={<ProtectedRoute><EncountersList /></ProtectedRoute>} />
            <Route path="/encounter/:id" element={<ProtectedRoute><EncounterDetails /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
