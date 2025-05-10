import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/user/Chat";
import { Analytics } from "./pages/Analytics";
import { Credits } from "./pages/user/Credits";
import { AIModels } from "./pages/AIModels";
import CheggManagement from "@/pages/user/CheggManagement";
import AdminCheggManagement from "@/pages/AdminCheggManagement";
import { Questions } from "./pages/Questions";
import { Settings } from "./pages/Settings";
import { Account } from "./pages/Account";
import { Admin } from "./pages/Admin";
import { Help } from "./pages/Help";
import { NotFound } from "./pages/NotFound";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChatbotSelection } from "./pages/user/ChatbotSelection";
import { DeepSeek } from "./pages/user/chatbot/deepseek";
import { Claude } from "./pages/user/chatbot/claude";
import { Gemini } from "@/pages/user/chatbot/gemini";
import { OpenAI } from "./pages/user/chatbot/openai";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  // Get user role from localStorage
  const userRole = localStorage.getItem("role");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected user routes */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/credits" element={<Credits />} />
                      <Route path="/chegg-management" element={<CheggManagement />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                      
                      {/* Chatbot routes */}
                      <Route path="/chatbot-selection" element={<ChatbotSelection />} />
                      <Route path="/chatbot/deepseek" element={<DeepSeek />} />
                      <Route path="/chatbot/claude" element={<Claude />} />
                      <Route path="/chatbot/gemini" element={<Gemini />} />
                      <Route path="/chatbot/openai" element={<OpenAI />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Protected admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to appropriate dashboard */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {userRole === "admin" ? (
                      <Navigate to="/admin" replace />
                    ) : (
                      <Navigate to="/user" replace />
                    )}
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
