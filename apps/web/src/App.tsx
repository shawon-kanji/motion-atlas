import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Home from '@/pages/Home';
import Assets from '@/pages/Assets';
import AssetView from '@/pages/AssetView';
import Upload from '@/pages/Upload';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import { Login, Signup, ForgotPassword } from '@/pages/auth';
import { useAuthStore } from '@/stores/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/assets"
          element={isAuthenticated ? <Assets /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/assets/:folderId"
          element={isAuthenticated ? <Assets /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/assets/view/:id"
          element={isAuthenticated ? <AssetView /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/upload"
          element={isAuthenticated ? <Upload /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/team"
          element={isAuthenticated ? <Team /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
