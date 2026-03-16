
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole, AuthState } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Programmes from './pages/Programmes';
import StressAssessment from './pages/StressAssessment';
import Members from './pages/Members';
import Profile from './pages/Profile';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Layout from './components/Layout';

// Public Pages
import Home from './pages/public/Home';
import PublicProgrammes from './pages/public/PublicProgrammes';
import PublicProgrammeDetails from './pages/public/PublicProgrammeDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Privacy from './pages/public/Privacy';
import HostHub from './pages/public/HostHub';
import PublicNavbar from './components/public/PublicNavbar';
import PublicFooter from './components/public/PublicFooter';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    organisation: null,
    isAuthenticated: false,
  });

  const location = useLocation();

  // Session recovery
  useEffect(() => {
    const savedAuth = localStorage.getItem('whanauwell_auth');
    if (savedAuth) {
      try {
        setAuth(JSON.parse(savedAuth));
      } catch (e) {
        console.error("Failed to parse auth", e);
      }
    }
  }, []);

  const handleLogin = (user: User, organisation: any, token?: string) => {
    console.log('Handling login for:', user.email);
    const newState = { user, organisation, isAuthenticated: true };
    setAuth(newState);
    localStorage.setItem('whanauwell_auth', JSON.stringify(newState));
    if (organisation?.code) {
      localStorage.setItem('whanauwell_org_code', organisation.code);
    }
    if (token) {
      localStorage.setItem('whanauwell_token', token);
    }
    console.log('Auth state updated and persisted');
  };

  const handleLogout = () => {
    setAuth({ user: null, organisation: null, isAuthenticated: false });
    localStorage.removeItem('whanauwell_auth');
    localStorage.removeItem('whanauwell_token');
    localStorage.removeItem('whanauwell_org_code');
  };

  const handleUpdateUser = (updatedUser: User) => {
    const newState = { ...auth, user: updatedUser };
    setAuth(newState);
    localStorage.setItem('whanauwell_auth', JSON.stringify(newState));
  };

  const isAppRoute = location.pathname.startsWith('/app');
  const isAuthRoute = location.pathname.startsWith('/auth');

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!auth.isAuthenticated || !auth.user) {
      return <Navigate to={`/auth/login?redirect=${location.pathname}`} replace />;
    }
    return (
      <Layout 
        user={auth.user} 
        organisation={auth.organisation!} 
        onLogout={handleLogout}
        currentPage={location.pathname.split('/').pop() || 'dashboard'}
        onNavigate={(page) => {}} // Not used with router
      >
        {children}
      </Layout>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isAppRoute && !isAuthRoute && (
        <PublicNavbar user={auth.user} organisation={auth.organisation} onLogout={handleLogout} />
      )}
      
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/programmes" element={<PublicProgrammes />} />
          <Route path="/programmes/:id" element={<PublicProgrammeDetails user={auth.user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/host-hub" element={<HostHub />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/auth/register" element={<Login onLogin={handleLogin} />} />

          {/* Protected App Routes */}
          <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard user={auth.user!} /></ProtectedRoute>} />
          <Route path="/app/programmes" element={<ProtectedRoute><Programmes user={auth.user!} /></ProtectedRoute>} />
          <Route path="/app/stress" element={<ProtectedRoute><StressAssessment /></ProtectedRoute>} />
          <Route path="/app/members" element={<ProtectedRoute><Members user={auth.user!} /></ProtectedRoute>} />
          <Route path="/app/profile" element={<ProtectedRoute><Profile user={auth.user!} onUpdateUser={handleUpdateUser} /></ProtectedRoute>} />
          <Route path="/app/admin" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAppRoute && !isAuthRoute && <PublicFooter />}
    </div>
  );
};

export default App;
