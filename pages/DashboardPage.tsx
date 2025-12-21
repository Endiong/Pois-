
import React, { useState, useEffect, useRef, useMemo } from 'react';
import CameraView from '../components/dashboard/CameraView';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
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
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import OnboardingModal from '../components/dashboard/OnboardingModal';
import usePostureTracker from '../hooks/usePostureTracker';
import { ViewType, PostureHistoryItem, LayoutMode } from '../types';
import Chatbot from '../components/dashboard/Chatbot';
import { getPostureTip } from '../services/geminiService';
import { 
  HomeIcon, VideoCameraIcon, SettingsIcon, LogoutIcon, 
  ClockIcon, CheckBadgeIcon, BellIcon,
  MoonIcon, SunIcon, PoiséIcon, ChevronDownIcon,
  ChatBubbleIcon, ChevronLeftIcon, ChevronRightIcon,
  TrophyIcon, HeadphonesIcon,
  BoltIcon, FireIcon, MedalIcon, ReportsIcon, ChartBarSquareIcon, ArrowRightIcon,
  UserCheckIcon, TargetIcon, CloseIcon, UserCircleIcon, SparklesIcon
} from '../components/icons/Icons';
import { loadState, saveState } from '../utils/storage';

const GOAL_STORAGE_KEY = 'poise-daily-goal';
const SESSION_GOAL_STORAGE_KEY = 'poise-session-goal';
const FOCUS_AREA_STORAGE_KEY = 'poise-focus-area';
const HISTORY_STORAGE_KEY = 'poise-session-history';
const USER_PROFILE_KEY = 'poise-user-profile';
const ONBOARDING_COMPLETED_KEY = 'poise-onboarding-completed';
const LAYOUT_PREF_KEY = 'poise-layout-preference';
const LATEST_TIP_KEY = 'poise-latest-tip';

type Theme = 'light' | 'dark';
type UserProfile = {
  name: string;
  avatar: string;
  email?: string;
};

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Layout Preference State
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => loadState(LAYOUT_PREF_KEY) || 'sidebar');

  const [profile, setProfile] = useState<UserProfile>(() => loadState(USER_PROFILE_KEY) || {
    name: 'Margaret',
    avatar: '', // Default blank avatar
    email: 'margaret@example.com'
  });
  
  const [dailyGoal, setDailyGoal] = useState<number>(() => loadState(GOAL_STORAGE_KEY) || 60); // Posture Score Goal
  const [dailySessionGoal, setDailySessionGoal] = useState<number>(() => loadState(SESSION_GOAL_STORAGE_KEY) || 2); // Hours Goal
  const [focusArea, setFocusArea] = useState<string>(() => loadState(FOCUS_AREA_STORAGE_KEY) || 'Spine Neutral');

  const [history, setHistory] = useState<PostureHistoryItem[]>(() => loadState(HISTORY_STORAGE_KEY) || []);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => loadState(ONBOARDING_COMPLETED_KEY) || false);
  const [lastTip, setLastTip] = useState<string>(() => loadState(LATEST_TIP_KEY) || "Align your ears with your shoulders.");
  
  const [isTracking, setIsTracking] = useState(false);
  const [liveTip, setLiveTip] = useState<string>(lastTip);

  const handleSessionEnd = (session: PostureHistoryItem) => {
    const newHistory = [session, ...history];
    setHistory(newHistory);
    saveState(HISTORY_STORAGE_KEY, newHistory);
  };

  const { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds, isModelReady } = usePostureTracker({
    onPostureChange: (status) => {},
    enabled: isTracking,
    onSessionEnd: handleSessionEnd
  });

  // Dynamic Tip Rotation
  useEffect(() => {
    let interval: number;
    if (isTracking && isModelReady) {
        // Fetch a new tip every 30 seconds or when status changes to bad
        const updateTip = async () => {
             const tip = await getPostureTip(postureStatus);
             setLiveTip(tip);
             setLastTip(tip); // Update the global dashboard state
             saveState(LATEST_TIP_KEY, tip); // Persist
        };
        
        // Initial fetch
        updateTip();

        interval = window.setInterval(updateTip, 30000); 
    }
    return () => clearInterval(interval);
  }, [isTracking, isModelReady, postureStatus]);

  const toggleTracking = () => {
    if (isTracking) {
      stopCamera();
      setIsTracking(false);
    } else {
      startCamera();
      setIsTracking(true);
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
      setProfile(newProfile);
      saveState(USER_PROFILE_KEY, newProfile);
  };

  const handleSetGoal = (newGoal: number) => {
      setDailyGoal(newGoal);
      saveState(GOAL_STORAGE_KEY, newGoal);
  };

  const handleSetSessionGoal = (newGoal: number) => {
      setDailySessionGoal(newGoal);
      saveState(SESSION_GOAL_STORAGE_KEY, newGoal);
  };
  
  const handleSetFocusArea = (area: string) => {
      setFocusArea(area);
      saveState(FOCUS_AREA_STORAGE_KEY, area);
  }

  const handleUpdateLayout = (mode: LayoutMode) => {
      setLayoutMode(mode);
      saveState(LAYOUT_PREF_KEY, mode);
  };

  const handleCompleteOnboarding = () => {
      setHasCompletedOnboarding(true);
      saveState(ONBOARDING_COMPLETED_KEY, true);
      setActiveView('home');
  };

  const handleClearHistory = () => {
      if(window.confirm("Are you sure you want to clear your history?")) {
          setHistory([]);
          saveState(HISTORY_STORAGE_KEY, []);
      }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Calculate Sessions Completed Today (including current live session)
  const sessionsCompletedToday = useMemo(() => {
      const today = new Date().toDateString();
      const historySeconds = history
          .filter(h => new Date(h.date).toDateString() === today)
          .reduce((sum, h) => sum + h.duration, 0);
      
      const totalSeconds = historySeconds + totalSessionSeconds;
      return (totalSeconds / 3600).toFixed(1); // 1 Session = 1 Hour
  }, [history, totalSessionSeconds]);

  // Calculate Streak
  const currentStreak = useMemo(() => {
    if (history.length === 0) return 0;
    
    // Get unique dates from history in YYYY-MM-DD format
    const uniqueDates = (Array.from(new Set(
        history.map(h => {
            const d = new Date(h.date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
    )) as string[]).sort().reverse(); // Sort descending
    
    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const latestDate = uniqueDates[0];
    if (latestDate !== todayStr && latestDate !== yesterdayStr && !isTracking) {
        return 0;
    }

    let streak = 0;
    let expectedDate = new Date(latestDate); 

    for (const dateStr of uniqueDates) {
        const currentCheck = new Date(dateStr);
        const diffTime = Math.abs(expectedDate.getTime() - currentCheck.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays <= 1) { 
            streak++;
            expectedDate = new Date(currentCheck);
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
  }, [history, isTracking]);

  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'live', label: 'Live', icon: <VideoCameraIcon /> },
    { id: 'history', label: 'History', icon: <ChartBarSquareIcon /> },
    { id: 'chat', label: 'Atlas', icon: <ChatBubbleIcon /> },
    { id: 'goals', label: 'Goals', icon: <TargetIcon /> }, 
    { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    { id: 'badges', label: 'Badges', icon: <CheckBadgeIcon /> },
  ];

  const getPageTitle = (view: ViewType) => {
      switch(view) {
          case 'home': return 'Dashboard';
          case 'live': return 'Live Tracking';
          case 'history': return 'Session History';
          case 'chat': return 'Atlas AI Coach';
          case 'goals': return 'Goals & Targets';
          case 'reports': return 'Analytics Reports';
          case 'badges': return 'Achievements';
          case 'settings': return 'Settings';
          case 'plans': return 'Upgrade Plan';
          case 'support': return 'Help & Support';
          default: return 'Dashboard';
      }
  };

  const showSidebarDesktop = layoutMode === 'sidebar';

  const AvatarPlaceholder = ({ className }: { className: string }) => (
    <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden`}>
       <UserCircleIcon className="w-full h-full p-1" />
    </div>
  );

  return (
    <div className={`h-[100dvh] bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans ${theme} ${showSidebarDesktop ? 'flex overflow-hidden' : 'block overflow-auto'}`}>
       
       {/* ==================== MOBILE HEADER ==================== */}
       <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-2 text-gray-900 dark:text-white">
               <PoiséIcon className="w-8 h-8" />
               <span className="text-xl font-logo font-bold">poisé</span>
           </div>
           
           <div className="flex items-center gap-3">
               {/* Persistent Mobile Streak */}
               <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                   <FireIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                   <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{currentStreak}</span>
               </div>

               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                   {isMobileMenuOpen ? <CloseIcon /> : (
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <line x1="3" y1="12" x2="21" y2="12"></line>
                           <line x1="3" y1="6" x2="21" y2="6"></line>
                           <line x1="3" y1="18" x2="21" y2="18"></line>
                       </svg>
                   )}
               </button>
           </div>
       </div>

       {/* ==================== SIDEBAR ==================== */}
       <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${showSidebarDesktop ? 'md:translate-x-0 md:static md:h-screen' : 'md:hidden'}
            mt-16 md:mt-0 shadow-2xl md:shadow-none
       `}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 hidden md:flex text-gray-900 dark:text-white">
              <div className="flex items-center">
                <PoiséIcon className="w-8 h-8 mr-3" />
                <span className="text-2xl font-logo tracking-tight">poisé</span>
              </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
              {/* Removed Sidebar Streak Card as requested */}

              {mainNavItems.map(item => (
                  <button
                      key={item.id}
                      onClick={() => { setActiveView(item.id as ViewType); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                          ${activeView === item.id 
                              ? 'bg-black text-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-white dark:text-black' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                          }
                      `}
                  >
                      <span className={`w-5 h-5 ${activeView === item.id ? '' : 'opacity-70'}`}>{item.icon}</span>
                      {item.label}
                  </button>
              ))}

              <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>

              <button
                  onClick={() => { setActiveView('support'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeView === 'support' 
                          ? 'bg-black text-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-white dark:text-black' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                      }
                  `}
              >
                  <span className={`w-5 h-5 ${activeView === 'support' ? '' : 'opacity-70'}`}><HeadphonesIcon /></span>
                  Support
              </button>

              <div className="mt-auto pt-4">
                  <div 
                    onClick={() => { setActiveView('plans'); setIsMobileMenuOpen(false); }}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                  >
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <BoltIcon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
                      </div>
                      <div className="relative z-10">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">
                              <BoltIcon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-bold text-lg mb-1">Upgrade to Pro</h4>
                          <p className="text-indigo-100 text-xs mb-3">Unlock unlimited tracking & advanced insights.</p>
                          <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-2 rounded-lg w-full hover:bg-indigo-50 transition-colors">
                              View Plans
                          </button>
                      </div>
                  </div>
              </div>
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-4 px-2">
                   <div className="relative">
                       {profile.avatar ? (
                         <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                       ) : (
                         <AvatarPlaceholder className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
                       )}
                   </div>
                   <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{profile.name}</p>
                       <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                   </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                   <button 
                      onClick={() => { setActiveView('settings'); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      title="Settings"
                   >
                       <SettingsIcon className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={onLogout}
                      className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      title="Logout"
                   >
                       <LogoutIcon className="w-4 h-4" />
                   </button>
              </div>
          </div>
       </aside>

       {/* ==================== TOP NAV (Desktop - Icon Only) ==================== */}
       {!showSidebarDesktop && (
           <header className="hidden md:block sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
              <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                      <div className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white" onClick={() => setActiveView('home')}>
                          <PoiséIcon className="w-8 h-8" />
                          <span className="text-2xl font-logo tracking-tight">poisé</span>
                      </div>

                      <nav className="flex items-center space-x-1">
                          {mainNavItems.map(item => (
                              <button
                                  key={item.id}
                                  onClick={() => setActiveView(item.id as ViewType)}
                                  className={`
                                      group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                                      ${activeView === item.id 
                                          ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800' 
                                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50'
                                      }
                                  `}
                              >
                                  <span className="w-5 h-5">{item.icon}</span>
                                  
                                  {/* Tooltip */}
                                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                      {item.label}
                                  </span>
                              </button>
                          ))}
                      </nav>

                      <div className="flex items-center gap-3">
                          {/* Desktop Top Nav Streak */}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/50 mr-2">
                              <FireIcon className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{currentStreak}</span>
                          </div>

                          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                          </button>
                          
                          <div className="relative" ref={profileMenuRef}>
                              <button 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 pl-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors p-1"
                              >
                                  {profile.avatar ? (
                                     <img src={profile.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                                  ) : (
                                     <AvatarPlaceholder className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                                  )}
                                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                              </button>

                              {isProfileMenuOpen && (
                                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.name}</p>
                                          <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                                      </div>
                                      <div className="py-1">
                                          <button onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                              <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                                          </button>
                                          <button onClick={() => { setActiveView('support'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                              <HeadphonesIcon className="w-4 h-4 mr-2" /> Support
                                          </button>
                                          <button onClick={() => { setActiveView('plans'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                              <BoltIcon className="w-4 h-4 mr-2" /> Upgrade Plan
                                          </button>
                                      </div>
                                      <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                                          <button onClick={onLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                              <LogoutIcon className="w-4 h-4 mr-2" /> Logout
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
           </header>
       )}

       {/* Main Content Area */}
       <main className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full ${showSidebarDesktop ? 'md:pt-0' : ''} pt-16`}>
             
             {(showSidebarDesktop || isMobileMenuOpen === false) && (
                 <header className={`flex justify-between items-center px-6 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-30 border-b border-transparent ${!showSidebarDesktop ? 'md:hidden' : ''}`}>
                      <div>
                          {/* Dynamic Page Title */}
                          <div className="animate-in fade-in slide-in-from-left-2">
                              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{getPageTitle(activeView)}</h1>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          {/* Desktop Sidebar Streak Indicator */}
                          {showSidebarDesktop && (
                             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/50 mr-2">
                                <FireIcon className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{currentStreak}</span>
                             </div>
                          )}

                          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                          </button>
                          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                              <BellIcon className="w-6 h-6" />
                              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                          </button>
                      </div>
                 </header>
             )}

             <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth pb-20">
                 {/* Updated max-width for better horizontal scaling */}
                 <div className={`mx-auto space-y-8 animate-in fade-in duration-500 ${!showSidebarDesktop ? 'w-full max-w-[1600px] px-2 md:px-6' : 'max-w-7xl'}`}>
                     {activeView === 'home' && (
                         <div className="space-y-8">
                             {/* Hero Welcome & Streak Section */}
                             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                                {/* Welcome Card */}
                                <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back, {profile.name.split(' ')[0]} 👋</h1>
                                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Ready to improve your posture today?</p>
                                </div>

                                {/* The Hero Streak Card */}
                                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center min-h-[160px]">
                                     <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110 duration-700">
                                        <FireIcon className="w-40 h-40" />
                                     </div>
                                     <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2 opacity-90">
                                            <FireIcon className="w-5 h-5 animate-pulse" />
                                            <span className="text-sm font-bold uppercase tracking-wider">Current Streak</span>
                                        </div>
                                        <div className="text-6xl font-black tracking-tight">{currentStreak} <span className="text-2xl font-medium opacity-80">Days</span></div>
                                     </div>
                                </div>
                             </div>

                             {/* New User Empty State - "Start Live" CTA (Wider & Minimalist) */}
                             {history.length === 0 && (
                                <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="relative z-10 max-w-2xl">
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Let's improve your posture!</h2>
                                        <p className="text-indigo-100 text-base md:text-lg mb-0">
                                            Start your first live session to get real-time feedback.
                                        </p>
                                    </div>
                                    <div className="relative z-10 flex-shrink-0">
                                        <button 
                                            onClick={() => setActiveView('live')}
                                            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <VideoCameraIcon className="w-5 h-5" /> Start First Session
                                        </button>
                                    </div>
                                    {/* Decorative Icon */}
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
                                        <BoltIcon className="w-64 h-64" />
                                    </div>
                                </div>
                             )}

                             {/* Top Row: Stats Cards */}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsCard 
                                    title="Sessions Today" 
                                    value={sessionsCompletedToday} 
                                    unit="Hrs" 
                                    trend={`${parseFloat(sessionsCompletedToday) >= dailySessionGoal ? 'Goal Met' : `${Math.round((parseFloat(sessionsCompletedToday)/dailySessionGoal)*100)}%`}`} 
                                    icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400"/>} 
                                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                                />
                                <StatsCard 
                                    title="Current Posture" 
                                    value={isTracking ? postureStatus : 'Off'} 
                                    unit="" 
                                    trend={isTracking && postureStatus === 'Good Posture' ? 'Great' : '---'} 
                                    icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400"/>} 
                                    iconBg="bg-green-100 dark:bg-green-900/30"
                                />
                                <StatsCard 
                                    title="Posture Goal" 
                                    value={`${dailyGoal}%`} 
                                    unit="Target" 
                                    trend="On Track" 
                                    icon={<TargetIcon className="w-6 h-6 text-purple-600 dark:text-purple-400"/>} 
                                    iconBg="bg-purple-100 dark:bg-purple-900/30"
                                />
                             </div>

                             {/* Middle Row: Heatmap and Weekly Chart */}
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                                 {/* Heatmap takes 2/3 width */}
                                 <div className="lg:col-span-2 h-full">
                                     <ActivityHeatmap historyData={history} theme={theme} />
                                 </div>
                                 
                                 {/* Analytics Chart */}
                                 <div className="lg:col-span-1 h-full min-h-[320px]">
                                    <AnalyticsChart theme={theme} data={history.map(h => ({ date: new Date(h.date).toLocaleDateString(undefined, {weekday: 'short'}), score: Math.round((h.goodDuration/h.duration)*100) })).slice(0, 7)} />
                                 </div>
                             </div>

                             {/* Bottom Row: Activity Feed - Only show if history exists */}
                             {history.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Latest Activity</h3>
                                    <ActivityFeed 
                                        onNavigate={setActiveView} 
                                        history={history} 
                                        lastTip={lastTip}
                                        currentGoal={dailyGoal}
                                    />
                                </div>
                             )}
                         </div>
                     )}

                     {activeView === 'live' && (
                         <LiveTrackingView 
                            videoRef={videoRef}
                            postureStatus={postureStatus}
                            isTracking={isTracking}
                            onToggleTracking={toggleTracking}
                            goodPostureSeconds={goodPostureSeconds}
                            totalSessionSeconds={totalSessionSeconds}
                            currentTip={liveTip}
                            isModelReady={isModelReady}
                         />
                     )}

                     {activeView === 'history' && <SessionHistory history={history} onClearHistory={handleClearHistory} />}
                     
                     {activeView === 'goals' && (
                        <GoalsView 
                            currentGoal={dailyGoal} 
                            onSetGoal={handleSetGoal} 
                            sessionGoal={dailySessionGoal}
                            onSetSessionGoal={handleSetSessionGoal}
                        />
                     )}
                     
                     {activeView === 'reports' && <ReportsView history={history} theme={theme} />}
                     
                     {activeView === 'settings' && (
                         <SettingsView 
                            profile={profile} 
                            onUpdateProfile={handleUpdateProfile}
                            layoutMode={layoutMode}
                            onUpdateLayout={handleUpdateLayout}
                         />
                     )}

                     {activeView === 'chat' && <Chatbot />}
                     
                     {activeView === 'support' && <SupportView />}
                     
                     {activeView === 'plans' && <PlansView />}

                     {activeView === 'badges' && <BadgesView />}
                 </div>
             </div>
       </main>

       {!hasCompletedOnboarding && (
           <OnboardingModal 
               userName={profile.name}
               onComplete={handleCompleteOnboarding}
               onSetGoal={handleSetGoal}
               onSetSessionGoal={handleSetSessionGoal}
               onSetFocusArea={handleSetFocusArea}
               currentGoal={dailyGoal}
               currentSessionGoal={dailySessionGoal}
               currentFocusArea={focusArea}
           />
       )}
    </div>
  );
};

export default DashboardPage;
