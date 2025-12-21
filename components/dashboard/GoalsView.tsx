
import React, { useState } from 'react';
import { TrophyIcon, TargetIcon, CalendarIcon, UserCheckIcon, ClockIcon } from '../icons/Icons';

interface GoalsViewProps {
  currentGoal: number; // Posture score goal
  onSetGoal: (goal: number) => void;
  sessionGoal: number; // New session/hour goal
  onSetSessionGoal: (goal: number) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ currentGoal, onSetGoal, sessionGoal, onSetSessionGoal }) => {
  const [focusArea, setFocusArea] = useState('Shoulders');

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Goals</h2>
        <p className="text-gray-500 mt-1">Set targets and customize your tracking focus.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Posture Score Goal Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <TargetIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Posture Goal</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Target quality score</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{currentGoal}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">quality</span>
          </div>

          <div className="space-y-3">
             <input 
                type="range" 
                min="30" 
                max="100" 
                step="5"
                value={currentGoal}
                onChange={(e) => onSetGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
             <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                <span>30%</span>
                <span>100%</span>
             </div>
          </div>
        </div>

        {/* Session Goal Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Sessions</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 Session = 1 Hour</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{sessionGoal}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">sessions</span>
          </div>

          <div className="space-y-3">
             <input 
                type="range" 
                min="1" 
                max="12" 
                step="1"
                value={sessionGoal}
                onChange={(e) => onSetSessionGoal(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
             />
             <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                <span>1 Sess</span>
                <span>12 Sess</span>
             </div>
          </div>
        </div>

        {/* Focus Area */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <UserCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Focus Area</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Prioritize specific corrections</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Neck & Head', 'Shoulders', 'Spine Neutral', 'Screen Distance'].map((area) => (
                    <button
                        key={area}
                        onClick={() => setFocusArea(area)}
                        className={`p-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                            focusArea === area 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {area}
                        {focusArea === area && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                    </button>
                ))}
            </div>
        </div>

        {/* Weekly Consistency (Full Width) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-400" /> Weekly Consistency
            </h3>
            <div className="flex justify-between items-end h-24 px-2">
                {[60, 45, 80, 70, 20, 0, 0].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                            <div className="w-full max-w-[24px] bg-gray-100 dark:bg-gray-700 rounded-t-sm h-full relative group">
                                <div 
                                    className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${h >= currentGoal ? 'bg-green-500' : 'bg-blue-500 group-hover:bg-blue-400'}`} 
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                            {['M','T','W','T','F','S','S'][i]}
                            </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsView;
