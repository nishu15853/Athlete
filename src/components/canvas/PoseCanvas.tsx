import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, AlertTriangle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { Landmark, JointAngles } from '../../types/biomechanics';
import { LANDMARKS } from '../../utils/math/kinematics';
import { useCamera } from '../../hooks/useCamera';
import { usePoseLandmarker } from '../../hooks/usePoseLandmarker';
import { AngleOverlay } from './AngleOverlay';

interface PoseCanvasProps {
  onLandmarksDetected: (landmarks: Landmark[]) => void;
  onNoPersonDetected?: () => void;
  isTracking: boolean;
  setIsTracking: (tracking: boolean) => void;
  angles?: JointAngles;
}

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  onLandmarksDetected,
  onNoPersonDetected,
  isTracking,
  setIsTracking,
  angles,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 640,
    height: 480,
  });

  const [currentLandmarks, setCurrentLandmarks] = useState<Landmark[]>([]);

  // Camera management hook
  const { videoRef, isStreaming, cameraError, startCamera, stopCamera, toggleCamera } = useCamera({
    width: 640,
    height: 480,
    facingMode: 'user',
  });

  // Internal landmark handler that updates local canvas and passes up
  const handleDetected = useCallback(
    (landmarks: Landmark[]) => {
      setCurrentLandmarks(landmarks);
      onLandmarksDetected(landmarks);
    },
    [onLandmarksDetected]
  );

  // Pose landmarker hook (inference loop + demo fallback)
  const {
    isLoadingModel,
    modelError,
    personDetected,
    useSimulatedMode,
    enableSimulatedMode,
    disableSimulatedMode,
  } = usePoseLandmarker({
    videoRef,
    isStreaming,
    onLandmarksDetected: handleDetected,
    onNoPersonDetected,
  });

  // Sync isTracking state
  const handleToggleTracking = async () => {
    if (isTracking) {
      stopCamera();
      disableSimulatedMode();
      setIsTracking(false);
      setCurrentLandmarks([]);
    } else {
      const ok = await startCamera();
      if (ok) {
        disableSimulatedMode();
        setIsTracking(true);
      }
    }
  };

  const handleEnableDemoMode = () => {
    stopCamera();
    enableSimulatedMode();
    setIsTracking(true);
  };

  // Resize canvas according to container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw skeleton overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    // Grid backdrop in simulated mode
    if (useSimulatedMode) {
      ctx.fillStyle = '#0F1E1B';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(114, 214, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    if (!currentLandmarks || currentLandmarks.length < 29) return;

    const toPx = (lm: Landmark) => ({
      x: lm.x * width,
      y: lm.y * height,
    });

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

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#72D6D4';
    ctx.shadowColor = '#72D6D4';
    ctx.shadowBlur = 8;

    connections.forEach(([i1, i2]) => {
      const lm1 = currentLandmarks[i1];
      const lm2 = currentLandmarks[i2];
      if (lm1 && lm2) {
        const p1 = toPx(lm1);
        const p2 = toPx(lm2);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;

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
      const lm = currentLandmarks[idx];
      if (lm) {
        const p = toPx(lm);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });
  }, [currentLandmarks, dimensions, useSimulatedMode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[320px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-brand-cyan/20 flex items-center justify-center"
    >
      {/* Underlying Webcam Video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
          useSimulatedMode ? 'hidden' : 'block'
        }`}
      />

      {/* Foreground Canvas for Skeleton & Biomechanical Mesh */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
          useSimulatedMode ? '' : 'transform -scale-x-100'
        }`}
      />

      {/* Real-time Angle Vertex Overlay */}
      {angles && currentLandmarks.length >= 29 && (
        <AngleOverlay
          landmarks={currentLandmarks}
          angles={angles}
          canvasWidth={dimensions.width}
          canvasHeight={dimensions.height}
          isMirrored={!useSimulatedMode}
        />
      )}

      {/* Scanline Animation Effect */}
      {isTracking && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent h-24 animate-scanline" />
      )}

      {/* Top Telemetry Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white">
          <span
            className={`w-2 h-2 rounded-full ${
              isTracking ? (personDetected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400') : 'bg-gray-500'
            }`}
          />
          <span>
            {!isTracking
              ? 'CAMERA STANDBY'
              : useSimulatedMode
              ? 'SIMULATED DEMO POSE'
              : personDetected
              ? 'SUBJECT DETECTED'
              : 'ACQUIRING SUBJECT...'}
          </span>
        </div>

        {personDetected && (
          <div className="flex items-center space-x-1 text-xs font-bold text-brand-cyan bg-brand-cyan/20 px-3 py-1 rounded-full border border-brand-cyan/40 backdrop-blur-md">
            <UserCheck className="w-3.5 h-3.5" />
            <span>33 LANDMARKS LOCKED</span>
          </div>
        )}
      </div>

      {/* Loading Model Overlay */}
      {isLoadingModel && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
          <p className="font-bold text-sm tracking-wide">Initializing MediaPipe WASM AI Model...</p>
        </div>
      )}

      {/* Standby / Initial State */}
      {!isTracking && !isLoadingModel && (
        <div className="relative z-10 text-center text-white p-6 max-w-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center mx-auto text-brand-cyan shadow-glow-cyan">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">AI Vision Analysis Offline</h3>
            <p className="text-xs text-gray-400 mt-1">
              Start camera to track 33 3D skeletal landmarks or test in Simulated Mode.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={handleToggleTracking}
              className="px-5 py-2.5 bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-extrabold rounded-xl text-xs transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
            <button
              onClick={handleEnableDemoMode}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>Simulate Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {isTracking && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={handleToggleTracking}
            className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-rose-400/40 shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <CameraOff className="w-4 h-4" />
            <span>Stop Camera</span>
          </button>

          {!useSimulatedMode && (
            <button
              onClick={handleEnableDemoMode}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Switch to Demo</span>
            </button>
          )}
        </div>
      )}

      {/* Camera / Model Error Fallback Banner */}
      {(cameraError || modelError) && !useSimulatedMode && (
        <div className="absolute bottom-16 left-4 right-4 bg-rose-900/90 border border-rose-500 text-white text-xs p-3 rounded-2xl backdrop-blur-md flex items-center justify-between z-20 animate-fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{cameraError || modelError}</span>
          </div>
          <button
            onClick={handleEnableDemoMode}
            className="ml-2 px-3 py-1 bg-brand-cyan text-brand-deepGreen font-extrabold rounded-lg text-[11px] shrink-0"
          >
            Enable Demo Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default PoseCanvas;
