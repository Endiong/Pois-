
import React from 'react';
import { PostureStatus } from '../../types';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  onToggleCamera: () => void;
  isCameraEnabled: boolean;
}

const getStatusColor = (status: PostureStatus) => {
  switch (status) {
    case PostureStatus.GOOD:
      return 'bg-green-500';
    case PostureStatus.SLOUCHING:
    case PostureStatus.LEANING:
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

const CameraView: React.FC<CameraViewProps> = ({ videoRef, postureStatus, onToggleCamera, isCameraEnabled }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        {!isCameraEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                <p className="mb-4">Camera is off</p>
            </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-4 h-4 rounded-full ${getStatusColor(postureStatus)}`}></span>
          <p className="font-semibold text-lg">{postureStatus}</p>
        </div>
        <button
          onClick={onToggleCamera}
          className={`px-6 py-2 rounded-full font-semibold text-white transition-colors ${
            isCameraEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isCameraEnabled ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
    </div>
  );
};

export default CameraView;
