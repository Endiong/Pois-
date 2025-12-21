
import React from 'react';
import { PostureStatus } from '../../types';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  onToggleCamera: () => void;
  isCameraEnabled: boolean;
}

const getStatusColor = (status: PostureStatus, isEnabled: boolean) => {
  if (!isEnabled) return 'bg-gray-400';
  switch (status) {
    case PostureStatus.GOOD:
      return 'bg-green-500';
    case PostureStatus.SLOUCHING:
    case PostureStatus.LEANING:
      return 'bg-red-500';
    case PostureStatus.IDLE:
      return 'bg-gray-400';
    default:
      return 'bg-yellow-500'; // Analyzing/Unknown
  }
};

const CameraView: React.FC<CameraViewProps> = ({ videoRef, postureStatus, onToggleCamera, isCameraEnabled }) => {
  
  const displayStatus = isCameraEnabled ? postureStatus : "Ready to Start";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="relative aspect-video bg-gray-900 dark:bg-black rounded-lg overflow-hidden mb-4 flex-1">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        {!isCameraEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-400 font-medium">Camera is off</p>
            </div>
        )}
        {isCameraEnabled && postureStatus === PostureStatus.IDLE && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white p-4 text-center animate-in fade-in">
                <p className="text-lg font-semibold">You seem to be idle</p>
                <p className="mt-2 text-sm text-gray-300">Move slightly to resume tracking.</p>
            </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full shadow-sm ${getStatusColor(postureStatus, isCameraEnabled)} ${isCameraEnabled && postureStatus !== PostureStatus.IDLE ? 'animate-pulse' : ''}`}></span>
          <p className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">{displayStatus}</p>
        </div>
        <button
          onClick={onToggleCamera}
          className={`px-6 py-2.5 rounded-full font-bold text-white text-sm transition-all shadow-md hover:shadow-lg active:scale-95 ${
            isCameraEnabled ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
          }`}
        >
          {isCameraEnabled ? 'Stop Session' : 'Start Session'}
        </button>
      </div>
    </div>
  );
};

export default CameraView;
