import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertTriangle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Landmark } from '../../types/biomechanics';
import { LANDMARKS } from '../../utils/biomechanics';

interface PoseCanvasProps {
  onLandmarksDetected: (landmarks: Landmark[]) => void;
  onNoPersonDetected: () => void;
  isTracking: boolean;
  setIsTracking: (tracking: boolean) => void;
}

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  onLandmarksDetected,
  onNoPersonDetected,
  isTracking,
  setIsTracking,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [personDetected, setPersonDetected] = useState<boolean>(false);
  const [useSimulatedMode, setUseSimulatedMode] = useState<boolean>(false);

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const simFrameRef = useRef<number>(0);

  // Initialize MediaPipe PoseLandmarker from npm tasks-vision
  const initPoseLandmarker = async (): Promise<PoseLandmarker | null> => {
    if (landmarkerRef.current) return landmarkerRef.current;
    
    setIsLoadingModel(true);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      landmarkerRef.current = landmarker;
      setIsLoadingModel(false);
      return landmarker;
    } catch (err) {
      console.warn('Failed to load GPU PoseLandmarker, falling back to CPU:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
        landmarkerRef.current = landmarker;
        setIsLoadingModel(false);
        return landmarker;
      } catch (cpuErr) {
        console.error('Failed to initialize MediaPipe PoseLandmarker:', cpuErr);
        setIsLoadingModel(false);
        setCameraError('Failed to initialize MediaPipe AI engine. You can enable Demo Mode.');
        return null;
      }
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setUseSimulatedMode(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const landmarker = await initPoseLandmarker();
      if (landmarker || useSimulatedMode) {
        setIsTracking(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access is required for live posture analysis.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was found on this system.');
      } else {
        setCameraError('Could not access camera. Please check permissions or switch to Demo Mode.');
      }
      setIsTracking(false);
    }
  };

  // Stop Camera Stream & Tracking
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsTracking(false);
    setPersonDetected(false);
  };

  // Switch to Simulated Demo Mode
  const enableDemoMode = () => {
    stopCamera();
    setCameraError(null);
    setUseSimulatedMode(true);
    setIsTracking(true);
  };

  // Continuous Detection Loop
  useEffect(() => {
    if (!isTracking) return;

    let lastVideoTime = -1;

    const processFrame = () => {
      if (useSimulatedMode) {
        // Generate simulated dynamic human skeleton landmarks
        simFrameRef.current += 0.04;
        const t = simFrameRef.current;
        
        const simulatedLandmarks: Landmark[] = Array(33).fill(null).map((_, idx) => {
          // Default center coordinates
          let x = 0.5;
          let y = 0.5;
          let z = 0;

          if (idx === LANDMARKS.NOSE) { x = 0.5 + Math.sin(t * 0.5) * 0.01; y = 0.22; }
          else if (idx === LANDMARKS.LEFT_EAR) { x = 0.44; y = 0.21; }
          else if (idx === LANDMARKS.RIGHT_EAR) { x = 0.56; y = 0.21; }
          else if (idx === LANDMARKS.LEFT_SHOULDER) { x = 0.38; y = 0.35 + Math.sin(t) * 0.01; }
          else if (idx === LANDMARKS.RIGHT_SHOULDER) { x = 0.62; y = 0.35 - Math.sin(t) * 0.01; }
          else if (idx === LANDMARKS.LEFT_ELBOW) { x = 0.30; y = 0.50 + Math.sin(t * 1.5) * 0.04; }
          else if (idx === LANDMARKS.RIGHT_ELBOW) { x = 0.70; y = 0.50 - Math.sin(t * 1.5) * 0.04; }
          else if (idx === LANDMARKS.LEFT_WRIST) { x = 0.26; y = 0.62 + Math.sin(t * 1.5) * 0.06; }
          else if (idx === LANDMARKS.RIGHT_WRIST) { x = 0.74; y = 0.62 - Math.sin(t * 1.5) * 0.06; }
          else if (idx === LANDMARKS.LEFT_HIP) { x = 0.42; y = 0.60; }
          else if (idx === LANDMARKS.RIGHT_HIP) { x = 0.58; y = 0.60; }
          else if (idx === LANDMARKS.LEFT_KNEE) { x = 0.41; y = 0.78 + Math.abs(Math.sin(t * 0.8)) * 0.05; }
          else if (idx === LANDMARKS.RIGHT_KNEE) { x = 0.59; y = 0.78 + Math.abs(Math.sin(t * 0.8)) * 0.05; }
          else if (idx === LANDMARKS.LEFT_ANKLE) { x = 0.41; y = 0.92; }
          else if (idx === LANDMARKS.RIGHT_ANKLE) { x = 0.59; y = 0.92; }

          return { x, y, z, visibility: 0.99 };
        });

        setPersonDetected(true);
        onLandmarksDetected(simulatedLandmarks);
        drawCanvasOverlay(null, simulatedLandmarks);

        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Real Camera Processing
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && video.readyState >= 2 && landmarker) {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;

          const results = landmarker.detectForVideo(video, performance.now());

          if (results.landmarks && results.landmarks.length > 0) {
            const detected = results.landmarks[0] as Landmark[];
            setPersonDetected(true);
            onLandmarksDetected(detected);
            drawCanvasOverlay(video, detected);
          } else {
            setPersonDetected(false);
            onNoPersonDetected();
            drawCanvasOverlay(video, null);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isTracking, useSimulatedMode]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Canvas Skeleton & Landmark Overlay Renderer
  const drawCanvasOverlay = (video: HTMLVideoElement | null, landmarks: Landmark[] | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas width/height to container/video
    const width = video ? video.videoWidth || 640 : 640;
    const height = video ? video.videoHeight || 480 : 480;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    // In simulated mode without real camera, draw futuristic backdrop
    if (useSimulatedMode) {
      ctx.fillStyle = '#0F1E1B';
      ctx.fillRect(0, 0, width, height);
      // Grid lines
      ctx.strokeStyle = 'rgba(114, 214, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
    }

    if (!landmarks) return;

    // Helper conversion from normalized [0,1] to canvas pixel coordinates
    const toPx = (lm: Landmark) => ({
      x: lm.x * width,
      y: lm.y * height,
    });

    // Skeleton Connections Definition
    const connections = [
      // Torso
      [LANDMARKS.LEFT_SHOULDER, LANDMARKS.RIGHT_SHOULDER],
      [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP],
      [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_HIP],
      [LANDMARKS.LEFT_HIP, LANDMARKS.RIGHT_HIP],
      // Left Arm
      [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
      [LANDMARKS.LEFT_ELBOW, LANDMARKS.LEFT_WRIST],
      // Right Arm
      [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_ELBOW],
      [LANDMARKS.RIGHT_ELBOW, LANDMARKS.RIGHT_WRIST],
      // Left Leg
      [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
      [LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
      // Right Leg
      [LANDMARKS.RIGHT_HIP, LANDMARKS.RIGHT_KNEE],
      [LANDMARKS.RIGHT_KNEE, LANDMARKS.RIGHT_ANKLE],
      // Head
      [LANDMARKS.NOSE, LANDMARKS.LEFT_EAR],
      [LANDMARKS.NOSE, LANDMARKS.RIGHT_EAR],
    ];

    // Draw Skeleton Lines
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#72D6D4'; // Cyan glowing line
    ctx.shadowColor = '#72D6D4';
    ctx.shadowBlur = 8;

    connections.forEach(([i1, i2]) => {
      const lm1 = landmarks[i1];
      const lm2 = landmarks[i2];
      if (lm1 && lm2) {
        const p1 = toPx(lm1);
        const p2 = toPx(lm2);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0; // Reset glow

    // Draw Key Joint Nodes
    const keyJoints = [
      { idx: LANDMARKS.NOSE, color: '#72D6D4', radius: 6 },
      { idx: LANDMARKS.LEFT_SHOULDER, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.RIGHT_SHOULDER, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.LEFT_ELBOW, color: '#7A3038', radius: 6 },
      { idx: LANDMARKS.RIGHT_ELBOW, color: '#7A3038', radius: 6 },
      { idx: LANDMARKS.LEFT_WRIST, color: '#72D6D4', radius: 5 },
      { idx: LANDMARKS.RIGHT_WRIST, color: '#72D6D4', radius: 5 },
      { idx: LANDMARKS.LEFT_HIP, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.RIGHT_HIP, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.LEFT_KNEE, color: '#10B981', radius: 7 },
      { idx: LANDMARKS.RIGHT_KNEE, color: '#10B981', radius: 7 },
      { idx: LANDMARKS.LEFT_ANKLE, color: '#72D6D4', radius: 5 },
      { idx: LANDMARKS.RIGHT_ANKLE, color: '#72D6D4', radius: 5 },
    ];

    keyJoints.forEach(({ idx, color, radius }) => {
      const lm = landmarks[idx];
      if (lm) {
        const p = toPx(lm);
        // Outer white ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Inner Colored Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });
  };

  return (
    <div className="relative w-full bg-black rounded-3xl overflow-hidden border border-brand-cyan/30 shadow-2xl min-h-[380px] md:min-h-[480px] flex flex-col items-center justify-center">
      
      {/* Hidden Video element for webcam stream */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        playsInline
        muted
      />

      {/* HTML5 Canvas overlay for 33 skeleton landmarks */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
          useSimulatedMode ? '' : 'transform -scale-x-100'
        }`}
      />

      {/* TOP CANVAS STATUS BADGES */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
        
        {/* Tracking Status */}
        <div className="flex items-center space-x-2 bg-brand-deepGreenDark/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-cyan/40 text-xs font-mono text-white shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${personDetected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
          <span>
            {isTracking
              ? personDetected
                ? '● AI TRACKING ACTIVE'
                : '⚠ NO PERSON DETECTED'
              : 'CAMERA IDLE'}
          </span>
        </div>

        {/* Mode Indicator */}
        {useSimulatedMode && (
          <div className="bg-brand-maroon/90 text-white font-mono text-xs px-3 py-1.5 rounded-full border border-white/20">
            DEMO SIMULATION MODE
          </div>
        )}
      </div>

      {/* NO PERSON DETECTED BANNER OVERLAY */}
      {isTracking && !personDetected && !useSimulatedMode && (
        <div className="absolute bottom-16 bg-amber-500/90 text-white font-semibold text-sm px-6 py-2.5 rounded-full backdrop-blur-md border border-amber-300/40 shadow-xl flex items-center space-x-2 animate-bounce z-20">
          <AlertTriangle className="w-5 h-5 text-amber-100" />
          <span>Please stand fully within the camera frame</span>
        </div>
      )}

      {/* IDLE / START CAMERA PROMPT STATE */}
      {!isTracking && !cameraError && !isLoadingModel && (
        <div className="relative z-20 text-center p-8 max-w-md space-y-5 bg-brand-deepGreenDark/90 backdrop-blur-xl rounded-3xl border border-brand-cyan/40 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-brand-cyan mx-auto">
            <Camera className="w-8 h-8 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Live AI Biomechanical Scan</h3>
            <p className="text-xs text-gray-300 mt-1">
              Enable your webcam to start real-time posture analysis & landmark tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startCamera}
              className="bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-extrabold px-6 py-3 rounded-xl shadow-glow-cyan text-sm flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>

            <button
              onClick={enableDemoMode}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 text-sm flex items-center justify-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>Demo Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* LOADING MODEL STATE */}
      {isLoadingModel && (
        <div className="relative z-20 text-center p-6 bg-brand-deepGreenDark/90 backdrop-blur-xl rounded-2xl border border-brand-cyan/40 text-white space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto" />
          <p className="text-sm font-bold">Initializing MediaPipe AI Neural Network...</p>
          <p className="text-xs text-gray-300">Downloading pose landmarker model directly to browser</p>
        </div>
      )}

      {/* CAMERA ERROR STATE */}
      {cameraError && (
        <div className="relative z-20 text-center p-6 max-w-sm bg-brand-maroon/90 backdrop-blur-xl rounded-2xl border border-white/20 text-white space-y-4">
          <CameraOff className="w-10 h-10 text-rose-200 mx-auto" />
          <h4 className="font-bold text-base">{cameraError}</h4>
          <div className="flex gap-2 justify-center">
            <button
              onClick={startCamera}
              className="bg-white text-brand-maroon font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={enableDemoMode}
              className="bg-brand-cyan text-brand-deepGreen font-bold px-4 py-2 rounded-lg text-xs hover:bg-brand-cyanDark transition-colors"
            >
              Use Demo Mode
            </button>
          </div>
        </div>
      )}

      {/* TRACKING STOP BUTTON AT BOTTOM */}
      {isTracking && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={stopCamera}
            className="bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl backdrop-blur-md border border-red-400/40 shadow-lg transition-all"
          >
            Stop Analysis
          </button>
        </div>
      )}

    </div>
  );
};
