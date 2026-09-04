import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Trophy, RefreshCw, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Landmark, JointAngles } from '../../types/biomechanics';
import { ExerciseType, SessionRecord } from '../../types/workout';
import { computeJointAngles } from '../../utils/math/kinematics';
import { saveSession } from '../../utils/storage';
import { useRepCounter } from '../../hooks/useRepCounter';
import { PoseCanvas } from '../../components/canvas/PoseCanvas';

export const ExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState<boolean>(false);
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

  // Repetition Counting State Machine Hook
  const {
    repCount,
    phase,
    formQuality,
    feedback,
    selectedExercise,
    setSelectedExercise,
    resetReps,
    processRepetition,
  } = useRepCounter('Squat');

  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Handle Landmarks for Exercise Processing
  const handleLandmarksDetected = (landmarks: Landmark[]) => {
    const computed = computeJointAngles(landmarks);
    setAngles(computed);
    processRepetition(landmarks, computed);
  };

  const handleSaveWorkout = () => {
    const newSession: SessionRecord = {
      id: `workout-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      durationSeconds: 180,
      averagePostureScore: formQuality === 'GOOD' ? 94 : 82,
      movementQuality: formQuality === 'GOOD' ? 'Excellent' : 'Good',
      issuesDetected: formQuality === 'GOOD' ? 0 : 1,
      exerciseType: selectedExercise,
      repsCompleted: repCount,
      anglesSummary: {
        avgLeftKnee: angles.leftKnee,
        avgRightKnee: angles.rightKnee,
        avgLeftElbow: angles.leftElbow,
        avgRightElbow: angles.rightElbow,
      },
    };

    saveSession(newSession);
    setIsSaved(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSaved(false);
      navigate('/dashboard/history');
    }, 1200);
  };

  const exercises: ExerciseType[] = ['Squat', 'Arm Raise', 'Lunge'];

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] max-h-[calc(100vh-theme(spacing.16))] overflow-hidden flex flex-col space-y-3">
      {/* Exercise Selector & Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-gray-900">Exercise Rep Counter</h2>
            <p className="text-[10px] text-gray-400">Kinematic Depth & Repetition Analysis</p>
          </div>
        </div>

        {/* Exercise Selection Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          {exercises.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setSelectedExercise(ex);
                resetReps();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedExercise === ex
                  ? 'bg-brand-deepGreen text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={resetReps}
            className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            title="Reset Reps"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {repCount > 0 && (
            <button
              onClick={handleSaveWorkout}
              disabled={isSaved}
              className="px-3.5 py-1.5 bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Save Workout'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Canvas View */}
        <div className="lg:col-span-7 h-full min-h-[280px] overflow-hidden rounded-3xl">
          <PoseCanvas
            isTracking={isTracking}
            setIsTracking={setIsTracking}
            onLandmarksDetected={handleLandmarksDetected}
            angles={angles}
          />
        </div>

        {/* Right Column: Rep Metrics & Depth Gauges */}
        <div className="lg:col-span-5 h-full overflow-y-auto overflow-x-hidden pr-1.5 space-y-3">
          {/* Big Rep Counter Box */}
          <div className="bg-gradient-to-br from-brand-deepGreen to-[#16302b] text-white p-5 rounded-2xl border border-brand-cyan/30 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-cyan">
              <span>{phase === 'DOWN' ? 'BOTTOM PHASE' : 'TOP PHASE'}</span>
            </div>

            <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest block">
              {selectedExercise} Completed
            </span>
            <div className="text-6xl font-black text-white my-1 tracking-tight">{repCount}</div>
            <p className="text-xs text-emerald-300 font-semibold">{feedback}</p>
          </div>

          {/* Form Quality Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Kinematic Form Status</span>
              <div
                className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  formQuality === 'GOOD'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {formQuality === 'GOOD' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{formQuality}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 block uppercase">Left Knee Angle</span>
                <span className="text-lg font-black text-brand-deepGreen">{angles.leftKnee}°</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 block uppercase">Right Knee Angle</span>
                <span className="text-lg font-black text-brand-deepGreen">{angles.rightKnee}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
