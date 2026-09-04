import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Landmark } from '../types/biomechanics';
import { LANDMARKS } from '../utils/math/kinematics';

interface UsePoseLandmarkerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  onLandmarksDetected: (landmarks: Landmark[]) => void;
  onNoPersonDetected?: () => void;
}

interface UsePoseLandmarkerReturn {
  isLoadingModel: boolean;
  modelError: string | null;
  personDetected: boolean;
  useSimulatedMode: boolean;
  enableSimulatedMode: () => void;
  disableSimulatedMode: () => void;
}

export function usePoseLandmarker({
  videoRef,
  isStreaming,
  onLandmarksDetected,
  onNoPersonDetected,
}: UsePoseLandmarkerProps): UsePoseLandmarkerReturn {
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [personDetected, setPersonDetected] = useState<boolean>(false);
  const [useSimulatedMode, setUseSimulatedMode] = useState<boolean>(false);

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const simFrameRef = useRef<number>(0);

  // Initialize MediaPipe PoseLandmarker (GPU with CPU fallback)
  const initPoseLandmarker = useCallback(async (): Promise<PoseLandmarker | null> => {
    if (landmarkerRef.current) return landmarkerRef.current;

    setIsLoadingModel(true);
    setModelError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      landmarkerRef.current = landmarker;
      setIsLoadingModel(false);
      return landmarker;
    } catch (err) {
      console.warn('GPU PoseLandmarker initialization failed, attempting CPU fallback:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
        landmarkerRef.current = landmarker;
        setIsLoadingModel(false);
        return landmarker;
      } catch (cpuErr) {
        console.error('Failed to initialize MediaPipe PoseLandmarker on CPU:', cpuErr);
        setIsLoadingModel(false);
        setModelError('Failed to initialize MediaPipe AI engine. You can switch to Simulated Demo Mode.');
        return null;
      }
    }
  }, []);

  const enableSimulatedMode = useCallback(() => {
    setUseSimulatedMode(true);
  }, []);

  const disableSimulatedMode = useCallback(() => {
    setUseSimulatedMode(false);
  }, []);

  // Inference / Simulation Loop
  useEffect(() => {
    let lastVideoTime = -1;

    const processFrame = () => {
      if (useSimulatedMode) {
        // Synthetic pose generator for testing without webcam
        simFrameRef.current += 0.04;
        const t = simFrameRef.current;

        const simulatedLandmarks: Landmark[] = Array(33)
          .fill(null)
          .map((_, idx) => {
            let x = 0.5;
            let y = 0.5;
            let z = 0;

            if (idx === LANDMARKS.NOSE) {
              x = 0.5 + Math.sin(t * 0.5) * 0.01;
              y = 0.22;
            } else if (idx === LANDMARKS.LEFT_EAR) {
              x = 0.44;
              y = 0.21;
            } else if (idx === LANDMARKS.RIGHT_EAR) {
              x = 0.56;
              y = 0.21;
            } else if (idx === LANDMARKS.LEFT_SHOULDER) {
              x = 0.38;
              y = 0.35 + Math.sin(t) * 0.01;
            } else if (idx === LANDMARKS.RIGHT_SHOULDER) {
              x = 0.62;
              y = 0.35 - Math.sin(t) * 0.01;
            } else if (idx === LANDMARKS.LEFT_ELBOW) {
              x = 0.30;
              y = 0.50 + Math.sin(t * 1.5) * 0.04;
            } else if (idx === LANDMARKS.RIGHT_ELBOW) {
              x = 0.70;
              y = 0.50 - Math.sin(t * 1.5) * 0.04;
            } else if (idx === LANDMARKS.LEFT_WRIST) {
              x = 0.26;
              y = 0.62 + Math.sin(t * 1.5) * 0.06;
            } else if (idx === LANDMARKS.RIGHT_WRIST) {
              x = 0.74;
              y = 0.62 - Math.sin(t * 1.5) * 0.06;
            } else if (idx === LANDMARKS.LEFT_HIP) {
              x = 0.42;
              y = 0.60;
            } else if (idx === LANDMARKS.RIGHT_HIP) {
              x = 0.58;
              y = 0.60;
            } else if (idx === LANDMARKS.LEFT_KNEE) {
              x = 0.41;
              y = 0.78 + Math.abs(Math.sin(t * 0.8)) * 0.05;
            } else if (idx === LANDMARKS.RIGHT_KNEE) {
              x = 0.59;
              y = 0.78 + Math.abs(Math.sin(t * 0.8)) * 0.05;
            } else if (idx === LANDMARKS.LEFT_ANKLE) {
              x = 0.41;
              y = 0.92;
            } else if (idx === LANDMARKS.RIGHT_ANKLE) {
              x = 0.59;
              y = 0.92;
            }

            return { x, y, z, visibility: 0.99 };
          });

        setPersonDetected(true);
        onLandmarksDetected(simulatedLandmarks);
        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Real video inference
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && video.readyState >= 2 && landmarker && isStreaming) {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const startTimeMs = performance.now();

          try {
            const results = landmarker.detectForVideo(video, startTimeMs);

            if (results && results.landmarks && results.landmarks.length > 0) {
              const detected = results.landmarks[0] as Landmark[];
              setPersonDetected(true);
              onLandmarksDetected(detected);
            } else {
              setPersonDetected(false);
              if (onNoPersonDetected) onNoPersonDetected();
            }
          } catch (inferErr) {
            console.warn('Inference frame detection error:', inferErr);
          }
        }
      }

      if (isStreaming || useSimulatedMode) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };

    if (isStreaming || useSimulatedMode) {
      if (!landmarkerRef.current && !useSimulatedMode) {
        initPoseLandmarker().then((landmarker) => {
          if (landmarker) {
            animFrameIdRef.current = requestAnimationFrame(processFrame);
          }
        });
      } else {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    } else {
      setPersonDetected(false);
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isStreaming, useSimulatedMode, initPoseLandmarker, onLandmarksDetected, onNoPersonDetected, videoRef]);

  // Cleanup model on unmount
  useEffect(() => {
    return () => {
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          // ignore cleanup errors
        }
        landmarkerRef.current = null;
      }
    };
  }, []);

  return {
    isLoadingModel,
    modelError,
    personDetected,
    useSimulatedMode,
    enableSimulatedMode,
    disableSimulatedMode,
  };
}
