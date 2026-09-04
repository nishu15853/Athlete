import React, { useState, useEffect } from 'react';
import { PoseCanvas } from './PoseCanvas';
import { BiomechanicalMetrics } from './BiomechanicalMetrics';
import { JointAngleCards } from './JointAngleCards';
import { VoiceCoachPanel } from './VoiceCoachPanel';
import { RecoveryScoreCard } from './RecoveryScoreCard';
import { Landmark, JointAngles, PostureStatus, MobilityIndex, ExerciseSession } from '../../types/biomechanics';
import { computeJointAngles } from '../../utils/biomechanics';
import { evaluatePosture } from '../../utils/postureRules';
import { saveSession } from '../../utils/storage';
import { Play, Square, Save, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardPageProps {
  onSessionSaved?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSessionSaved }) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [angles, setAngles] = useState<JointAngles>({
    leftElbow: 180,
    rightElbow: 180,
    leftKnee: 180,
    rightKnee: 180,
    leftHip: 180,
    rightHip: 180,
    shoulderAlignment: 'Balanced',
    hipAlignment: 'Balanced',
    headAlignment: 'Aligned',
  });

  const [postureStatus, setPostureStatus] = useState<PostureStatus>({
    overallScore: 92,
    status: 'GOOD',
    headAlignment: { status: 'Good', detail: 'Good head alignment' },
    shoulderBalance: { status: 'Good', detail: 'Balanced shoulders' },
    hipAlignment: { status: 'Good', detail: 'Hips level' },
    kneePosition: { status: 'Good', detail: 'Knees aligned' },
    feedbackMessages: ['✓ Great posture! Maintain current alignment.'],
  });

  const [mobility, setMobility] = useState<MobilityIndex>({
    overallIndex: 87,
    stability: 90,
    symmetry: 85,
    movementRange: 82,
    alignment: 91,
  });

  // Session Recording Timer State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [sessionScoreHistory, setSessionScoreHistory] = useState<number[]>([]);

  // Real-time pose handler
  const handleLandmarksDetected = (detectedLandmarks: Landmark[]) => {
    setLandmarks(detectedLandmarks);
    const computedAngles = computeJointAngles(detectedLandmarks);
    setAngles(computedAngles);

    const { status, mobility: computedMobility } = evaluatePosture(detectedLandmarks, computedAngles);
    setPostureStatus(status);
    setMobility(computedMobility);

    if (isRecording) {
      setSessionScoreHistory((prev) => [...prev, status.overallScore]);
    }
  };

  const handleNoPersonDetected = () => {
    setLandmarks([]);
  };

  // Timer loop for recording session
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startSessionRecording = () => {
    setIsRecording(true);
    setSessionSeconds(0);
    setSessionScoreHistory([]);
  };

  const stopAndSaveSession = () => {
    setIsRecording(false);
    const avgScore =
      sessionScoreHistory.length > 0
        ? Math.round(sessionScoreHistory.reduce((a, b) => a + b, 0) / sessionScoreHistory.length)
        : postureStatus.overallScore;

    const newSession: ExerciseSession = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      durationSeconds: sessionSeconds > 0 ? sessionSeconds : 180,
      averagePostureScore: avgScore,
      movementQuality: avgScore >= 88 ? 'Excellent' : avgScore >= 75 ? 'Good' : 'Needs Improvement',
      issuesDetected: postureStatus.status === 'GOOD' ? 1 : 3,
      exerciseType: 'General Posture',
      anglesSummary: {
        avgLeftKnee: angles.leftKnee,
        avgRightKnee: angles.rightKnee,
        avgLeftElbow: angles.leftElbow,
        avgRightElbow: angles.rightElbow,
      },
    };

    saveSession(newSession);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    if (onSessionSaved) onSessionSaved();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Session Recording Top Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Active Live Session</h2>
            <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
              <span>DURATION: {formatTime(sessionSeconds)}</span>
              <span>•</span>
              <span className="text-brand-deepGreen font-bold">LIVE SCORE: {postureStatus.overallScore}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isRecording ? (
            <button
              onClick={startSessionRecording}
              className="bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-brand-cyan fill-brand-cyan" />
              <span>Record Session</span>
            </button>
          ) : (
            <button
              onClick={stopAndSaveSession}
              className="bg-brand-maroon hover:bg-red-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Save & End Session</span>
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SECTION: LIVE WEBCAM & POSE CANVAS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <PoseCanvas
            onLandmarksDetected={handleLandmarksDetected}
            onNoPersonDetected={handleNoPersonDetected}
            isTracking={isTracking}
            setIsTracking={setIsTracking}
          />

          <JointAngleCards angles={angles} />
        </div>

        {/* RIGHT SECTION: BIOMECHANICAL ANALYTICS & RECOVERY (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <BiomechanicalMetrics status={postureStatus} />

          <VoiceCoachPanel feedbackMessages={postureStatus.feedbackMessages} />

          <RecoveryScoreCard mobility={mobility} />
        </div>

      </div>

    </div>
  );
};
