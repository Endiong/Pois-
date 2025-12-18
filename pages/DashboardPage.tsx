import React, { useState, useEffect, useRef } from 'react';
import CameraView from '../components/dashboard/CameraView';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import GoalProgress from '../components/dashboard/GoalProgress';
import SetGoalModal from '../components/dashboard/SetGoalModal';
import OnboardingModal from '../components/dashboard/OnboardingModal';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/GeminiTip';
import SessionHistory from '../components/dashboard/SessionHistory';
import LiveTrackingView from '../components/dashboard/LiveTrackingView';
import GoalsView from '../components/dashboard/GoalsView';
import ReportsView from '../components/dashboard/ReportsView';
import SettingsView from '../components/dashboard/SettingsView';
import SupportView from '../components/dashboard/SupportView';
import PlansView from '../components/dashboard/PlansView';
import BadgesView from '../components/dashboard/BadgesView';
import usePostureTracker from '../hooks/usePostureTracker';
import { ViewType, PostureHistoryItem } from '../types';
import Chatbot from '../components/dashboard/Chatbot';
import { 
  HomeIcon, VideoCameraIcon, SettingsIcon, LogoutIcon, 
  ClockIcon, CheckBadgeIcon, BellIcon,
  MoonIcon, SunIcon, PoiséIcon, ChevronDownIcon,
  ChatBubbleIcon, ChevronLeftIcon, ChevronRightIcon,
  TrophyIcon, HeadphonesIcon,
  BoltIcon, FireIcon, MedalIcon, ReportsIcon, ChartBarSquareIcon, ArrowRightIcon
} from '../components/icons/Icons';
import { loadState, saveState } from '../utils/storage';

const GOAL_STORAGE_KEY = 'poise-daily-goal';
const HISTORY_STORAGE_KEY = 'poise-session-history';
const USER_PROFILE_KEY = 'poise-user-profile';
const ONBOARDING_COMPLETED_KEY = 'poise-onboarding-completed';

type Theme = 'light' | 'dark';
type UserProfile = {
  name: string;
  avatar: string;
  email?: string;
};

const Sidebar: React.FC<{ 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void; 
  onLogout: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({ activeView, setActiveView, onLogout, isMinimized, onToggleMinimize }) => {
  
  const mainItems = [
    { id: 'home', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'live', label: 'Live Tracking', icon: <VideoCameraIcon /> },
    { id: 'history', label: 'History', icon: <ChartBarSquareIcon /> },
    { id: 'chat', label: 'Atlas', icon: <ChatBubbleIcon /> },
  ];

  const proItems = [
    { id: 'goals', label: 'Goals', icon: <TrophyIcon />, pro: false }, 
    { id: 'reports', label: 'Reports', icon: <ReportsIcon />, pro: false },
    { id: 'badges', label: 'Badges', icon: <MedalIcon />, pro: false },
  ];

  const systemItems = [
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5"/> },
  ];

  const NavLink: React.FC<{ item: { id: string, label: string, icon: React.ReactNode, pro?: boolean } }> = ({ item }) => (
    <button
      onClick={() => setActiveView(item.id as ViewType)}
      disabled={item.pro}
      className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${ isMinimized ? 'justify-center' : ''} ${
        activeView === item.id 
          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm' 
          : item.pro
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
      title={isMinimized ? item.label : ''}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className={isMinimized ? 'hidden' : 'block'}>{item.label}</span>
      {item.pro && !isMinimized && 
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
          PRO
        </span>
      }
    </button>
  );

  return (
    <aside className={`flex flex-col h-screen bg-gray-50 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isMinimized ? 'w-20' : 'w-72'}`}>
      <div className={`flex items-center gap-1.5 h-20 px-6 flex-shrink-0 ${isMinimized ? 'justify-center px-2' : ''}`}>
        <PoiséIcon className={`transition-all duration-300 w-8 h-8`} />
        {!isMinimized && <span className="text-2xl font-logo tracking-tight text-gray-900 dark:text-white">poisé</span>}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-3 pb-6">
        <nav className="space-y-1 mb-6">
           {mainItems.map(item => <NavLink key={item.id} item={item} />)}
        </nav>

        <div className="mb-6">
           {!isMinimized && (
              <div className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                 Gamification
              </div>
           )}
           <nav className="space-y-1">
              {proItems.map(item => <NavLink key={item.id} item={item} />)}
           </nav>
        </div>

        <div className="flex-grow min-h-[2rem]"></div>

        <div className="space-y-1 mt-auto">
            {!isMinimized && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/10 mb-4">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Upgrade to Pro</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 mb-3">Unlock Atlas's advanced posture insights.</p>
                  <button onClick={() => setActiveView('plans')} className="w-full bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 text-xs font-bold py-2 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                    Upgrade
                  </button>
              </div>
            )}

            {systemItems.map(item => <NavLink key={item.id} item={item} />)}
            
            <button 
                onClick={() => setActiveView('support')} 
                className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Support' : ''}>
              <HeadphonesIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Support</span>
            </button>
            
            <div className="my-2 border-t border-gray-200 dark:border-gray-800 mx-2"></div>
            
            <button onClick={onLogout} className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Logout' : ''}>
              <LogoutIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Logout</span>
            </button>
            
            <button 
                onClick={onToggleMinimize} 
                className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${isMinimized ? 'justify-center' : ''}`}
                title={isMinimized ? 'Expand' : 'Collapse'}
            >
                {isMinimized ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
                <span className={isMinimized ? 'hidden' : 'block'}>Collapse</span>
            </button>
        </div>
      </div>
    </aside>
  );
};

const DashboardHeader: React.FC<{
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (view: ViewType) => void;
  profile: UserProfile;
}> = ({ theme, onToggleTheme, onNavigate, profile }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mock notifications
    const notifications = [
        { id: 1, text: "Goal met! You hit 85% posture score yesterday.", time: "1 day ago", read: false },
        { id: 2, text: "Welcome to Poisé Pro trial.", time: "2 days ago", read: true },
        { id: 3, text: "New badge unlocked: First Steps.", time: "3 days ago", read: true },
    ];

    return (
        <header className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-40 sticky top-0">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-full animate-in fade-in slide-in-from-left-2 shadow-sm">
                <div className="p-1 bg-orange-100 dark:bg-orange-800 rounded-full text-orange-600 dark:text-orange-200">
                    <FireIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-orange-700 dark:text-orange-300 tracking-wide pr-1">3 Day Streak</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 relative">
                     <button 
                        onClick={onToggleTheme} 
                        className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm"
                        title="Toggle Theme"
                     >
                        {theme === 'light' ? <MoonIcon className="w-4 h-4"/> : <SunIcon className="w-4 h-4"/>}
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all relative"
                        >
                            <BellIcon className="w-5 h-5" />
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900"></span>
                        </button>
                        
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!n.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{n.text}</p>
                                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 text-center">
                                    <button className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline">Mark all as read</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(prev => !prev)}
                        className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all shadow-sm"
                    >
                        <span className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">{profile.name}</span>
                        <img
                            className="h-8 w-8 rounded-xl object-cover"
                            src={profile.avatar}
                            alt="Avatar"
                        />
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 mr-2" />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Your Account</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{profile.email || 'user@poise.ai'}</p>
                        </div>
                        <button onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Settings</button>
                        <button onClick={() => { onNavigate('history'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">History</button>
                      </div>
                    )}
                </div>
            </div>
        </header>
    );
}

const DashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<Theme>(() => loadState<Theme>('poise-theme') || 'light');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [dailyGoal, setDailyGoal] = useState<number>(() => loadState<number>(GOAL_STORAGE_KEY) ?? 70);
  const [historyData, setHistoryData] = useState<PostureHistoryItem[]>(() => loadState<PostureHistoryItem[]>(HISTORY_STORAGE_KEY) ?? []);
  const [profile, setProfile] = useState<UserProfile>(() => loadState<UserProfile>(USER_PROFILE_KEY) ?? { name: 'Margaret', avatar: 'https://i.pravatar.cc/150?u=margaret', email: 'margaret@example.com' });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !loadState<boolean>(ONBOARDING_COMPLETED_KEY));
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    saveState('poise-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleSetGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    saveState(GOAL_STORAGE_KEY, newGoal);
    setIsGoalModalOpen(false);
  };
  
  const handleUpdateProfile = (newProfile: UserProfile) => {
      setProfile(newProfile);
      saveState(USER_PROFILE_KEY, newProfile);
  };

  const handleSessionEnd = (session: PostureHistoryItem) => {
      setHistoryData(prevHistory => {
          const newHistory = [session, ...prevHistory];
          saveState(HISTORY_STORAGE_KEY, newHistory);
          return newHistory;
      });
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your session history?')) {
      setHistoryData([]);
      saveState(HISTORY_STORAGE_KEY, []);
    }
  };

  const { 
    videoRef, 
    postureStatus, 
    startCamera, 
    stopCamera, 
    goodPostureSeconds, 
    totalSessionSeconds 
  } = usePostureTracker({
    onPostureChange: () => {},
    enabled: isTracking,
    onSessionEnd: handleSessionEnd
  });

  const handleToggleTracking = () => {
      if (isTracking) {
          stopCamera();
          setIsTracking(false);
      } else {
          startCamera();
          setIsTracking(true);
      }
  };

  const handleOnboardingComplete = () => {
      setIsOnboardingOpen(false);
      saveState(ONBOARDING_COMPLETED_KEY, true);
      setActiveView('home');
  };

  // Calculate Stats
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      return `${mins}m`;
  };
  
  const currentScore = totalSessionSeconds > 0 ? Math.round((goodPostureSeconds / totalSessionSeconds) * 100) : 0;
  
  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={onLogout}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={() => setIsSidebarMinimized(prev => !prev)}
      />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <DashboardHeader
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            onNavigate={setActiveView}
            profile={profile}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50 p-6 md:p-10 no-scrollbar">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
              
              {activeView === 'home' && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {getGreeting()}, {profile.name}
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Your posture metrics for today.</p>
                  </header>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatsCard 
                        title="Today's Score" 
                        value={`${currentScore}%`} 
                        unit="" 
                        trend="+2.5%" 
                        icon={<BoltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />} 
                        iconBg="bg-yellow-100 dark:bg-yellow-900/30"
                     />
                     <StatsCard 
                        title="Active Session" 
                        value={formatTime(totalSessionSeconds)} 
                        unit="today" 
                        trend="+12m" 
                        icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />} 
                        iconBg="bg-blue-100 dark:bg-blue-900/30"
                     />
                     <StatsCard 
                        title="Good Posture" 
                        value={formatTime(goodPostureSeconds)} 
                        unit="time" 
                        trend="+5%" 
                        icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />} 
                        iconBg="bg-green-100 dark:bg-green-900/30"
                     />
                  </div>

                  {/* Clean Dashboard: Goals & Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     
                     <div className="space-y-8">
                        {/* Quick Action to Start Live Tracking */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                                <VideoCameraIcon className="w-32 h-32" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 relative z-10">Start Live Tracking</h3>
                            <p className="text-orange-100 mb-6 max-w-sm relative z-10">Launch the camera to begin your real-time posture analysis session.</p>
                            <button 
                                onClick={() => setActiveView('live')}
                                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-50 transition-colors shadow-md relative z-10"
                            >
                                Launch Camera <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <GoalProgress 
                           goal={dailyGoal} 
                           progress={currentScore} 
                           onSetGoal={() => setIsGoalModalOpen(true)}
                        />
                     </div>

                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Activity Feed</h3>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">Latest</span>
                        </div>
                        <ActivityFeed onNavigate={setActiveView} history={historyData} />
                     </div>
                  </div>
                </div>
              )}

              {activeView === 'live' && (
                  <LiveTrackingView 
                    videoRef={videoRef}
                    postureStatus={postureStatus}
                    isTracking={isTracking}
                    onToggleTracking={handleToggleTracking}
                    goodPostureSeconds={goodPostureSeconds}
                    totalSessionSeconds={totalSessionSeconds}
                  />
              )}

              {activeView === 'chat' && <Chatbot />}
              
              {activeView === 'history' && (
                  <SessionHistory history={historyData} onClearHistory={handleClearHistory} />
              )}
              
              {activeView === 'goals' && (
                 <GoalsView currentGoal={dailyGoal} onSetGoal={handleSetGoal} />
              )}

              {activeView === 'reports' && (
                 <ReportsView history={historyData} theme={theme} />
              )}

              {activeView === 'settings' && (
                 <SettingsView profile={profile} onUpdateProfile={handleUpdateProfile} />
              )}

             {activeView === ('support' as ViewType) && <SupportView />}
             
             {activeView === 'plans' && <PlansView />}
             
             {activeView === 'badges' && <BadgesView />}

        </main>
      </div>
      {isOnboardingOpen && (
          <OnboardingModal 
            userName={profile.name} 
            onComplete={handleOnboardingComplete}
            onSetGoal={handleSetGoal}
            currentGoal={dailyGoal}
          />
      )}
      {isGoalModalOpen && (
          <SetGoalModal 
             currentGoal={dailyGoal} 
             onClose={() => setIsGoalModalOpen(false)} 
             onSave={handleSetGoal} 
          />
      )}
    </div>
  );
};

export default DashboardPage;