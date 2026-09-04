import { Landmark, JointAngles, PostureStatus, MobilityIndex, PatientCondition, JointStress } from '../types/biomechanics';
import { LANDMARKS } from './biomechanics';

export function computeJointStress(
  angles: JointAngles,
  landmarks: Landmark[] = [],
  condition: PatientCondition = 'general'
): JointStress {
  // Post-op patients have lower stress thresholds for clinical safety
  const kneeCautionThreshold = condition === 'post-op' ? 100 : 80;
  const valgusTolerance = condition === 'post-op' ? 0.07 : 0.12;

  let leftKneeStress: 'normal' | 'moderate' | 'high' = 'normal';
  let rightKneeStress: 'normal' | 'moderate' | 'high' = 'normal';

  // Check left knee
  if (angles.leftKnee < kneeCautionThreshold - 20) {
    leftKneeStress = 'high';
  } else if (angles.leftKnee < kneeCautionThreshold) {
    leftKneeStress = 'moderate';
  }

  // Check right knee
  if (angles.rightKnee < kneeCautionThreshold - 20) {
    rightKneeStress = 'high';
  } else if (angles.rightKnee < kneeCautionThreshold) {
    rightKneeStress = 'moderate';
  }

  // Valgus check if landmarks present
  if (landmarks && landmarks.length >= 29) {
    const leftKneeX = landmarks[LANDMARKS.LEFT_KNEE]?.x || 0;
    const rightKneeX = landmarks[LANDMARKS.RIGHT_KNEE]?.x || 0;
    const leftAnkleX = landmarks[LANDMARKS.LEFT_ANKLE]?.x || 0;
    const rightAnkleX = landmarks[LANDMARKS.RIGHT_ANKLE]?.x || 0;

    if (Math.abs(leftKneeX - leftAnkleX) > valgusTolerance) {
      leftKneeStress = 'high';
    }
    if (Math.abs(rightKneeX - rightAnkleX) > valgusTolerance) {
      rightKneeStress = 'high';
    }
  }

  // Elbow stress
  const leftElbowStress: 'normal' | 'moderate' | 'high' =
    angles.leftElbow < 50 ? 'high' : angles.leftElbow < 70 ? 'moderate' : 'normal';
  const rightElbowStress: 'normal' | 'moderate' | 'high' =
    angles.rightElbow < 50 ? 'high' : angles.rightElbow < 70 ? 'moderate' : 'normal';

  // Spine stress
  let spineStress: 'normal' | 'moderate' | 'high' = 'normal';
  if (angles.headAlignment === 'Forward Head' || angles.shoulderAlignment === 'Severe Imbalance') {
    spineStress = 'high';
  } else if (angles.headAlignment === 'Tilted' || angles.shoulderAlignment === 'Slight Imbalance') {
    spineStress = 'moderate';
  }

  return {
    leftKnee: leftKneeStress,
    rightKnee: rightKneeStress,
    leftElbow: leftElbowStress,
    rightElbow: rightElbowStress,
    spine: spineStress,
  };
}

export function evaluatePosture(
  landmarks: Landmark[],
  angles: JointAngles,
  condition: PatientCondition = 'general'
): { status: PostureStatus; mobility: MobilityIndex; stress: JointStress } {
  const feedback: string[] = [];
  let score = 100;

  // 1. Head Alignment Evaluation
  let headStatus: 'Good' | 'Needs Correction' = 'Good';
  let headDetail = 'Good head posture';

  if (angles.headAlignment === 'Forward Head') {
    headStatus = 'Needs Correction';
    headDetail = 'Forward head displacement detected';
    score -= condition === 'geriatric' ? 18 : 15;
    feedback.push(
      condition === 'geriatric'
        ? 'Geriatric Stability: Pull chin slightly back to maintain center of mass.'
        : 'Try keeping your head aligned with your shoulders.'
    );
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
    score -= condition === 'post-op' ? 22 : 18;
    feedback.push(
      condition === 'post-op'
        ? 'Post-Op Caution: Level pelvis to protect lumbar & hip graft load.'
        : 'Slight hip imbalance detected. Engage your core.'
    );
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

  const valgusThreshold = condition === 'post-op' ? 0.08 : 0.12;

  if (landmarks && landmarks.length >= 29) {
    const leftKneeX = landmarks[LANDMARKS.LEFT_KNEE].x;
    const rightKneeX = landmarks[LANDMARKS.RIGHT_KNEE].x;
    const leftAnkleX = landmarks[LANDMARKS.LEFT_ANKLE].x;
    const rightAnkleX = landmarks[LANDMARKS.RIGHT_ANKLE].x;

    const leftValgus = Math.abs(leftKneeX - leftAnkleX);
    const rightValgus = Math.abs(rightKneeX - rightAnkleX);

    if (leftValgus > valgusThreshold || rightValgus > valgusThreshold) {
      kneeStatus = 'Needs Correction';
      kneeDetail = 'Knee valgus (caving inward) detected';
      score -= condition === 'post-op' ? 18 : 12;
      feedback.push(
        condition === 'post-op'
          ? 'Post-Op Warning: Valgus inward knee collapse detected. Push knees outward to avoid graft shear.'
          : 'Maintain proper knee alignment over your toes.'
      );
    } else {
      feedback.push('✓ Knee position is aligned.');
    }
  } else {
    feedback.push('✓ Knee position is aligned.');
  }

  // Post-Op Flexion Protection rule
  if (condition === 'post-op' && (angles.leftKnee < 85 || angles.rightKnee < 85)) {
    score -= 10;
    feedback.push('⚠️ Clinical Protocol Alert: Limit flexion to 90° during early rehab phase.');
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
  const stability = Math.round(score * (condition === 'geriatric' ? 0.9 : 0.95));
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

  const stress = computeJointStress(angles, landmarks, condition);

  return { status: postureStatus, mobility, stress };
}

