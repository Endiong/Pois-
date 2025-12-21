
import { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus, PostureHistoryItem } from '../types';
import { sendNotification, playBeep } from '../services/notificationService';

// TypeScript declarations for global variables from script tags in index.html
declare var poseDetection: any;

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
  onSessionEnd: (session: PostureHistoryItem) => void;
}

const BAD_POSTURE_THRESHOLD_MS = 60000; // 1 minute
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const MIN_KEYPOINT_SCORE = 0.3;
const MIN_SESSION_DURATION_SECONDS = 10; // Reduced for testing, can be higher

const usePostureTracker = ({ onPostureChange, enabled, onSessionEnd }: UsePostureTrackerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<any>(null); 
  const requestRef = useRef<number | undefined>(undefined); 
  const streamRef = useRef<MediaStream | null>(null);
  const badPostureTimer = useRef<number | null>(null);
  const lastNotificationTime = useRef<number>(0);
  const inactivityTimerRef = useRef<number | null>(null);

  const [postureStatus, setPostureStatus] = useState<PostureStatus>(PostureStatus.UNKNOWN);
  const [isModelReady, setIsModelReady] = useState(false);
  
  // Timing State using Refs for accuracy, State for rendering
  const sessionStartTimeRef = useRef<number | null>(null);
  const goodPostureDurationRef = useRef<number>(0);
  
  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  
  const postureStatusRef = useRef(postureStatus);

  useEffect(() => {
    postureStatusRef.current = postureStatus;
  }, [postureStatus]);

  const updatePostureStatus = useCallback((newStatus: PostureStatus) => {
    setPostureStatus(newStatus);
    onPostureChange(newStatus);
  }, [onPostureChange]);

  const analyzePose = (pose: any): PostureStatus => {
    if (!pose || !pose.keypoints) {
      return PostureStatus.UNKNOWN;
    }
    const keypoints = pose.keypoints.reduce((acc: any, keypoint: any) => {
        if (keypoint.score > MIN_KEYPOINT_SCORE) {
            acc[keypoint.name] = keypoint;
        }
        return acc;
    }, {});

    const requiredKeypoints = ['left_shoulder', 'right_shoulder', 'left_ear', 'right_ear'];
    for (const kp of requiredKeypoints) {
        if (!keypoints[kp]) {
            return PostureStatus.UNKNOWN; 
        }
    }
    
    const { left_shoulder, right_shoulder, left_ear, right_ear } = keypoints;
    
    // 1. Leaning check
    const shoulderYDiff = Math.abs(left_shoulder.y - right_shoulder.y);
    const shoulderWidth = Math.abs(left_shoulder.x - right_shoulder.x);
    if (shoulderYDiff > shoulderWidth * 0.15) { 
        return PostureStatus.LEANING;
    }

    // 2. Slouching (Forward Head) check
    const earAvgX = (left_ear.x + right_ear.x) / 2;
    const shoulderAvgX = (left_shoulder.x + right_shoulder.x) / 2;
    
    if (shoulderAvgX - earAvgX > shoulderWidth * 0.20) { 
        return PostureStatus.SLOUCHING;
    }

    return PostureStatus.GOOD;
  };

  const runDetection = useCallback(async () => {
    if (
      detectorRef.current &&
      videoRef.current &&
      videoRef.current.readyState >= 3 
    ) {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        // Mark model as ready once we successfully estimate a pose (even empty)
        if (!isModelReady) setIsModelReady(true);

        if (poses && poses.length > 0) {
            const newStatus = analyzePose(poses[0]);
            updatePostureStatus(newStatus);
        } else {
            updatePostureStatus(PostureStatus.UNKNOWN);
        }
      } catch (error) {
        console.error("Error during pose estimation:", error);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, [updatePostureStatus, isModelReady]);

  const loadAndRunModel = useCallback(async () => {
    try {
        updatePostureStatus(PostureStatus.UNKNOWN);
        if (!detectorRef.current) {
            // Using LIGHTNING for faster inference to reduce glitches
            const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
            const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
            detectorRef.current = detector;
        }
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        runDetection();
    } catch(error) {
        console.error("Failed to load the pose detection model.", error);
    }
  }, [runDetection, updatePostureStatus]);

  const stopDetection = useCallback(() => {
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
    }
    // Note: We don't dispose the detector immediately to allow faster restart
    // detectorRef.current.dispose(); 
    setIsModelReady(false);
  }, []);

  const stopCamera = useCallback(() => {
    stopDetection();
    
    // Stop Media Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Calculate Final Session Data
    if (sessionStartTimeRef.current) {
        const finalTotalSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        
        if (finalTotalSeconds > MIN_SESSION_DURATION_SECONDS) {
            onSessionEnd({
                date: new Date().toISOString(),
                duration: finalTotalSeconds,
                goodDuration: Math.floor(goodPostureDurationRef.current / 1000), // Convert ms to seconds
            });
        }
    }

    // Reset Refs and State
    sessionStartTimeRef.current = null;
    goodPostureDurationRef.current = 0;
    setTotalSessionSeconds(0);
    setGoodPostureSeconds(0);
    updatePostureStatus(PostureStatus.UNKNOWN);
  }, [updatePostureStatus, stopDetection, onSessionEnd]);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for metadata to load before running model
          videoRef.current.onloadeddata = () => {
              loadAndRunModel();
              // Initialize Timer
              sessionStartTimeRef.current = Date.now();
              goodPostureDurationRef.current = 0;
          };
        }
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [updatePostureStatus, loadAndRunModel]);
  
  // -- Inactivity Timer --
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
        if(enabled) updatePostureStatus(PostureStatus.IDLE);
    }, INACTIVITY_TIMEOUT_MS);
  }, [updatePostureStatus, enabled]);
  
  useEffect(() => {
    if (enabled) {
      const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();
      return () => {
        activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      };
    }
  }, [enabled, resetInactivityTimer]);

  // -- Session Timer Loop --
  useEffect(() => {
    let interval: number | null = null;

    if (enabled) {
      interval = window.setInterval(() => {
        if (sessionStartTimeRef.current) {
            const now = Date.now();
            // Calculate elapsed time from start (prevents drift/glitch)
            const elapsed = Math.floor((now - sessionStartTimeRef.current) / 1000);
            setTotalSessionSeconds(elapsed);

            // Accumulate Good Posture Time (in ms for precision)
            if (postureStatusRef.current === PostureStatus.GOOD) {
                goodPostureDurationRef.current += 1000; 
                setGoodPostureSeconds(Math.floor(goodPostureDurationRef.current / 1000));
            }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enabled]);

  // -- Notification Logic --
  useEffect(() => {
    if (postureStatus === PostureStatus.SLOUCHING || postureStatus === PostureStatus.LEANING) {
      if (badPostureTimer.current === null) {
        badPostureTimer.current = window.setTimeout(() => {
          const now = Date.now();
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
        if (badPostureTimer.current) clearTimeout(badPostureTimer.current);
    };
  }, [postureStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up stream but don't call full stopCamera to avoid state updates on unmounted component
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  return { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds, isModelReady };
};

export default usePostureTracker;
