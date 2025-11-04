
import React, { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';

type View = 'landing' | 'auth' | 'dashboard';
export type AuthMode = 'login' | 'signup';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleNavigateToAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setView('dashboard');
  }, []);
  
  const handleLogout = useCallback(() => {
    setView('landing');
  }, []);

  const handleGetStarted = useCallback(() => {
    setAuthMode('signup');
    setView('auth');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {view !== 'auth' && <Header isLoggedIn={view === 'dashboard'} onNavigateToAuth={handleNavigateToAuth} onLogout={handleLogout} />}
      <main className="flex-grow flex flex-col">
        {view === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        {view === 'auth' && <AuthPage mode={authMode} onLoginSuccess={handleLoginSuccess} onSwitchMode={setAuthMode} onBack={handleBackToLanding} />}
        {view === 'dashboard' && <DashboardPage />}
      </main>
      {view !== 'auth' && <Footer />}
    </div>
  );
};

export default App;
