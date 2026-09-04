import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Save, Sparkles, HeartPulse, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Landmark, JointAngles, PostureStatus, MobilityIndex, PatientCondition, JointStress } from '../../types/biomechanics';
import { SessionRecord } from '../../types/workout';
import { computeJointAngles } from '../../utils/math/kinematics';
import { evaluatePosture } from '../../utils/postureRules';
import { saveSession } from '../../utils/storage';
import { PoseCanvas } from '../../components/canvas/PoseCanvas';
import { BiomechanicalMetrics } from '../../components/telemetry/BiomechanicalMetrics';
import { JointAngleCards } from '../../components/telemetry/JointAngleCards';
import { RecoveryScoreCard } from '../../components/telemetry/RecoveryScoreCard';
import { VoiceCoachPanel } from '../../components/feedback/VoiceCoachPanel';

export const LiveAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [patientCondition, setPatientCondition] = useState<PatientCondition>('general');

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

  const [jointStress, setJointStress] = useState<JointStress>({
    leftKnee: 'normal',
    rightKnee: 'normal',
    leftElbow: 'normal',
    rightElbow: 'normal',
    spine: 'normal',
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
    symmetry: 88,
    movementRange: 82,
    alignment: 89,
  });

  const accumulatedScoresRef = useRef<number[]>([]);

  // Session Duration Timer
  useEffect(() => {
    let interval: any = null;
    if (isTracking) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  // Format seconds to MM:SS
  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Landmark Detection Consumer
  const handleLandmarksDetected = (detectedLandmarks: Landmark[]) => {
    const computedAngles = computeJointAngles(detectedLandmarks);
    setAngles(computedAngles);

    const evaluation = evaluatePosture(detectedLandmarks, computedAngles, patientCondition);
    setPostureStatus(evaluation.status);
    setMobility(evaluation.mobility);
    setJointStress(evaluation.stress);

    accumulatedScoresRef.current.push(evaluation.status.overallScore);
  };

  // Save Session to Local Storage
  const handleSaveSession = () => {
    const scores = accumulatedScoresRef.current;
    const avgScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : postureStatus.overallScore;

    const newSession: SessionRecord = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      durationSeconds: Math.max(sessionSeconds, 30),
      averagePostureScore: avgScore,
      movementQuality: avgScore >= 90 ? 'Excellent' : avgScore >= 75 ? 'Good' : 'Needs Improvement',
      issuesDetected: postureStatus.status === 'GOOD' ? 0 : postureStatus.feedbackMessages.length,
      exerciseType: `${patientCondition === 'post-op' ? 'Post-Op' : patientCondition === 'geriatric' ? 'Geriatric' : 'Wellness'} Posture`,
      anglesSummary: {
        avgLeftKnee: angles.leftKnee,
        avgRightKnee: angles.rightKnee,
        avgLeftElbow: angles.leftElbow,
        avgRightElbow: angles.rightElbow,
      },
    };

    saveSession(newSession);
    setIsSaved(true);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSaved(false);
      navigate('/dashboard/history');
    }, 1200);
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col space-y-3">
      {/* Top Controls & Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0 bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Duration Clock */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            <Clock className="w-4 h-4 text-brand-deepGreen" />
            <span className="font-mono text-sm font-bold text-gray-800 tracking-wider">
              {formatTime(sessionSeconds)}
            </span>
          </div>

          {/* Tracking Status */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              isTracking
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span>{isTracking ? 'TRACKING LIVE' : 'SESSION IDLE'}</span>
          </div>

          {/* Condition Selector (PPT Slide 3 & 4: Adaptive Recovery Engine) */}
          <div className="flex items-center space-x-1.5 bg-brand-bgLight p-1 rounded-xl border border-brand-cyan/30 text-xs">
            <HeartPulse className="w-3.5 h-3.5 text-brand-deepGreen ml-1" />
            <span className="text-[11px] font-bold text-gray-700 hidden sm:inline">Condition:</span>
            <select
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value as PatientCondition)}
              className="bg-white text-brand-deepGreen font-extrabold text-xs px-2 py-1 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-brand-cyan cursor-pointer"
            >
              <option value="general">General Wellness / Athlete</option>
              <option value="post-op">Post-Op Rehabilitation (Gentle)</option>
              <option value="geriatric">Geriatric Care (Stability)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {sessionSeconds > 5 && (
            <button
              onClick={handleSaveSession}
              disabled={isSaved}
              className="px-3.5 py-1.5 bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Save Session'}</span>
            </button>
          )}

          <button
            onClick={() => navigate('/dashboard/exercise')}
            className="px-3.5 py-1.5 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-deepGreen font-bold rounded-xl text-xs border border-brand-cyan/40 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rep Counter Mode</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Video HUD + Right Telemetry Column (1280x585 constrained) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Canvas HUD Stream */}
        <div className="lg:col-span-7 h-full min-h-[280px] overflow-hidden rounded-3xl">
          <PoseCanvas
            isTracking={isTracking}
            setIsTracking={setIsTracking}
            onLandmarksDetected={handleLandmarksDetected}
            angles={angles}
            stress={jointStress}
          />
        </div>

        {/* Right Column: Telemetry Cards (overflow-y-auto overflow-x-hidden, compact padding) */}
        <div className="lg:col-span-5 h-full overflow-y-auto overflow-x-hidden pr-1.5 space-y-3">
          <BiomechanicalMetrics status={postureStatus} />
          <JointAngleCards angles={angles} />
          <RecoveryScoreCard mobility={mobility} />
          <VoiceCoachPanel feedbackMessages={postureStatus.feedbackMessages} />
        </div>
      </div>
    </div>
  );
};

export default LiveAnalysisPage;
