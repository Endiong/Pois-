import { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus } from '../types';
import { sendNotification, playBeep } from '../services/notificationService';

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
}

const BAD_POSTURE_THRESHOLD_MS = 60000; // 1 minute
const DETECTION_INTERVAL_MS = 5000; // 5 seconds

const usePostureTracker = ({ onPostureChange, enabled }: UsePostureTrackerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [postureStatus, setPostureStatus] = useState<PostureStatus>(PostureStatus.UNKNOWN);
  const streamRef = useRef<MediaStream | null>(null);
  const badPostureTimer = useRef<number | null>(null);
  const lastNotificationTime = useRef<number>(0);

  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const postureStatusRef = useRef(postureStatus);

  useEffect(() => {
    postureStatusRef.current = postureStatus;
  }, [postureStatus]);


  const updatePostureStatus = useCallback((newStatus: PostureStatus) => {
    setPostureStatus(newStatus);
    onPostureChange(newStatus);
  }, [onPostureChange]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [updatePostureStatus]);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [updatePostureStatus]);


  useEffect(() => {
    if (enabled) {
        // This effect handles the detection logic interval
        const detectionInterval = setInterval(() => {
          // Mock posture detection logic
          const random = Math.random();
          let newStatus: PostureStatus;
          if (random < 0.7) {
            newStatus = PostureStatus.GOOD;
          } else if (random < 0.9) {
            newStatus = PostureStatus.SLOUCHING;
          } else {
            newStatus = PostureStatus.LEANING;
          }
          updatePostureStatus(newStatus);
        }, DETECTION_INTERVAL_MS);

        return () => clearInterval(detectionInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, updatePostureStatus]);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = window.setInterval(() => {
        setTotalSessionSeconds(prev => prev + 1);
        if (postureStatusRef.current === PostureStatus.GOOD) {
          setGoodPostureSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);


  useEffect(() => {
    // This effect handles the bad posture notification logic
    if (postureStatus === PostureStatus.SLOUCHING || postureStatus === PostureStatus.LEANING) {
      if (badPostureTimer.current === null) {
        badPostureTimer.current = window.setTimeout(() => {
          const now = Date.now();
          // Throttle notifications to once every 2 minutes
          if (now - lastNotificationTime.current > 120000) { 
            sendNotification('Posture Alert!', 'Please check your posture.');
            playBeep();
            lastNotificationTime.current = now;
          }
        }, BAD_POSTURE_THRESHOLD_MS);
      }
    } else {
      if (badPostureTimer.current) {
        clearTimeout(badPostureTimer.current);
        badPostureTimer.current = null;
      }
    }

    return () => {
        if (badPostureTimer.current) {
            clearTimeout(badPostureTimer.current);
        }
    };
  }, [postureStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds };
};

export default usePostureTracker;