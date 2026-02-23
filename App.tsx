
import React, { useState, useEffect } from 'react';
import { User, UserRole, AuthState } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Programmes from './pages/Programmes';
import StressAssessment from './pages/StressAssessment';
import Members from './pages/Members';
import Profile from './pages/Profile';
import Layout from './components/Layout';

type Page = 'dashboard' | 'programmes' | 'stress' | 'members' | 'profile';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    organisation: null,
    isAuthenticated: false,
  });

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

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
    setCurrentPage('dashboard');
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={auth.user!} onNavigate={setCurrentPage} />;
      case 'programmes':
        return <Programmes user={auth.user!} />;
      case 'stress':
        return <StressAssessment user={auth.user!} />;
      case 'members':
        return <Members user={auth.user!} />;
      case 'profile':
        return <Profile user={auth.user!} organisation={auth.organisation!} />;
      default:
        return <Dashboard user={auth.user!} onNavigate={setCurrentPage} />;
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
