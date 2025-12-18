
import React, { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import { PricingPage, HelpSupportPage, PostureGuidesPage, GenericPage } from './pages/ExtraPages';
import { AppView } from './types';

export type AuthMode = 'login' | 'signup';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigateToAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setView('dashboard');
  }, []);
  
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setView('landing');
  }, []);

  const handleGetStarted = useCallback(() => {
    setAuthMode('signup');
    setView('auth');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  const handleNavigation = useCallback((newView: AppView) => {
      setView(newView);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:bg-gray-900">
      {view !== 'dashboard' && <Header isLoggedIn={isLoggedIn} onNavigateToAuth={handleNavigateToAuth} onLogout={handleLogout} onLogoClick={handleBackToLanding} onNavigate={handleNavigation} />}
      <main className="flex-grow flex flex-col">
        {view === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        {view === 'auth' && <AuthPage mode={authMode} onLoginSuccess={handleLoginSuccess} onSwitchMode={setAuthMode} onBack={handleBackToLanding} />}
        {view === 'dashboard' && <DashboardPage onLogout={handleLogout} />}
        
        {/* Extra Pages */}
        {view === 'pricing' && <PricingPage onGetStarted={handleGetStarted} />}
        {view === 'support' && <HelpSupportPage />}
        {view === 'guides' && <PostureGuidesPage />}
        {view === 'community' && <GenericPage title="Community" description="Join the conversation with thousands of other posture enthusiasts." />}
        {view === 'blog' && <GenericPage title="Poisé Blog" description="Latest news, health tips, and product updates." />}
        {view === 'build' && <GenericPage title="Build with Poisé" description="Developer tools and SDKs coming soon." />}
        {view === 'docs' && <GenericPage title="Documentation" description="Technical guides and API references." />}
        {view === 'security' && <GenericPage title="Security" description="Learn how we protect your data and privacy." />}
        {view === 'bug-bounty' && <GenericPage title="Bug Bounty" description="Help us make Poisé safer and get rewarded." />}
        {view === 'privacy' && <GenericPage title="Privacy Policy" description="Your data is yours. We just help you improve it." />}
        {view === 'terms' && <GenericPage title="Terms of Use" description="The rules of the game." />}
        {view === 'analytics' && <GenericPage title="Manage Analytics" description="Control your data preferences." />}
      </main>
      {view !== 'dashboard' && view !== 'auth' && <Footer onNavigate={handleNavigation} />}
    </div>
  );
};

export default App;
