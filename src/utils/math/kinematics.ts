import { Landmark, JointAngles } from '../../types/biomechanics';

// MediaPipe 33 Landmark Indices Constants
export const LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

/**
 * Calculates the angle between 3 2D points (A -> B -> C) in degrees.
 * Point B is the vertex (joint center).
 * Normalizes output to [0°, 180°].
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  if (!a || !b || !c) return 0;

  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle);
}

/**
 * Extracts key joint angles and anatomical alignment states from a 33-landmark pose array
 */
export function computeJointAngles(landmarks: Landmark[]): JointAngles {
  if (!landmarks || landmarks.length < 29) {
    return {
      leftElbow: 180,
      rightElbow: 180,
      leftKnee: 180,
      rightKnee: 180,
      leftHip: 180,
      rightHip: 180,
      shoulderAlignment: 'Balanced',
      hipAlignment: 'Balanced',
      headAlignment: 'Aligned',
    };
  }

  // Left Elbow Angle: Shoulder (11) -> Elbow (13) -> Wrist (15)
  const leftElbow = calculateAngle(
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_ELBOW],
    landmarks[LANDMARKS.LEFT_WRIST]
  );

  // Right Elbow Angle: Shoulder (12) -> Elbow (14) -> Wrist (16)
  const rightElbow = calculateAngle(
    landmarks[LANDMARKS.RIGHT_SHOULDER],
    landmarks[LANDMARKS.RIGHT_ELBOW],
    landmarks[LANDMARKS.RIGHT_WRIST]
  );

  // Left Knee Angle: Hip (23) -> Knee (25) -> Ankle (27)
  const leftKnee = calculateAngle(
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE],
    landmarks[LANDMARKS.LEFT_ANKLE]
  );

  // Right Knee Angle: Hip (24) -> Knee (26) -> Ankle (28)
  const rightKnee = calculateAngle(
    landmarks[LANDMARKS.RIGHT_HIP],
    landmarks[LANDMARKS.RIGHT_KNEE],
    landmarks[LANDMARKS.RIGHT_ANKLE]
  );

  // Left Hip Angle: Shoulder (11) -> Hip (23) -> Knee (25)
  const leftHip = calculateAngle(
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE]
  );

  // Right Hip Angle: Shoulder (12) -> Hip (24) -> Knee (26)
  const rightHip = calculateAngle(
    landmarks[LANDMARKS.RIGHT_SHOULDER],
    landmarks[LANDMARKS.RIGHT_HIP],
    landmarks[LANDMARKS.RIGHT_KNEE]
  );

  // Shoulder Height Differential
  const leftShoulderY = landmarks[LANDMARKS.LEFT_SHOULDER].y;
  const rightShoulderY = landmarks[LANDMARKS.RIGHT_SHOULDER].y;
  const shoulderDiff = Math.abs(leftShoulderY - rightShoulderY);

  let shoulderAlignment: 'Balanced' | 'Slight Imbalance' | 'Severe Imbalance' = 'Balanced';
  if (shoulderDiff > 0.08) {
    shoulderAlignment = 'Severe Imbalance';
  } else if (shoulderDiff > 0.035) {
    shoulderAlignment = 'Slight Imbalance';
  }

  // Hip Level Differential
  const leftHipY = landmarks[LANDMARKS.LEFT_HIP].y;
  const rightHipY = landmarks[LANDMARKS.RIGHT_HIP].y;
  const hipDiff = Math.abs(leftHipY - rightHipY);

  let hipAlignment: 'Balanced' | 'Slight Tilt' | 'Severe Tilt' = 'Balanced';
  if (hipDiff > 0.08) {
    hipAlignment = 'Severe Tilt';
  } else if (hipDiff > 0.035) {
    hipAlignment = 'Slight Tilt';
  }

  // Head Alignment (Ear vs Shoulder X & Nose position)
  const noseX = landmarks[LANDMARKS.NOSE].x;
  const shoulderMidX = (landmarks[LANDMARKS.LEFT_SHOULDER].x + landmarks[LANDMARKS.RIGHT_SHOULDER].x) / 2;
  const headOffset = Math.abs(noseX - shoulderMidX);

  let headAlignment: 'Aligned' | 'Forward Head' | 'Tilted' = 'Aligned';
  if (headOffset > 0.12) {
    headAlignment = 'Forward Head';
  } else if (headOffset > 0.06) {
    headAlignment = 'Tilted';
  }

  return {
    leftElbow,
    rightElbow,
    leftKnee,
    rightKnee,
    leftHip,
    rightHip,
    shoulderAlignment,
    hipAlignment,
    headAlignment,
  };
}
