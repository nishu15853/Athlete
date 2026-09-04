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
 * Calculates the interior planar angle between 3 landmarks (A -> B -> C) in degrees.
 * Point B is the vertex (joint center).
 *
 * Core Mathematical Normalization:
 * 1. Calculate raw angle difference:
 *    Δθ = |atan2(Cy - By, Cx - Bx) - atan2(Ay - By, Ax - Bx)|
 * 2. Radial wrap prior to degree conversion to avoid (-π <-> +π) branch-cut inversion:
 *    if Δθ > π => Δθ = 2π - Δθ
 * 3. Convert to interior degrees in [0°, 180°]:
 *    θ_deg = Δθ * (180 / π)
 *
 * Visibility & Confidence Gating:
 * If any point has visibility < minConfidence, returns 0 to prevent false baseline spikes.
 *
 * Overlapping Coordinates:
 * If vector lengths are zero (Δx = 0 and Δy = 0), returns 0 to eliminate NaN errors.
 *
 * @param a Proximal landmark (ray endpoint)
 * @param b Vertex landmark (joint center)
 * @param c Distal landmark (ray endpoint)
 * @param minConfidence Minimum visibility threshold (default 0.5)
 * @returns Normalized interior angle in [0°, 180°], or 0 if low confidence / invalid.
 */
export function calculateAngle(
  a: Landmark,
  b: Landmark,
  c: Landmark,
  minConfidence: number = 0.5
): number {
  if (!a || !b || !c) return 0;

  // Visibility & Confidence Gating
  if (
    (a.visibility !== undefined && a.visibility < minConfidence) ||
    (b.visibility !== undefined && b.visibility < minConfidence) ||
    (c.visibility !== undefined && c.visibility < minConfidence)
  ) {
    return 0;
  }

  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;

  // Handle overlapping coordinates (zero length vectors) to avoid NaN
  if ((v1x === 0 && v1y === 0) || (v2x === 0 && v2y === 0)) {
    return 0;
  }

  // Branch cut normalization across (-π <-> +π)
  let deltaTheta = Math.abs(Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x));

  // Normalize radian difference prior to degree conversion
  if (deltaTheta > Math.PI) {
    deltaTheta = 2 * Math.PI - deltaTheta;
  }

  const angleDeg = (deltaTheta * 180.0) / Math.PI;

  if (isNaN(angleDeg)) {
    return 0;
  }

  return Math.round(angleDeg);
}

/**
 * Calculates the knee angle: Hip -> Knee -> Ankle
 * @param hip Proximal hip landmark
 * @param knee Joint vertex landmark
 * @param ankle Distal ankle landmark
 * @param minConfidence Minimum visibility threshold (default 0.5)
 */
export function getKneeAngle(
  hip: Landmark,
  knee: Landmark,
  ankle: Landmark,
  minConfidence: number = 0.5
): number {
  return calculateAngle(hip, knee, ankle, minConfidence);
}

/**
 * Calculates the elbow angle: Shoulder -> Elbow -> Wrist
 * @param shoulder Proximal shoulder landmark
 * @param elbow Joint vertex landmark
 * @param wrist Distal wrist landmark
 * @param minConfidence Minimum visibility threshold (default 0.5)
 */
export function getElbowAngle(
  shoulder: Landmark,
  elbow: Landmark,
  wrist: Landmark,
  minConfidence: number = 0.5
): number {
  return calculateAngle(shoulder, elbow, wrist, minConfidence);
}

/**
 * Calculates the hip angle: Shoulder -> Hip -> Knee
 * @param shoulder Proximal shoulder landmark
 * @param hip Joint vertex landmark
 * @param knee Distal knee landmark
 * @param minConfidence Minimum visibility threshold (default 0.5)
 */
export function getHipAngle(
  shoulder: Landmark,
  hip: Landmark,
  knee: Landmark,
  minConfidence: number = 0.5
): number {
  return calculateAngle(shoulder, hip, knee, minConfidence);
}

/**
 * Extracts key joint angles and anatomical alignment states from a 33-landmark pose array
 */
export function computeJointAngles(landmarks: Landmark[], minConfidence: number = 0.5): JointAngles {
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
  const leftElbow = getElbowAngle(
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_ELBOW],
    landmarks[LANDMARKS.LEFT_WRIST],
    minConfidence
  );

  // Right Elbow Angle: Shoulder (12) -> Elbow (14) -> Wrist (16)
  const rightElbow = getElbowAngle(
    landmarks[LANDMARKS.RIGHT_SHOULDER],
    landmarks[LANDMARKS.RIGHT_ELBOW],
    landmarks[LANDMARKS.RIGHT_WRIST],
    minConfidence
  );

  // Left Knee Angle: Hip (23) -> Knee (25) -> Ankle (27)
  const leftKnee = getKneeAngle(
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE],
    landmarks[LANDMARKS.LEFT_ANKLE],
    minConfidence
  );

  // Right Knee Angle: Hip (24) -> Knee (26) -> Ankle (28)
  const rightKnee = getKneeAngle(
    landmarks[LANDMARKS.RIGHT_HIP],
    landmarks[LANDMARKS.RIGHT_KNEE],
    landmarks[LANDMARKS.RIGHT_ANKLE],
    minConfidence
  );

  // Left Hip Angle: Shoulder (11) -> Hip (23) -> Knee (25)
  const leftHip = getHipAngle(
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE],
    minConfidence
  );

  // Right Hip Angle: Shoulder (12) -> Hip (24) -> Knee (26)
  const rightHip = getHipAngle(
    landmarks[LANDMARKS.RIGHT_SHOULDER],
    landmarks[LANDMARKS.RIGHT_HIP],
    landmarks[LANDMARKS.RIGHT_KNEE],
    minConfidence
  );

  // Shoulder Height Differential
  const leftShoulderY = landmarks[LANDMARKS.LEFT_SHOULDER]?.y ?? 0;
  const rightShoulderY = landmarks[LANDMARKS.RIGHT_SHOULDER]?.y ?? 0;
  const shoulderDiff = Math.abs(leftShoulderY - rightShoulderY);

  let shoulderAlignment: 'Balanced' | 'Slight Imbalance' | 'Severe Imbalance' = 'Balanced';
  if (shoulderDiff > 0.08) {
    shoulderAlignment = 'Severe Imbalance';
  } else if (shoulderDiff > 0.035) {
    shoulderAlignment = 'Slight Imbalance';
  }

  // Hip Level Differential
  const leftHipY = landmarks[LANDMARKS.LEFT_HIP]?.y ?? 0;
  const rightHipY = landmarks[LANDMARKS.RIGHT_HIP]?.y ?? 0;
  const hipDiff = Math.abs(leftHipY - rightHipY);

  let hipAlignment: 'Balanced' | 'Slight Tilt' | 'Severe Tilt' = 'Balanced';
  if (hipDiff > 0.08) {
    hipAlignment = 'Severe Tilt';
  } else if (hipDiff > 0.035) {
    hipAlignment = 'Slight Tilt';
  }

  // Head Alignment (Ear vs Shoulder X & Nose position)
  const noseX = landmarks[LANDMARKS.NOSE]?.x ?? 0.5;
  const shoulderLeftX = landmarks[LANDMARKS.LEFT_SHOULDER]?.x ?? 0.4;
  const shoulderRightX = landmarks[LANDMARKS.RIGHT_SHOULDER]?.x ?? 0.6;
  const shoulderMidX = (shoulderLeftX + shoulderRightX) / 2;
  const headOffset = Math.abs(noseX - shoulderMidX);

  let headAlignment: 'Aligned' | 'Forward Head' | 'Tilted' = 'Aligned';
  if (headOffset > 0.12) {
    headAlignment = 'Forward Head';
  } else if (headOffset > 0.06) {
    headAlignment = 'Tilted';
  }

  return {
    leftElbow: leftElbow || 180,
    rightElbow: rightElbow || 180,
    leftKnee: leftKnee || 180,
    rightKnee: rightKnee || 180,
    leftHip: leftHip || 180,
    rightHip: rightHip || 180,
    shoulderAlignment,
    hipAlignment,
    headAlignment,
  };
}
