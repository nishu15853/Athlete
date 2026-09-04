import { Landmark, JointAngles, PostureStatus, MobilityIndex } from '../types/biomechanics';
import { LANDMARKS } from './biomechanics';

export function evaluatePosture(landmarks: Landmark[], angles: JointAngles): { status: PostureStatus; mobility: MobilityIndex } {
  const feedback: string[] = [];
  let score = 100;

  // 1. Head Alignment Evaluation
  let headStatus: 'Good' | 'Needs Correction' = 'Good';
  let headDetail = 'Good head posture';

  if (angles.headAlignment === 'Forward Head') {
    headStatus = 'Needs Correction';
    headDetail = 'Forward head displacement detected';
    score -= 15;
    feedback.push('Try keeping your head aligned with your shoulders.');
  } else if (angles.headAlignment === 'Tilted') {
    headStatus = 'Needs Correction';
    headDetail = 'Slight head tilt detected';
    score -= 8;
    feedback.push('Align your head centered above your collarbone.');
  } else {
    feedback.push('✓ Head alignment is optimal.');
  }

  // 2. Shoulder Balance Evaluation
  let shoulderStatus: 'Good' | 'Needs Correction' = 'Good';
  let shoulderDetail = 'Balanced shoulders';

  if (angles.shoulderAlignment === 'Severe Imbalance') {
    shoulderStatus = 'Needs Correction';
    shoulderDetail = 'Uneven shoulder height';
    score -= 20;
    feedback.push('Your shoulders appear uneven. Try relaxing and balancing your posture.');
  } else if (angles.shoulderAlignment === 'Slight Imbalance') {
    shoulderStatus = 'Needs Correction';
    shoulderDetail = 'Minor shoulder asymmetry';
    score -= 10;
    feedback.push('Adjust shoulder height to keep both sides level.');
  } else {
    feedback.push('✓ Shoulder symmetry is good.');
  }

  // 3. Hip Alignment Evaluation
  let hipStatus: 'Good' | 'Needs Correction' = 'Good';
  let hipDetail = 'Hips level and balanced';

  if (angles.hipAlignment === 'Severe Tilt') {
    hipStatus = 'Needs Correction';
    hipDetail = 'Pelvic tilt / hip imbalance detected';
    score -= 18;
    feedback.push('Slight hip imbalance detected. Engage your core.');
  } else if (angles.hipAlignment === 'Slight Tilt') {
    hipStatus = 'Needs Correction';
    hipDetail = 'Slight hip tilt';
    score -= 8;
    feedback.push('Maintain equal weight distribution across both feet.');
  } else {
    feedback.push('✓ Hip alignment is level.');
  }

  // 4. Knee Position & Leg Alignment
  let kneeStatus: 'Good' | 'Needs Correction' = 'Good';
  let kneeDetail = 'Knees tracking properly';

  if (landmarks && landmarks.length >= 29) {
    const leftKneeX = landmarks[LANDMARKS.LEFT_KNEE].x;
    const rightKneeX = landmarks[LANDMARKS.RIGHT_KNEE].x;
    const leftAnkleX = landmarks[LANDMARKS.LEFT_ANKLE].x;
    const rightAnkleX = landmarks[LANDMARKS.RIGHT_ANKLE].x;

    const leftValgus = Math.abs(leftKneeX - leftAnkleX);
    const rightValgus = Math.abs(rightKneeX - rightAnkleX);

    if (leftValgus > 0.12 || rightValgus > 0.12) {
      kneeStatus = 'Needs Correction';
      kneeDetail = 'Knee valgus (caving inward) detected';
      score -= 12;
      feedback.push('Maintain proper knee alignment over your toes.');
    } else {
      feedback.push('✓ Knee position is aligned.');
    }
  } else {
    feedback.push('✓ Knee position is aligned.');
  }

  // Clamp score
  score = Math.max(40, Math.min(100, score));

  const postureStatus: PostureStatus = {
    overallScore: score,
    status: score >= 85 ? 'GOOD' : 'NEEDS CORRECTION',
    headAlignment: { status: headStatus, detail: headDetail },
    shoulderBalance: { status: shoulderStatus, detail: shoulderDetail },
    hipAlignment: { status: hipStatus, detail: hipDetail },
    kneePosition: { status: kneeStatus, detail: kneeDetail },
    feedbackMessages: feedback,
  };

  // Mobility & Recovery Index Breakdown
  const stability = Math.round(score * 0.95);
  const symmetry = angles.shoulderAlignment === 'Balanced' && angles.hipAlignment === 'Balanced' ? 95 : 82;
  const movementRange = Math.round((angles.leftElbow + angles.rightElbow + angles.leftKnee + angles.rightKnee) / 7.2);
  const alignment = Math.round((score + symmetry) / 2);
  const overallIndex = Math.round((stability + symmetry + movementRange + alignment) / 4);

  const mobility: MobilityIndex = {
    overallIndex: Math.min(100, Math.max(50, overallIndex)),
    stability: Math.min(100, stability),
    symmetry: Math.min(100, symmetry),
    movementRange: Math.min(100, Math.max(60, movementRange)),
    alignment: Math.min(100, alignment),
  };

  return { status: postureStatus, mobility };
}
