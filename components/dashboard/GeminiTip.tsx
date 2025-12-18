import React from 'react';
import { SparklesIcon, VideoCameraIcon, TrophyIcon, InfoCircleIcon } from '../icons/Icons';
import { ViewType, PostureHistoryItem } from '../../types';

interface Activity {
  type: 'tip' | 'session' | 'goal';
  title: string;
  description: string;
  time: string;
}

const getActivityIcon = (type: Activity['type']) => {
    const commonClass = "w-4 h-4 text-white";
    switch(type) {
        case 'tip': return <SparklesIcon className={commonClass} />;
        case 'session': return <VideoCameraIcon className={commonClass} />;
        case 'goal': return <TrophyIcon className={commonClass} />;
        default: return null;
    }
}
const getIconBgColor = (type: Activity['type']) => {
    switch(type) {
        case 'tip': return 'bg-orange-500';
        case 'session': return 'bg-blue-500';
        case 'goal': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

const ActivityItem: React.FC<{activity: Activity}> = ({ activity }) => {
    return (
        <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full mt-1 ${getIconBgColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                {getActivityIcon(activity.type)}
            </div>
            <div>
                 <p className="text-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{activity.title}</span>
                 </p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                 <div className={`mt-2 text-sm text-gray-700 dark:text-gray-300 ${activity.type === 'tip' ? 'bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg rounded-tl-none' : ''}`}>
                    {activity.description}
                </div>
            </div>
        </div>
    );
};

interface ActivityFeedProps {
    onNavigate: (view: ViewType) => void;
    history: PostureHistoryItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ onNavigate, history }) => {
  // Generate activities based on history + static welcome/tips
  const activities: Activity[] = [];

  // Add latest session if available
  if (history.length > 0) {
      const latest = history[0];
      const score = Math.round((latest.goodDuration / latest.duration) * 100);
      activities.push({
          type: 'session',
          title: 'Session Complete',
          description: `You achieved a ${score}% posture score over ${Math.ceil(latest.duration/60)} minutes.`,
          time: new Date(latest.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
  }

  // Add static tips/goals to fill the feed
  activities.push(
      {
        type: 'tip',
        title: 'Atlas sent a tip',
        description: 'Remember to keep your shoulders relaxed and down, away from your ears.',
        time: history.length > 0 ? 'Yesterday' : 'Just now',
      },
      {
        type: 'goal',
        title: 'Weekly Goal',
        description: 'You are on track to meet your weekly consistency goal.',
        time: '2 days ago',
      }
  );

  return (
    <div className="mt-4">
        {history.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                <InfoCircleIcon className="w-5 h-5 flex-shrink-0 text-blue-500" />
                <p>Start your first live tracking session to see your activity here.</p>
            </div>
        )}
        <div className="space-y-6">
            {activities.slice(0, 4).map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
            ))}
        </div>
        <button 
            onClick={() => onNavigate('history')}
            className="w-full mt-6 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md py-1"
        >
            View Full History
        </button>
    </div>
  );
};

export default ActivityFeed;