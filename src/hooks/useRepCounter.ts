import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Landmark, JointAngles } from '../types/biomechanics';
import { ExerciseType, RepPhase } from '../types/workout';
import { computeJointAngles } from '../utils/math/kinematics';

interface UseRepCounterReturn {
  repCount: number;
  phase: RepPhase;
  formQuality: 'GOOD' | 'IMPROVE';
  feedback: string;
  selectedExercise: ExerciseType;
  setSelectedExercise: (exercise: ExerciseType) => void;
  resetReps: () => void;
  processRepetition: (landmarks: Landmark[], angles?: JointAngles) => void;
}

export function useRepCounter(initialExercise: ExerciseType = 'Squat'): UseRepCounterReturn {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(initialExercise);
  const [repCount, setRepCount] = useState<number>(0);
  const [phase, setPhase] = useState<RepPhase>('UP');
  const [formQuality, setFormQuality] = useState<'GOOD' | 'IMPROVE'>('GOOD');
  const [feedback, setFeedback] = useState<string>('Ready! Perform your first repetition.');

  const repStartMsRef = useRef<number>(Date.now());

  const resetReps = useCallback(() => {
    setRepCount(0);
    setPhase('UP');
    setFormQuality('GOOD');
    setFeedback('Rep counter reset. Ready when you are!');
    repStartMsRef.current = Date.now();
  }, []);

  const processRepetition = useCallback(
    (landmarks: Landmark[], existingAngles?: JointAngles) => {
      const angles = existingAngles || computeJointAngles(landmarks);
      const avgKnee = (angles.leftKnee + angles.rightKnee) / 2;
      const avgElbow = (angles.leftElbow + angles.rightElbow) / 2;

      if (selectedExercise === 'Squat') {
        // Squat Rep Logic: Standing > 155°, Squatting depth < 105°
        if (avgKnee < 105 && phase === 'UP') {
          setPhase('DOWN');
          setFeedback('Good depth! Now push up through your heels.');
        } else if (avgKnee > 155 && phase === 'DOWN') {
          setPhase('UP');
          setRepCount((prev) => {
            const next = prev + 1;
            if (next % 5 === 0) {
              confetti({ particleCount: 50, spread: 60 });
            }
            return next;
          });
          setFormQuality('GOOD');
          setFeedback('✓ Excellent repetition! Maintain knee alignment.');
        }

        // Form check during bottom phase
        if (avgKnee < 115 && angles.shoulderAlignment !== 'Balanced') {
          setFormQuality('IMPROVE');
          setFeedback('⚠ Keep your shoulders level during bottom phase.');
        }
      } else if (selectedExercise === 'Arm Raise') {
        // Arm Raise Logic: Arms down (< 100°) -> Overhead extension (> 150°)
        if (avgElbow > 150 && angles.leftHip < 100 && phase === 'UP') {
          setPhase('DOWN');
          setFeedback('Peak extension achieved! Lower arms with control.');
        } else if (avgElbow < 100 && phase === 'DOWN') {
          setPhase('UP');
          setRepCount((prev) => {
            const next = prev + 1;
            if (next % 5 === 0) {
              confetti({ particleCount: 50, spread: 60 });
            }
            return next;
          });
          setFormQuality('GOOD');
          setFeedback('✓ Clean overhead repetition! Great tempo.');
        }
      } else if (selectedExercise === 'Lunge') {
        // Lunge Logic: One knee flexing below 105° while standing baseline is > 155°
        const minKnee = Math.min(angles.leftKnee, angles.rightKnee);
        if (minKnee < 105 && phase === 'UP') {
          setPhase('DOWN');
          setFeedback('Solid lunge depth! Drive up through your front foot.');
        } else if (avgKnee > 150 && phase === 'DOWN') {
          setPhase('UP');
          setRepCount((prev) => {
            const next = prev + 1;
            if (next % 5 === 0) {
              confetti({ particleCount: 50, spread: 60 });
            }
            return next;
          });
          setFormQuality('GOOD');
          setFeedback('✓ Strong lunge rep! Keep your torso upright.');
        }
      }
    },
    [selectedExercise, phase]
  );

  return {
    repCount,
    phase,
    formQuality,
    feedback,
    selectedExercise,
    setSelectedExercise,
    resetReps,
    processRepetition,
  };
}
