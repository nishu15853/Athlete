import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, AlertTriangle, RefreshCw, Sparkles, UserCheck, Upload, Flame } from 'lucide-react';
import { Landmark, JointAngles, JointStress } from '../../types/biomechanics';
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
  stress?: JointStress;
}

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  onLandmarksDetected,
  onNoPersonDetected,
  isTracking,
  setIsTracking,
  angles,
  stress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 640,
    height: 480,
  });

  const [currentLandmarks, setCurrentLandmarks] = useState<Landmark[]>([]);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  // Camera management hook (supports live webcam and pre-recorded video clips)
  const {
    videoRef,
    isStreaming,
    cameraError,
    isUploadedVideo,
    startCamera,
    stopCamera,
    loadVideoFile,
  } = useCamera({
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

  // Toggle Camera
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

  // Enable Demo / Simulated Mode
  const handleEnableDemoMode = () => {
    stopCamera();
    enableSimulatedMode();
    setIsTracking(true);
  };

  // Video File Upload Handler (Mode 2: Rehab Video File Handling)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    disableSimulatedMode();
    const ok = await loadVideoFile(file);
    if (ok) {
      setIsTracking(true);
    }
    // reset input so user can re-upload same file if desired
    e.target.value = '';
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

  // Determine if feed should be mirrored
  // Only mirror when using user-facing webcam (NOT simulated grid or uploaded video clips)
  const shouldMirror = !useSimulatedMode && !isUploadedVideo;

  // Draw skeleton & biomechanical stress overlay
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

    // Helper for stress color
    const getJointColor = (jointStress?: 'normal' | 'moderate' | 'high', defaultColor: string = '#72D6D4') => {
      if (!showHeatmap || !jointStress) return defaultColor;
      if (jointStress === 'high') return '#EF4444'; // Red (High Strain)
      if (jointStress === 'moderate') return '#F59E0B'; // Amber (Moderate Strain)
      return '#10B981'; // Green (Safe / Optimal)
    };

    const keyJoints = [
      { idx: LANDMARKS.NOSE, color: getJointColor(stress?.spine, '#72D6D4'), radius: 6 },
      { idx: LANDMARKS.LEFT_SHOULDER, color: getJointColor(stress?.spine, '#294D45'), radius: 7 },
      { idx: LANDMARKS.RIGHT_SHOULDER, color: getJointColor(stress?.spine, '#294D45'), radius: 7 },
      { idx: LANDMARKS.LEFT_ELBOW, color: getJointColor(stress?.leftElbow, '#7A3038'), radius: 6 },
      { idx: LANDMARKS.RIGHT_ELBOW, color: getJointColor(stress?.rightElbow, '#7A3038'), radius: 6 },
      { idx: LANDMARKS.LEFT_WRIST, color: '#72D6D4', radius: 5 },
      { idx: LANDMARKS.RIGHT_WRIST, color: '#72D6D4', radius: 5 },
      { idx: LANDMARKS.LEFT_HIP, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.RIGHT_HIP, color: '#294D45', radius: 7 },
      { idx: LANDMARKS.LEFT_KNEE, color: getJointColor(stress?.leftKnee, '#10B981'), radius: 8 },
      { idx: LANDMARKS.RIGHT_KNEE, color: getJointColor(stress?.rightKnee, '#10B981'), radius: 8 },
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
  }, [currentLandmarks, dimensions, useSimulatedMode, showHeatmap, stress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[320px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-brand-cyan/20 flex items-center justify-center"
    >
      {/* Hidden File Input for Video Processing */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoUpload}
      />

      {/* Underlying Video Feed (Webcam or Uploaded File) */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          shouldMirror ? 'transform -scale-x-100' : ''
        } ${useSimulatedMode ? 'hidden' : 'block'}`}
      />

      {/* Foreground Canvas for Skeleton & Biomechanical Mesh */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
          shouldMirror ? 'transform -scale-x-100' : ''
        }`}
      />

      {/* Real-time Angle Vertex & Stress Heatmap Overlay */}
      {angles && currentLandmarks.length >= 29 && (
        <AngleOverlay
          landmarks={currentLandmarks}
          angles={angles}
          canvasWidth={dimensions.width}
          canvasHeight={dimensions.height}
          isMirrored={shouldMirror}
          stress={stress}
          showHeatmap={showHeatmap}
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
              : isUploadedVideo
              ? 'REHAB VIDEO ANALYSIS'
              : personDetected
              ? 'SUBJECT DETECTED'
              : 'ACQUIRING SUBJECT...'}
          </span>
        </div>

        {/* Heat Map Toggle & Status */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all flex items-center space-x-1 ${
              showHeatmap
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                : 'bg-black/50 text-gray-300 border-white/10'
            }`}
            title="Toggle Joint Stress Heat Map (Slide 7 Feature)"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Heat Map: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {personDetected && (
            <div className="flex items-center space-x-1 text-xs font-bold text-brand-cyan bg-brand-cyan/20 px-3 py-1 rounded-full border border-brand-cyan/40 backdrop-blur-md">
              <UserCheck className="w-3.5 h-3.5" />
              <span>33 LANDMARKS LOCKED</span>
            </div>
          )}
        </div>
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
              Start camera, upload a rehab therapy video clip, or test in Simulated Mode.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleToggleTracking}
              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-extrabold rounded-xl text-xs transition-all shadow-glow-cyan flex items-center justify-center space-x-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold rounded-xl text-xs border border-brand-cyan/30 transition-all flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-4 h-4 text-brand-cyan" />
              <span>Upload Video</span>
            </button>
            <button
              onClick={handleEnableDemoMode}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>Simulate</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {isTracking && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleTracking}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-rose-400/40 shadow-lg flex items-center space-x-1.5 transition-all"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Feed</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-black/60 hover:bg-black/80 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{isUploadedVideo ? 'Switch Video' : 'Upload Video'}</span>
            </button>
          </div>

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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-white/20 text-white font-bold rounded-lg text-[11px]"
            >
              Upload Video
            </button>
            <button
              onClick={handleEnableDemoMode}
              className="px-3 py-1 bg-brand-cyan text-brand-deepGreen font-extrabold rounded-lg text-[11px] shrink-0"
            >
              Demo Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseCanvas;
