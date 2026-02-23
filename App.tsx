
import React, { useState, useEffect } from 'react';
import { User, UserRole, AuthState } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Programmes from './pages/Programmes';
import StressAssessment from './pages/StressAssessment';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    organisation: null,
    isAuthenticated: false,
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'programmes' | 'stress'>('dashboard');

  // Session recovery simulation
  useEffect(() => {
    const savedAuth = localStorage.getItem('whanauwell_auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogin = (user: User, organisation: any) => {
    const newState = { user, organisation, isAuthenticated: true };
    setAuth(newState);
    localStorage.setItem('whanauwell_auth', JSON.stringify(newState));
  };

  const handleLogout = () => {
    setAuth({ user: null, organisation: null, isAuthenticated: false });
    localStorage.removeItem('whanauwell_auth');
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={auth.user!} />;
      case 'programmes':
        return <Programmes user={auth.user!} />;
      case 'stress':
        return <StressAssessment user={auth.user!} />;
      default:
        return <Dashboard user={auth.user!} />;
    }
  };

  return (
    <Layout 
      user={auth.user!} 
      organisation={auth.organisation!} 
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
