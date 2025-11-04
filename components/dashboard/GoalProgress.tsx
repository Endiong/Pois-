import React from 'react';
import { SettingsIcon } from '../icons/Icons';

interface GoalProgressProps {
  goal: number;
  progress: number;
  onSetGoal: () => void;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, progress, onSetGoal }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const displayProgress = Math.min(100, Math.round(progress));
  const isGoalMet = progress >= goal;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={isGoalMet ? "text-green-500" : "text-blue-500"}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{displayProgress}%</span>
            <span className="text-sm text-gray-500">of goal</span>
        </div>
      </div>
      <p className="font-semibold text-lg">Daily Posture Goal</p>
      <p className="text-sm text-gray-500 mb-4">Goal: {goal}%</p>
      <button 
        onClick={onSetGoal}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <SettingsIcon />
        <span>Set Goal</span>
      </button>
    </div>
  );
};

export default GoalProgress;