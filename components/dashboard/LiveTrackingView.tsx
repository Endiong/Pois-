
import React from 'react';
import CameraView from './CameraView';
import StatsCard from './StatsCard';
import { BoltIcon, ClockIcon, CheckBadgeIcon, SparklesIcon } from '../icons/Icons';
import { PostureStatus } from '../../types';

interface LiveTrackingViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  isTracking: boolean;
  onToggleTracking: () => void;
  goodPostureSeconds: number;
  totalSessionSeconds: number;
  currentTip: string;
  isModelReady: boolean;
}

const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  videoRef,
  postureStatus,
  isTracking,
  onToggleTracking,
  goodPostureSeconds,
  totalSessionSeconds,
  currentTip,
  isModelReady
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScore = totalSessionSeconds > 0 ? Math.round((goodPostureSeconds / totalSessionSeconds) * 100) : 100;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live Tracking</h2>
          <p className="text-gray-500 mt-1">Real-time posture analysis.</p>
        </div>
      </header>

      {/* Live Tips Banner - Moved to Top */}
      <div className="w-full bg-indigo-600 dark:bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <SparklesIcon className="w-32 h-32 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full flex-shrink-0">
                  <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                  <h4 className="font-bold text-indigo-100 text-xs uppercase tracking-wider mb-1">AI Coach</h4>
                  <p className="text-lg font-medium leading-snug">
                    {isTracking 
                        ? (isModelReady ? currentTip : "Analyzing your posture patterns...") 
                        : "Start the camera to receive real-time, personalized posture correction tips."}
                  </p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CameraView
            videoRef={videoRef}
            postureStatus={isModelReady ? postureStatus : PostureStatus.UNKNOWN}
            onToggleCamera={onToggleTracking}
            isCameraEnabled={isTracking}
          />
        </div>
        <div className="space-y-4">
          <StatsCard
            title="Session Score"
            value={`${currentScore}%`}
            unit=""
            trend={currentScore >= 80 ? "Great" : "Improve"}
            icon={<BoltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatsCard
            title="Session Duration"
            value={formatTime(totalSessionSeconds)}
            unit="min"
            trend={isTracking ? "Active" : "Paused"}
            icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatsCard
            title="Good Posture"
            value={formatTime(goodPostureSeconds)}
            unit="min"
            trend={`${totalSessionSeconds > 0 ? Math.round((goodPostureSeconds/totalSessionSeconds)*100) : 0}%`}
            icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />}
            iconBg="bg-green-100 dark:bg-green-900/30"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingView;
