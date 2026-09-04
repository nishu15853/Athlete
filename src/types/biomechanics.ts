import { ExerciseType, SessionRecord, ExerciseSession } from './workout';

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface JointAngles {
  leftElbow: number;
  rightElbow: number;
  leftKnee: number;
  rightKnee: number;
  leftHip: number;
  rightHip: number;
  shoulderAlignment: 'Balanced' | 'Slight Imbalance' | 'Severe Imbalance';
  hipAlignment: 'Balanced' | 'Slight Tilt' | 'Severe Tilt';
  headAlignment: 'Aligned' | 'Forward Head' | 'Tilted';
}

export interface PostureFaults {
  forwardHead: boolean;
  shoulderImbalance: boolean;
  pelvicTilt: boolean;
  kneeValgus: boolean;
}

export interface AlignmentDetail {
  status: 'Good' | 'Needs Correction';
  detail: string;
}

export interface PostureStatus {
  overallScore: number; // 0 to 100
  status: 'GOOD' | 'NEEDS CORRECTION';
  headAlignment: AlignmentDetail;
  shoulderBalance: AlignmentDetail;
  hipAlignment: AlignmentDetail;
  kneePosition: AlignmentDetail;
  feedbackMessages: string[];
}

export interface MobilityIndex {
  overallIndex: number; // 0 to 100
  stability: number;   // 0 to 100
  symmetry: number;    // 0 to 100
  movementRange: number; // 0 to 100
  alignment: number;   // 0 to 100
}

export interface SymmetryMetrics {
  leftScore: number;
  rightScore: number;
  differencePct: number;
  status: 'Balanced' | 'Mild Asymmetry' | 'Severe Asymmetry';
}

export type PatientCondition = 'general' | 'post-op' | 'geriatric';

export interface JointStress {
  leftKnee: 'normal' | 'moderate' | 'high';
  rightKnee: 'normal' | 'moderate' | 'high';
  leftElbow: 'normal' | 'moderate' | 'high';
  rightElbow: 'normal' | 'moderate' | 'high';
  spine: 'normal' | 'moderate' | 'high';
}

export type ActiveTab = 'landing' | 'dashboard' | 'exercise' | 'history' | 'about' | 'overview';

// Re-export workout types for seamless interoperability
export type { ExerciseType, SessionRecord, ExerciseSession };
