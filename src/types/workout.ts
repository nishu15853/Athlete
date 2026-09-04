export type ExerciseType =
  | 'General Posture'
  | 'Post-Op Posture'
  | 'Geriatric Posture'
  | 'Wellness Posture'
  | 'Squat'
  | 'Arm Raise'
  | 'Lunge';

export type RepPhase = 'UP' | 'DOWN' | 'INFLECTION';

export interface Repetition {
  repNumber: number;
  durationMs: number;
  peakAngle: number;
  formScore: number;
  quality: 'GOOD' | 'IMPROVE';
  feedback?: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  durationSeconds: number;
  averagePostureScore: number;
  movementQuality: 'Excellent' | 'Good' | 'Needs Improvement';
  issuesDetected: number;
  exerciseType: ExerciseType;
  patientCondition?: string;
  repsCompleted?: number;
  repsDetail?: Repetition[];
  anglesSummary?: {
    avgLeftKnee?: number;
    avgRightKnee?: number;
    avgLeftElbow?: number;
    avgRightElbow?: number;
  };
}

// Alias for backwards compatibility
export type ExerciseSession = SessionRecord;
