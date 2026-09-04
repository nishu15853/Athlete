import React, { useState } from 'react';
import { Dumbbell, Trophy, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { PoseCanvas } from '../dashboard/PoseCanvas';
import { Landmark, JointAngles, ExerciseType } from '../../types/biomechanics';
import { computeJointAngles } from '../../utils/biomechanics';
import { saveSession } from '../../utils/storage';
import confetti from 'canvas-confetti';

export const ExerciseAnalysisPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('Squat');
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [angles, setAngles] = useState<JointAngles>({
    leftElbow: 180, rightElbow: 180, leftKnee: 180, rightKnee: 180, leftHip: 180, rightHip: 180,
    shoulderAlignment: 'Balanced', hipAlignment: 'Balanced', headAlignment: 'Aligned'
  });

  // Repetition Counting State Machine
  const [repCount, setRepCount] = useState<number>(0);
  const [squatStage, setSquatStage] = useState<'UP' | 'DOWN'>('UP');
  const [formQuality, setFormQuality] = useState<'GOOD' | 'IMPROVE'>('GOOD');
  const [exerciseFeedback, setExerciseFeedback] = useState<string>('Ready! Perform your first repetition.');

  // Handle Landmarks for Exercise Processing
  const handleLandmarksDetected = (landmarks: Landmark[]) => {
    const computed = computeJointAngles(landmarks);
    setAngles(computed);

    const avgKnee = (computed.leftKnee + computed.rightKnee) / 2;
    const avgElbow = (computed.leftElbow + computed.rightElbow) / 2;

    if (selectedExercise === 'Squat') {
      // Squat Rep Detection Logic: Standing > 160°, Squatting < 100°
      if (avgKnee < 100 && squatStage === 'UP') {
        setSquatStage('DOWN');
        setExerciseFeedback('Good depth! Now push up through your heels.');
      } else if (avgKnee > 155 && squatStage === 'DOWN') {
        setSquatStage('UP');
        setRepCount((prev) => {
          const newCount = prev + 1;
          if (newCount % 5 === 0) {
            confetti({ particleCount: 50, spread: 60 });
          }
          return newCount;
        });
        setFormQuality('GOOD');
        setExerciseFeedback('✓ Excellent repetition! Maintain knee alignment.');
      }

      if (computed.leftKnee < 110 && computed.shoulderAlignment !== 'Balanced') {
        setFormQuality('IMPROVE');
        setExerciseFeedback('⚠ Keep your shoulders level during bottom phase.');
      }
    } else if (selectedExercise === 'Arm Raise') {
      // Arm Raise Rep Detection Logic: Arms Down (Elbow/Shoulder angle) -> Overhead (> 150°)
      if (avgElbow > 150 && computed.leftHip < 100 && squatStage === 'UP') {
        setSquatStage('DOWN');
        setExerciseFeedback('Peak extension achieved! Lower slowly.');
      } else if (avgElbow < 100 && squatStage === 'DOWN') {
        setSquatStage('UP');
        setRepCount((prev) => prev + 1);
        setExerciseFeedback('✓ Arm raise completed!');
      }
    } else if (selectedExercise === 'Lunge') {
      // Lunge Detection
      const kneeDiff = Math.abs(computed.leftKnee - computed.rightKnee);
      if (kneeDiff > 45 && squatStage === 'UP') {
        setSquatStage('DOWN');
        setExerciseFeedback('Deep lunge position detected. Drive back up.');
      } else if (kneeDiff < 15 && squatStage === 'DOWN') {
        setSquatStage('UP');
        setRepCount((prev) => prev + 1);
        setExerciseFeedback('✓ Balanced lunge completed!');
      }
    }
  };

  const resetReps = () => {
    setRepCount(0);
    setSquatStage('UP');
    setExerciseFeedback('Rep counter reset. Begin exercise.');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <Dumbbell className="w-6 h-6" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Exercise & Movement Analysis</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time automated repetition counter & movement depth form evaluation.
          </p>
        </div>

        {/* Exercise Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['Squat', 'Arm Raise', 'Lunge', 'General Posture'] as ExerciseType[]).map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setSelectedExercise(ex);
                resetReps();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedExercise === ex
                  ? 'bg-brand-deepGreen text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              [ {ex} ]
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Live Camera Feed */}
        <div className="lg:col-span-7 space-y-4">
          <PoseCanvas
            onLandmarksDetected={handleLandmarksDetected}
            onNoPersonDetected={() => {}}
            isTracking={isTracking}
            setIsTracking={setIsTracking}
          />
        </div>

        {/* Right Section: Rep Counter & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Big Rep Counter Card */}
          <div className="bg-gradient-to-br from-brand-deepGreen to-brand-deepGreenDark text-white p-6 rounded-3xl border border-brand-cyan/40 shadow-xl text-center space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-brand-cyan border-b border-white/10 pb-2">
              <span>EXERCISE: {selectedExercise.toUpperCase()}</span>
              <span>STAGE: {squatStage}</span>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest block">
                COMPLETED REPETITIONS
              </span>
              <span className="text-6xl font-black text-brand-cyan tracking-tight">
                {repCount}
              </span>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={resetReps}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/20 flex items-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Count</span>
              </button>
            </div>
          </div>

          {/* Form Quality & Real-Time Feedback */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">FORM QUALITY</span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                formQuality === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {formQuality === 'GOOD' ? '✓ GOOD FORM' : '⚠ IMPROVE FORM'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-bgLight border border-gray-200 flex items-start space-x-3 text-xs">
              <Activity className="w-5 h-5 text-brand-deepGreen shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900 mb-0.5">Live AI Form Coach</p>
                <p className="text-gray-600 font-medium">{exerciseFeedback}</p>
              </div>
            </div>

            {/* Angle Threshold Reference */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 block font-bold">LEFT KNEE ANGLE</span>
                <span className="text-lg font-black text-brand-deepGreen">{angles.leftKnee}°</span>
                <span className="text-[10px] text-gray-500 block">Target: &lt; 100°</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 block font-bold">RIGHT KNEE ANGLE</span>
                <span className="text-lg font-black text-brand-deepGreen">{angles.rightKnee}°</span>
                <span className="text-[10px] text-gray-500 block">Target: &lt; 100°</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
