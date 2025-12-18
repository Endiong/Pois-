import React from 'react';
import CameraView from './CameraView';
import StatsCard from './StatsCard';
import { BoltIcon, ClockIcon, CheckBadgeIcon } from '../icons/Icons';
import { PostureStatus } from '../../types';

interface LiveTrackingViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  isTracking: boolean;
  onToggleTracking: () => void;
  goodPostureSeconds: number;
  totalSessionSeconds: number;
}

const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  videoRef,
  postureStatus,
  isTracking,
  onToggleTracking,
  goodPostureSeconds,
  totalSessionSeconds,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScore = totalSessionSeconds > 0 ? Math.round((goodPostureSeconds / totalSessionSeconds) * 100) : 100;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live Tracking</h2>
          <p className="text-gray-500 mt-1">Real-time posture analysis.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CameraView
            videoRef={videoRef}
            postureStatus={postureStatus}
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
            trend="Active"
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
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
             <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Live Tips</h4>
             <p className="text-sm text-indigo-800 dark:text-indigo-200">
                {postureStatus === 'Slouching Detected' ? "Sit back in your chair and bring your shoulders back." :
                 postureStatus === 'Leaning Detected' ? "Keep your shoulders level and head centered." :
                 "Maintain a neutral spine position for best results."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingView;