import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { useEffect } from "react"; // Make sure this is imported
import { supabase } from '@/lib/supabase';

const queryClient = new QueryClient();

function TestSupabase() {
  // This component runs the test query on mount
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);

      console.log("Supabase test query:", data, error);
    };

    testSupabase();
  }, []);

  return null; // Nothing to render
}

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === 'counselor' ? <Navigate to="/counselor" replace /> : <Navigate to="/student" replace />
        }
      />
      <Route path="/student" element={role === 'student' ? <StudentDashboard /> : <Navigate to="/" replace />} />
      <Route path="/counselor" element={role === 'counselor' ? <CounselorDashboard /> : <Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TestSupabase /> {/* <-- Add this to run the test query */}
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
