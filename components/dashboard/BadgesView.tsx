import React from 'react';
import { MedalIcon, StarIcon, FireIcon, ClockIcon, CheckBadgeIcon, TargetIcon, VideoCameraIcon } from '../icons/Icons';

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
    { id: '1', name: 'First Steps', description: 'Complete your first tracking session.', icon: <VideoCameraIcon className="w-8 h-8"/>, locked: false, color: 'bg-blue-500' },
    { id: '2', name: 'On Fire', description: 'Reach a 3-day streak.', icon: <FireIcon className="w-8 h-8"/>, locked: false, color: 'bg-orange-500' },
    { id: '3', name: 'Goal Crusher', description: 'Hit your daily goal 5 times.', icon: <TargetIcon className="w-8 h-8"/>, locked: false, color: 'bg-green-500' },
    { id: '4', name: 'Marathoner', description: 'Track for 4 hours in one day.', icon: <ClockIcon className="w-8 h-8"/>, locked: true, color: 'bg-purple-500' },
    { id: '5', name: 'Perfectionist', description: 'Maintain 95% score for 1 hour.', icon: <StarIcon className="w-8 h-8"/>, locked: true, color: 'bg-yellow-500' },
    { id: '6', name: 'Elite Status', description: 'Subscribe to Pro Plan.', icon: <MedalIcon className="w-8 h-8"/>, locked: true, color: 'bg-indigo-500' },
    { id: '7', name: 'Early Bird', description: 'Complete a session before 8 AM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, locked: true, color: 'bg-teal-500' },
    { id: '8', name: 'Night Owl', description: 'Complete a session after 8 PM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, locked: true, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Badges</h2>
        <p className="text-gray-500 mt-1">Earn rewards for building healthy habits.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center ${badge.locked ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60 grayscale' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'}`}>
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg ${badge.locked ? 'bg-gray-300 dark:bg-gray-700' : badge.color}`}>
                {badge.icon}
             </div>
             <h3 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h3>
             <p className="text-xs text-gray-500">{badge.description}</p>
             {badge.locked && (
                 <div className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                     Locked
                 </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesView;