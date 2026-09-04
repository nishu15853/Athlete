import React from 'react';
import { Landmark, JointAngles, JointStress } from '../../types/biomechanics';
import { LANDMARKS } from '../../utils/math/kinematics';

interface AngleOverlayProps {
  landmarks: Landmark[];
  angles: JointAngles;
  canvasWidth: number;
  canvasHeight: number;
  isMirrored?: boolean;
  stress?: JointStress;
  showHeatmap?: boolean;
}

export const AngleOverlay: React.FC<AngleOverlayProps> = ({
  landmarks,
  angles,
  canvasWidth,
  canvasHeight,
  isMirrored = false,
  stress,
  showHeatmap = false,
}) => {
  if (!landmarks || landmarks.length < 29 || canvasWidth === 0 || canvasHeight === 0) {
    return null;
  }

  // Helper to calculate pixel coordinate from normalized landmark
  const getPixelCoord = (index: number) => {
    const lm = landmarks[index];
    if (!lm) return null;
    return {
      x: (isMirrored ? 1 - lm.x : lm.x) * canvasWidth,
      y: lm.y * canvasHeight,
    };
  };

  const leftKneePos = getPixelCoord(LANDMARKS.LEFT_KNEE);
  const rightKneePos = getPixelCoord(LANDMARKS.RIGHT_KNEE);
  const leftElbowPos = getPixelCoord(LANDMARKS.LEFT_ELBOW);
  const rightElbowPos = getPixelCoord(LANDMARKS.RIGHT_ELBOW);

  const getBadgeStyle = (angle: number, jointStressLevel?: 'normal' | 'moderate' | 'high') => {
    if (showHeatmap && jointStressLevel) {
      if (jointStressLevel === 'high') {
        return {
          colorClass: 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse',
          tag: '⚠ High Strain',
        };
      }
      if (jointStressLevel === 'moderate') {
        return {
          colorClass: 'bg-amber-500 text-white ring-1 ring-amber-300',
          tag: 'Moderate',
        };
      }
      return {
        colorClass: 'bg-emerald-600/90 text-white',
        tag: 'Safe',
      };
    }

    const diff = Math.abs(angle - 180);
    if (diff <= 25) return { colorClass: 'bg-emerald-500/90 text-white', tag: null };
    if (diff <= 50) return { colorClass: 'bg-amber-500/90 text-white', tag: null };
    return { colorClass: 'bg-brand-cyan/90 text-brand-deepGreen', tag: null };
  };

  const lkStyle = getBadgeStyle(angles.leftKnee, stress?.leftKnee);
  const rkStyle = getBadgeStyle(angles.rightKnee, stress?.rightKnee);
  const leStyle = getBadgeStyle(angles.leftElbow, stress?.leftElbow);
  const reStyle = getBadgeStyle(angles.rightElbow, stress?.rightElbow);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leftKneePos && (
        <div
          className={`absolute text-[10px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${lkStyle.colorClass}`}
          style={{ left: `${leftKneePos.x}px`, top: `${leftKneePos.y}px` }}
        >
          L-Knee: {angles.leftKnee}° {lkStyle.tag && `[${lkStyle.tag}]`}
        </div>
      )}

      {rightKneePos && (
        <div
          className={`absolute text-[10px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${rkStyle.colorClass}`}
          style={{ left: `${rightKneePos.x}px`, top: `${rightKneePos.y}px` }}
        >
          R-Knee: {angles.rightKnee}° {rkStyle.tag && `[${rkStyle.tag}]`}
        </div>
      )}

      {leftElbowPos && (
        <div
          className={`absolute text-[10px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${leStyle.colorClass}`}
          style={{ left: `${leftElbowPos.x}px`, top: `${leftElbowPos.y}px` }}
        >
          L-Elbow: {angles.leftElbow}° {leStyle.tag && `[${leStyle.tag}]`}
        </div>
      )}

      {rightElbowPos && (
        <div
          className={`absolute text-[10px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${reStyle.colorClass}`}
          style={{ left: `${rightElbowPos.x}px`, top: `${rightElbowPos.y}px` }}
        >
          R-Elbow: {angles.rightElbow}° {reStyle.tag && `[${reStyle.tag}]`}
        </div>
      )}
    </div>
  );
};

export default AngleOverlay;
