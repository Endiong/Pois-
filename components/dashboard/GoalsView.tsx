import React from 'react';
import { TrophyIcon, TargetIcon, CheckCircleIcon, CalendarIcon } from '../icons/Icons';

interface GoalsViewProps {
  currentGoal: number;
  onSetGoal: (goal: number) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ currentGoal, onSetGoal }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Goals</h2>
        <p className="text-gray-500 mt-1">Set targets and track your consistency.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <TargetIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Daily Posture Goal</h3>
              <p className="text-gray-500 dark:text-gray-400">Target percentage for active sessions</p>
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <span className="text-6xl font-bold text-blue-600 dark:text-blue-400">{currentGoal}%</span>
            <p className="text-sm text-gray-500 mt-2">Current Target</p>
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adjust Goal</label>
             <input 
                type="range" 
                min="50" 
                max="95" 
                step="5"
                value={currentGoal}
                onChange={(e) => onSetGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
             <div className="flex justify-between text-xs text-gray-500">
                <span>50% (Beginner)</span>
                <span>95% (Expert)</span>
             </div>
          </div>
        </div>

        <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                   <TrophyIcon className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                   <p className="text-2xl font-bold text-gray-900 dark:text-white">3 Days</p>
                </div>
             </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" /> Weekly Consistency
                </h3>
                <div className="flex justify-between items-end h-32 px-2">
                    {[60, 45, 80, 70, 0, 0, 0].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-full">
                             <div className="w-full max-w-[24px] bg-gray-100 dark:bg-gray-700 rounded-t-lg h-full relative">
                                <div 
                                    className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${h >= currentGoal ? 'bg-green-500' : 'bg-blue-500'}`} 
                                    style={{ height: `${h}%` }}
                                ></div>
                             </div>
                             <span className="text-xs text-gray-400">
                                {['M','T','W','T','F','S','S'][i]}
                             </span>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsView;