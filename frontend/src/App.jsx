// frontend/src/App.jsx
// Root component — sets up all routes and providers

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Lazy-loaded pages for code splitting
const LandingPage    = lazy(() => import('./pages/user/LandingPage'));
const ReportPage     = lazy(() => import('./pages/user/ReportPage'));
const MapPage        = lazy(() => import('./pages/user/MapPage'));
const UserDashboard  = lazy(() => import('./pages/user/UserDashboard'));
const LoginPage      = lazy(() => import('./pages/user/LoginPage'));
const SignupPage      = lazy(() => import('./pages/user/SignupPage'));

const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminReports   = lazy(() => import('./pages/admin/AdminReports'));
const AdminMapView   = lazy(() => import('./pages/admin/AdminMapView'));

// Full-screen loading fallback
const PageLoader = () => (
  <div className="loading-container" style={{ minHeight: '100vh' }}>
    <div className="spinner" />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
  </div>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/"       element={<LandingPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/map"    element={<MapPage />} />
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes — nested under AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="map"     element={<AdminMapView />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.875rem',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
