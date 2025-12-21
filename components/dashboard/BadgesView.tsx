
import React from 'react';
import { MedalIcon, StarIcon, FireIcon, ClockIcon, CheckBadgeIcon, TargetIcon, VideoCameraIcon, TrophyIcon, UserCheckIcon, BoltIcon, SparklesIcon, CalendarIcon, UploadIcon, DocumentTextIcon } from '../icons/Icons';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  locked: boolean;
  color: string;
}

const BadgesView: React.FC = () => {
  const badges: Badge[] = [
    // Unlocked / Starter Badges
    { id: '0', name: 'Onboarding Explorer', description: 'Complete the welcome onboarding.', icon: <TrophyIcon className="w-8 h-8"/>, locked: false, color: 'bg-yellow-500' },
    
    // Initially Locked for new user
    { id: '1', name: 'First Steps', description: 'Complete your first tracking session.', icon: <VideoCameraIcon className="w-8 h-8"/>, locked: true, color: 'bg-blue-500' },
    { id: '2', name: 'On Fire', description: 'Reach a 3-day streak.', icon: <FireIcon className="w-8 h-8"/>, locked: true, color: 'bg-orange-500' },
    
    // Intermediate / Locked Badges
    { id: '3', name: 'Goal Crusher', description: 'Hit your daily goal 5 times.', icon: <TargetIcon className="w-8 h-8"/>, locked: true, color: 'bg-green-500' },
    { id: '4', name: 'Weekend Warrior', description: 'Track sessions on Saturday and Sunday.', icon: <CalendarIcon className="w-8 h-8"/>, locked: true, color: 'bg-pink-500' },
    { id: '5', name: 'Week Streak', description: 'Maintain a 7-day active streak.', icon: <FireIcon className="w-8 h-8"/>, locked: true, color: 'bg-red-500' },
    { id: '6', name: 'Marathoner', description: 'Track for 4 hours in one day.', icon: <ClockIcon className="w-8 h-8"/>, locked: true, color: 'bg-purple-500' },
    { id: '7', name: 'Perfectionist', description: 'Maintain 95% score for 1 hour.', icon: <StarIcon className="w-8 h-8"/>, locked: true, color: 'bg-amber-500' },
    
    // Advanced Badges
    { id: '8', name: 'Elite Status', description: 'Subscribe to Pro Plan.', icon: <MedalIcon className="w-8 h-8"/>, locked: true, color: 'bg-indigo-500' },
    { id: '9', name: 'Early Bird', description: 'Complete a session before 8 AM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, locked: true, color: 'bg-teal-500' },
    { id: '10', name: 'Night Owl', description: 'Complete a session after 8 PM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, locked: true, color: 'bg-slate-500' },
    { id: '11', name: 'Posture Pro', description: 'Log 100 total hours of tracking.', icon: <UserCheckIcon className="w-8 h-8"/>, locked: true, color: 'bg-cyan-600' },
    
    // Expert Badges
    { id: '12', name: 'Zen Master', description: '0 Slouch events in a 2hr session.', icon: <BoltIcon className="w-8 h-8"/>, locked: true, color: 'bg-emerald-600' },
    { id: '13', name: 'Monthly Master', description: 'Reach a 30-day streak.', icon: <FireIcon className="w-8 h-8"/>, locked: true, color: 'bg-rose-600' },
    { id: '14', name: 'Data Scientist', description: 'Export your first data report.', icon: <DocumentTextIcon className="w-8 h-8"/>, locked: true, color: 'bg-gray-600' },
    { id: '15', name: 'Comeback Kid', description: 'Return after 1 week absence.', icon: <SparklesIcon className="w-8 h-8"/>, locked: true, color: 'bg-violet-500' },
    { id: '16', name: 'Ergonomic King', description: 'Achieve perfect ergonomic angles.', icon: <CheckBadgeIcon className="w-8 h-8"/>, locked: true, color: 'bg-lime-500' },
    { id: '17', name: 'Social Butterfly', description: 'Share your progress report.', icon: <UploadIcon className="w-8 h-8"/>, locked: true, color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Badges</h2>
        <p className="text-gray-500 mt-1">Earn rewards for building healthy habits. <span className="font-semibold text-gray-900 dark:text-white">{badges.filter(b => !b.locked).length} / {badges.length} Unlocked</span></p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 items-stretch">
        {badges.map((badge) => (
          <div key={badge.id} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center group h-full ${badge.locked ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}>
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg transition-transform group-hover:scale-110 ${badge.locked ? 'bg-gray-300 dark:bg-gray-700 grayscale' : badge.color}`}>
                {badge.icon}
             </div>
             <h3 className={`font-bold text-sm mb-1 ${badge.locked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{badge.name}</h3>
             <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 flex-grow">{badge.description}</p>
             <div className="mt-4 pt-2 w-full flex justify-center mt-auto">
                {badge.locked ? (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
                        Locked
                    </div>
                ) : (
                    <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                        Earned
                    </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesView;
