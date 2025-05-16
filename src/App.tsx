
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SpiderDatabase from "./pages/SpiderDatabase";
import SpiderDetails from "./pages/SpiderDetails";
import LogEncounter from "./pages/LogEncounter";
import EncountersList from "./pages/EncountersList";
import EncounterDetails from "./pages/EncounterDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/database" element={<SpiderDatabase />} />
          <Route path="/spider/:id" element={<SpiderDetails />} />
          <Route path="/log-encounter/:id" element={<LogEncounter />} />
          <Route path="/encounters" element={<EncountersList />} />
          <Route path="/encounter/:id" element={<EncounterDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
