

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CameraView from '../components/dashboard/CameraView';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import GoalProgress from '../components/dashboard/GoalProgress';
import SetGoalModal from '../components/dashboard/SetGoalModal';
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

type Theme = 'light' | 'dark';
type UserProfile = {
  name: string;
  avatar: string;
};

// Sub-component: Sidebar Navigation
const Sidebar: React.FC<{ 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void; 
  onLogout: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({ activeView, setActiveView, onLogout, isMinimized, onToggleMinimize }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'live', label: 'Live Tracking', icon: <CameraIcon />, special: true },
    { id: 'history', label: 'History', icon: <ChartBarSquareIcon /> },
    { id: 'chat', label: 'AI Assistant', icon: <ChatBubbleIcon /> },
    { id: 'goals', label: 'Goals', icon: <TargetIcon />, pro: true },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon />, pro: true },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5"/> },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <button
      onClick={() => setActiveView(item.id as ViewType)}
      disabled={item.pro}
      className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${ isMinimized ? 'justify-center' : ''} ${
        activeView === item.id 
          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' 
          : item.special
            ? 'bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200/60 dark:hover:bg-blue-900/50 ring-1 ring-inset ring-blue-500/20'
            : item.pro
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={isMinimized ? item.label : ''}
    >
      {item.icon}
      <span className={isMinimized ? 'hidden' : 'block'}>{item.label}</span>
      {item.pro && !isMinimized && 
        <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-100/60 dark:bg-amber-500/20 px-2 py-0.5 rounded-full">
          <LockClosedIcon className="w-3 h-3" />
          PRO
        </span>
      }
    </button>
  );

  return (
    <aside className={`flex flex-col bg-gray-50/70 dark:bg-gray-800/70 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`flex items-center gap-2 mb-8 ${isMinimized ? 'justify-center' : ''}`}>
          {isMinimized ? <PoiséIcon /> : <span className="text-2xl font-logo tracking-tight text-gray-900 dark:text-white">poisé</span>}
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => <NavLink key={item.id} item={item} />)}
        </nav>
        <div className="mt-auto space-y-2 pt-4">
          <div className={`p-4 rounded-lg text-center transition-all duration-300 ${isMinimized ? 'bg-transparent' : 'bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50'}`}>
              <h4 className={`font-bold text-blue-900 dark:text-blue-200 ${isMinimized ? 'hidden' : 'block'}`}>Upgrade to Pro</h4>
              <p className={`text-xs text-blue-800/80 dark:text-blue-300/80 mt-1 mb-3 ${isMinimized ? 'hidden' : 'block'}`}>Get detailed analytics and personalized plans.</p>
              <button onClick={() => setActiveView('plans')} className={`w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors ${isMinimized ? 'w-auto p-2' : ''}`}>
                {isMinimized ? <RocketLaunchIcon /> : 'Upgrade'}
              </button>
          </div>
          <button className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Help & Information' : ''}>
            <InfoCircleIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Help & Information</span>
          </button>
          <button onClick={onLogout} className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isMinimized ? 'justify-center' : ''}`} title={isMinimized ? 'Log out' : ''}>
            <LogoutIcon /> <span className={isMinimized ? 'hidden' : 'block'}>Log out</span>
          </button>
        </div>
      </div>
      
      <div className={`pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex ${isMinimized ? 'justify-center' : 'justify-end'}`}>
           <button 
             onClick={onToggleMinimize} 
             className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             title={isMinimized ? 'Expand Sidebar' : 'Collapse Sidebar'}
           >
              {isMinimized ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
           </button>
      </div>
    </aside>
  );
};

const DashboardHeader: React.FC<{
  theme: Theme;
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (view: ViewType) => void;
  profile: UserProfile;
}> = ({ theme, onToggleTheme, onLogout, onNavigate, profile }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>, close: () => void) => {
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
            close();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [ref, close]);
    };

    useOutsideAlerter(profileMenuRef, () => setIsProfileMenuOpen(false));
    useOutsideAlerter(notificationMenuRef, () => setIsNotificationMenuOpen(false));

    const notifications = [
        { icon: <CheckBadgeIcon className="w-5 h-5 text-green-500"/>, text: "You hit your daily goal yesterday!", time: "1 day ago"},
        { icon: <ThumbsUpIcon className="w-5 h-5 text-blue-500" />, text: "New weekly report is ready to view.", time: "2 days ago"},
        { icon: <InfoCircleIcon className="w-5 h-5 text-yellow-500" />, text: "Tip: Try taking a short walk every hour.", time: "4 days ago"},
    ];

    return (
        <header className="flex-shrink-0 flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70">
            <div className="flex items-center gap-4">
                 <button onClick={onToggleTheme} title={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'} className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <div className="relative" ref={notificationMenuRef}>
                    <button onClick={() => setIsNotificationMenuOpen(prev => !prev)} title="Notifications" className="relative p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900/50"></span>
                    </button>
                    {isNotificationMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-50">
                            <div className="p-2">
                                <h3 className="px-2 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                                <ul className="mt-1">
                                    {notifications.map((n, i) => (
                                        <li key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <div className="flex-shrink-0 mt-0.5">{n.icon}</div>
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{n.time}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(prev => !prev)}
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
                        aria-expanded={isProfileMenuOpen}
                        aria-haspopup="true"
                    >
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="h-10 w-10 rounded-full"
                            src={profile.avatar}
                            alt="User avatar"
                        />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-50">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{profile.name.toLowerCase()}</p>
                        </div>
                        <button onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</button>
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                </div>
            </div>
        </header>
    );
}

// Sub-component for Posture Breakdown Pie Chart
const PostureBreakdownChart: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const data = [{ name: 'Good Posture', value: 75 }, { name: 'Poor Posture', value: 25 }];
  const COLORS = ['#10B981', '#F97316']; // emerald-500, orange-500
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const tooltipBg = theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const tooltipBorder = theme === 'dark' ? '#4b5563' : '#ccc';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Posture Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
              }}
               labelStyle={{ color: theme === 'dark' ? '#f3f4f6' : '#374151' }}
            />
            <Legend wrapperStyle={{ color: textColor, fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// Sub-component for Daily Activity Heatmap
const ActivityHeatmap: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  // Generate dummy data for the last 119 days (17 weeks)
  const days = Array.from({ length: 119 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date,
      level: Math.floor(Math.random() * 5), // 0-4 activity levels
    };
  }).reverse();

  const getColor = (level: number) => {
    if (theme === 'dark') {
      const colors = ['#1f2937', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6']; // gray-800 to blue-500
      return colors[level];
    }
    const colors = ['#f3f4f6', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa']; // gray-100 to blue-400
    return colors[level];
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Activity</h3>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 pb-1">
            <span>M</span>
            <span>W</span>
            <span>F</span>
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
          {days.map((day, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getColor(day.level) }}
              title={`${day.date.toDateString()}: Level ${day.level}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// Sub-component for Home View content
const HomeView: React.FC<{theme: Theme, profile: UserProfile, history: PostureHistoryItem[]}> = ({ theme, profile, history }) => {
  const [period, setPeriod] = useState('This Week');
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const periodMenuRef = useRef<HTMLDivElement>(null);
  
  useOutsideAlerter(periodMenuRef, () => setIsPeriodMenuOpen(false));
  
  const generateChartData = (days: number) => {
    return Array.from({length: days}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        // Find if there is a session on this day
        const session = history.find(h => new Date(h.date).toDateString() === d.toDateString());
        const score = session ? (session.goodDuration / session.duration) * 100 : Math.floor(80 + Math.random() * 15);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: Math.round(score)
        };
    });
  };

  const data = period === 'This Week' ? generateChartData(7) : generateChartData(14);

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hello, {profile.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your posture summary for the week.</p>
            </div>
            <div className="relative" ref={periodMenuRef}>
                <button onClick={() => setIsPeriodMenuOpen(prev => !prev)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                    <span>{period}</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                {isPeriodMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                            <button onClick={() => { setPeriod('This Week'); setIsPeriodMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">This Week</button>
                            <button onClick={() => { setPeriod('Last 14 Days'); setIsPeriodMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Last 14 Days</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart theme={theme} data={data}/>
          </div>
          <PostureBreakdownChart theme={theme} />
          <ActivityHeatmap theme={theme} />
      </div>
    </>
  );
};

// Sub-component for Live Tracking View content
const LiveView: React.FC<{ 
  onSessionEnd: (session: PostureHistoryItem) => void; 
  dailyGoal: number; 
  onSetGoal: (newGoal: number) => void;
}> = ({ onSessionEnd, dailyGoal, onSetGoal }) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds } = usePostureTracker({
    onPostureChange: () => {},
    enabled: cameraEnabled,
    onSessionEnd: onSessionEnd,
  });

  const handleToggleCamera = () => {
    if (cameraEnabled) {
      stopCamera();
      setCameraEnabled(false);
    } else {
      startCamera();
      setCameraEnabled(true);
    }
  };
  
  const handleSaveGoal = (goal: number) => {
    onSetGoal(goal);
    setIsGoalModalOpen(false);
  }

  const currentProgress = totalSessionSeconds > 0 ? (goodPostureSeconds / totalSessionSeconds) * 100 : 0;

  return (
    <div>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <CameraIcon className="w-6 h-6 text-blue-600 dark:text-blue-300"/>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Posture Tracking</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
                <CameraView
                    videoRef={videoRef}
                    postureStatus={postureStatus}
                    onToggleCamera={handleToggleCamera}
                    isCameraEnabled={cameraEnabled}
                />
            </div>
            <div className="lg:col-span-1">
                 <GoalProgress goal={dailyGoal} progress={currentProgress} onSetGoal={() => setIsGoalModalOpen(true)} />
            </div>
        </div>
        {isGoalModalOpen && <SetGoalModal currentGoal={dailyGoal} onClose={() => setIsGoalModalOpen(false)} onSave={handleSaveGoal} />}
    </div>
  );
};

// Sub-component for History View content
const HistoryView: React.FC<{ history: PostureHistoryItem[] }> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <ChartBarSquareIcon className="w-6 h-6 text-gray-800 dark:text-white"/>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session History</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
            <div className="text-center">
                <ChartBarSquareIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2"/>
                <p className="text-gray-500 dark:text-gray-400">
                    No history yet.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start a "Live Tracking" session to record your posture data.</p>
            </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <ChartBarSquareIcon className="w-6 h-6 text-gray-800 dark:text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session History</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((session, index) => {
            const score = session.duration > 0 ? Math.round((session.goodDuration / session.duration) * 100) : 0;
            const durationHours = Math.floor(session.duration / 3600);
            const durationMinutes = Math.floor((session.duration % 3600) / 60);
            const durationString = durationHours > 0 ? `${durationHours}h ${durationMinutes}m` : `${durationMinutes}m`;
            
            return (
            <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                    <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{new Date(session.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>{durationString} active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right flex items-center gap-3">
                    <div className={`font-bold text-xl ${score >= 90 ? 'text-green-500' : score >= 80 ? 'text-blue-500' : 'text-orange-500'}`}>{score}%</div>
                </div>
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <DotsHorizontal />
                </button>
              </div>
            </li>
          )})}
        </ul>
      </div>
    </div>
  );
};

const SettingsView: React.FC<{
  profile: UserProfile;
  onProfileChange: (newProfile: UserProfile) => void;
}> = ({ profile, onProfileChange }) => {
    const [fullName, setFullName] = useState(profile.name);
    const [avatar, setAvatar] = useState(profile.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newAvatarUrl = URL.createObjectURL(file);
            setAvatar(newAvatarUrl);
        }
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        onProfileChange({ name: fullName, avatar });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
            <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Picture</h2>
                        <img src={avatar} alt="Current avatar" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"/>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden"/>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <UploadIcon />
                            <span>Upload New Picture</span>
                        </button>
                     </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Personal Information</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your personal details.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="full-name">Full Name</label>
                                <input type="text" id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email-address">Email Address</label>
                                <input type="email" id="email-address" value="margaret@example.com" disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500 dark:text-gray-400"/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button type="submit" className="px-6 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    );
};

const PlansView: React.FC<{setActiveView: (view: ViewType) => void}> = ({setActiveView}) => {
    const freeFeatures = ["Real-Time Posture Tracking", "Basic Posture History", "AI Assistant Chat", "Daily Goal Setting"];
    const proFeatures = ["Everything in Free", "Advanced Analytics & Reports", "Personalized Goals & Plans", "Achievement Badges", "Priority Support"];

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">Unlock your full potential with Poisé Pro or get started for free.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Free</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">For individuals getting started with posture improvement.</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white my-6">$0 <span className="text-lg font-medium text-gray-500 dark:text-gray-400">/ month</span></p>
                    <ul className="space-y-3 flex-grow">
                        {freeFeatures.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-500"/>
                                <span className="text-gray-700 dark:text-gray-300">{f}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setActiveView('home')} className="mt-8 w-full py-3 rounded-full font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Continue with Free
                    </button>
                </div>
                {/* Pro Plan */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-blue-500 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500 text-white text-xs font-semibold rounded-bl-lg">POPULAR</div>
                    <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Pro</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">For users dedicated to achieving their best posture.</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white my-6">$9 <span className="text-lg font-medium text-gray-500 dark:text-gray-400">/ month</span></p>
                    <ul className="space-y-3 flex-grow">
                        {proFeatures.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-blue-500"/>
                                <span className="text-gray-700 dark:text-gray-300">{f}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-8 w-full py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
};


// Sub-component for placeholder views
const PlaceholderView: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-3">{icon} {title}</h1>
        <div className="mt-8 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
                <LockClosedIcon className="w-10 h-10 text-amber-400 mx-auto mb-2"/>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">This is a PRO feature</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Upgrade to unlock {title.toLowerCase()} and advanced analytics.</p>
            </div>
        </div>
    </div>
);

function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, close: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                close();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, close]);
}

// Main Dashboard Page Component
const DashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [dailyGoal, setDailyGoal] = useState<number>(() => loadState<number>(GOAL_STORAGE_KEY) ?? 70);
  const [historyData, setHistoryData] = useState<PostureHistoryItem[]>(() => loadState<PostureHistoryItem[]>(HISTORY_STORAGE_KEY) ?? []);
  const [profile, setProfile] = useState<UserProfile>(() => loadState<UserProfile>(USER_PROFILE_KEY) ?? { name: 'Margaret', avatar: 'https://i.pravatar.cc/150?u=margaret' });


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Set body background color based on theme
    document.body.style.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
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

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomeView theme={theme} profile={profile} history={historyData}/>;
      case 'live':
        return <LiveView onSessionEnd={handleSessionEnd} dailyGoal={dailyGoal} onSetGoal={handleSetGoal} />;
      case 'history':
        return <HistoryView history={historyData} />;
       case 'chat':
        return <Chatbot />;
      case 'settings':
        return <SettingsView profile={profile} onProfileChange={handleProfileChange}/>;
      case 'goals':
        return <PlaceholderView title="Goals" icon={<TargetIcon />} />;
      case 'reports':
        return <PlaceholderView title="Reports" icon={<ReportsIcon />} />;
      case 'plans':
        return <PlansView setActiveView={setActiveView} />;
      default:
        return <HomeView theme={theme} profile={profile} history={historyData}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 font-sans overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={onLogout}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={() => setIsSidebarMinimized(prev => !prev)}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100/50 dark:bg-gray-900/50">
        <DashboardHeader
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            onLogout={onLogout}
            onNavigate={setActiveView}
            profile={profile}
        />
        <main className="flex-1 overflow-y-auto p-8">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;