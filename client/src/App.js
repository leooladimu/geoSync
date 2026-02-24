import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { GlobalStyles } from "./theme/GlobalStyles";
import { theme } from "./theme/theme";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CompatibilityReport from "./pages/CompatibilityReport";
import Science from "./pages/Science";

// Components
import LoadingSpinner from "./components/shared/LoadingSpinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/welcome" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <PublicRoute>
            <Welcome />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/compatibility/:connectionId"
        element={
          <ProtectedRoute>
            <CompatibilityReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/science"
        element={
          <ProtectedRoute>
            <Science />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.bg};
  color: ${(props) => props.theme.colors.textPrimary};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyles />
        <Router>
          <AppContainer>
            <AppRoutes />
          </AppContainer>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
