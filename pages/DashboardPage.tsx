import React, { useState, useCallback, useEffect } from 'react';
import CameraView from '../components/dashboard/CameraView';
import StatsCard from '../components/dashboard/StatsCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import GeminiTip from '../components/dashboard/GeminiTip';
import GoalProgress from '../components/dashboard/GoalProgress';
import SetGoalModal from '../components/dashboard/SetGoalModal';
import usePostureTracker from '../hooks/usePostureTracker';
import { PostureStatus } from '../types';

const DashboardPage: React.FC = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(70); // Default 70%
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem('postureGoal');
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal, 10));
    }
  }, []);


  const handlePostureChange = useCallback((status: PostureStatus) => {
    // This callback can be used to update other components if needed
    console.log('Posture changed to:', status);
  }, []);

  const { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds } = usePostureTracker({
    onPostureChange: handlePostureChange,
    enabled: cameraEnabled,
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
  
  const handleSaveGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    localStorage.setItem('postureGoal', newGoal.toString());
    setIsGoalModalOpen(false);
  };

  const progressPercentage = totalSessionSeconds > 0 ? (goodPostureSeconds / totalSessionSeconds) * 100 : 0;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Poisé Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <CameraView
              videoRef={videoRef}
              postureStatus={postureStatus}
              onToggleCamera={handleToggleCamera}
              isCameraEnabled={cameraEnabled}
            />
            <AnalyticsChart />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <GoalProgress
              goal={dailyGoal}
              progress={progressPercentage}
              onSetGoal={() => setIsGoalModalOpen(true)}
            />
            <div className="grid grid-cols-2 gap-4">
                <StatsCard title="Posture Score" value="92" unit="%" trend="+2%" />
                <StatsCard title="Daily Streak" value="14" unit="days" trend="+1 day" />
            </div>
            <GeminiTip />
          </div>
        </div>
      </div>
      {isGoalModalOpen && (
        <SetGoalModal 
          currentGoal={dailyGoal}
          onClose={() => setIsGoalModalOpen(false)}
          onSave={handleSaveGoal}
        />
      )}
    </>
  );
};

export default DashboardPage;