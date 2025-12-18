import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CameraView from '../components/dashboard/CameraView';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import GoalProgress from '../components/dashboard/GoalProgress';
import SetGoalModal from '../components/dashboard/SetGoalModal';
import OnboardingModal from '../components/dashboard/OnboardingModal';
import usePostureTracker from '../hooks/usePostureTracker';
import { PostureStatus, ViewType, PostureHistoryItem } from '../types';
import Chatbot from '../components/dashboard/Chatbot';
import { 
  HomeIcon, CameraIcon, SettingsIcon, InfoCircleIcon, LogoutIcon, 
  ThumbsUpIcon, ClockIcon, CheckBadgeIcon, CalendarIcon, BellIcon,
  MoonIcon, SunIcon, LockClosedIcon, PoiséIcon, ChevronDownIcon,
  ChatBubbleIcon, ChevronLeftIcon, ChevronRightIcon,
  TargetIcon, ReportsIcon, ChartBarSquareIcon, DotsHorizontal,
  RocketLaunchIcon, UploadIcon, CheckCircleIcon
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
};

const Sidebar: React.FC<{ 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void; 
  onLogout: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({ activeView, setActiveView, onLogout, isMinimized, onToggleMinimize }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'live', label: 'Live Tracking', icon: <CameraIcon />, special: true },
    { id: 'history', label: 'History', icon: <ChartBarSquareIcon /> },
    { id: 'chat', label: 'Poisé Ghost', icon: <ChatBubbleIcon /> },
    { id: 'goals', label: 'Goals', icon: <TargetIcon />, pro: true },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon />, pro: true },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5"/> },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <button
      onClick={() => setActiveView(item.id as ViewType)}
      disabled={item.pro}
      className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${ isMinimized ? 'justify-center' : ''} ${
        activeView === item.id 
          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm' 
          : item.special
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:-translate-y-0.5'
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
    <aside className={`flex flex-col bg-gray-50 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 h-screen ${isMinimized ? 'w-20' : 'w-72'}`}>
      {/* Fixed Top Section */}
      <div className={`flex items-center gap-3 mb-10 px-2 flex-shrink-0 ${isMinimized ? 'justify-center' : ''}`}>
        <PoiséIcon className={`transition-all duration-300 ${isMinimized ? 'w-10 h-6' : 'w-12 h-8'}`} />
        {!isMinimized && <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">poisé</span>}
      </div>

      {/* Scrollable Center Section */}
      <nav className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1">
        {navItems.map(item => <NavLink key={item.id} item={item} />)}
      </nav>

      {/* Fixed Bottom Section */}
      <div className="mt-4 flex-shrink-0 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
        {!isMinimized && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/10 mb-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Upgrade to Pro</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 mb-3">Unlock Ghostie's advanced posture insights.</p>
              <button onClick={() => setActiveView('plans')} className="w-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                Upgrade
              </button>
          </div>
        )}
        <button className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Help' : ''}>
          <InfoCircleIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Support</span>
        </button>
        <button onClick={onLogout} className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Logout' : ''}>
          <LogoutIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Logout</span>
        </button>
        <div className={`pt-2 flex ${isMinimized ? 'justify-center' : 'justify-end'}`}>
           <button 
             onClick={onToggleMinimize} 
             className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
           >
              {isMinimized ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
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
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-40 sticky top-0">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Network Active</span>
            </div>
            <div className="flex items-center gap-6">
                 <button 
                    onClick={onToggleTheme} 
                    className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
                 >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <div className="relative">
                    <button className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-all">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 block h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-900"></span>
                    </button>
                </div>
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(prev => !prev)}
                        className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm"
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
                        </div>
                        <button onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Settings</button>
                        <button onClick={() => { onNavigate('plans'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">Pro Benefits</button>
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
  const [profile, setProfile] = useState<UserProfile>(() => loadState<UserProfile>(USER_PROFILE_KEY) ?? { name: 'Margaret', avatar: 'https://i.pravatar.cc/150?u=margaret' });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !loadState<boolean>(ONBOARDING_COMPLETED_KEY));

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
  };
  
  const handleProfileChange = (newProfile: UserProfile) => {
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

  const handleOnboardingComplete = () => {
      setIsOnboardingOpen(false);
      saveState(ONBOARDING_COMPLETED_KEY, true);
      setActiveView('live');
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
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back, {profile.name}</h1>
                    <p className="text-gray-500 mt-2 text-lg">Poisé Ghost is actively monitoring your posture stats.</p>
                  </header>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:col-span-2">
                       <AnalyticsChart theme={theme} data={[]} />
                    </div>
                  </div>
                </div>
              )}
              {activeView === 'live' && <div className="p-4"><p className="text-2xl font-bold">Live Tracking Placeholder</p></div>}
              {activeView === 'chat' && <Chatbot />}
              {activeView === 'history' && <div className="p-4"><p className="text-2xl font-bold">History Placeholder</p></div>}
              {activeView === 'settings' && <div className="p-4"><p className="text-2xl font-bold">Settings Placeholder</p></div>}
            </div>
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
    </div>
  );
};

export default DashboardPage;