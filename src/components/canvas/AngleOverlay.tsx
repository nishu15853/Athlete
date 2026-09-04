import React from 'react';
import { Landmark, JointAngles } from '../../types/biomechanics';
import { LANDMARKS } from '../../utils/math/kinematics';

interface AngleOverlayProps {
  landmarks: Landmark[];
  angles: JointAngles;
  canvasWidth: number;
  canvasHeight: number;
}

export const AngleOverlay: React.FC<AngleOverlayProps> = ({
  landmarks,
  angles,
  canvasWidth,
  canvasHeight,
}) => {
  if (!landmarks || landmarks.length < 29 || canvasWidth === 0 || canvasHeight === 0) {
    return null;
  }

  // Helper to calculate pixel coordinate from normalized landmark
  const getPixelCoord = (index: number) => {
    const lm = landmarks[index];
    if (!lm) return null;
    return {
      x: lm.x * canvasWidth,
      y: lm.y * canvasHeight,
    };
  };

  const leftKneePos = getPixelCoord(LANDMARKS.LEFT_KNEE);
  const rightKneePos = getPixelCoord(LANDMARKS.RIGHT_KNEE);
  const leftElbowPos = getPixelCoord(LANDMARKS.LEFT_ELBOW);
  const rightElbowPos = getPixelCoord(LANDMARKS.RIGHT_ELBOW);

  const getBadgeColor = (angle: number, target: number = 180) => {
    const diff = Math.abs(angle - target);
    if (diff <= 25) return 'bg-emerald-500/90 text-white';
    if (diff <= 50) return 'bg-amber-500/90 text-white';
    return 'bg-brand-cyan/90 text-brand-deepGreen';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leftKneePos && (
        <div
          className={`absolute text-[11px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${getBadgeColor(
            angles.leftKnee
          )}`}
          style={{ left: `${leftKneePos.x}px`, top: `${leftKneePos.y}px` }}
        >
          L-Knee: {angles.leftKnee}°
        </div>
      )}

      {rightKneePos && (
        <div
          className={`absolute text-[11px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${getBadgeColor(
            angles.rightKnee
          )}`}
          style={{ left: `${rightKneePos.x}px`, top: `${rightKneePos.y}px` }}
        >
          R-Knee: {angles.rightKnee}°
        </div>
      )}

      {leftElbowPos && (
        <div
          className={`absolute text-[11px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${getBadgeColor(
            angles.leftElbow
          )}`}
          style={{ left: `${leftElbowPos.x}px`, top: `${leftElbowPos.y}px` }}
        >
          L-Elbow: {angles.leftElbow}°
        </div>
      )}

      {rightElbowPos && (
        <div
          className={`absolute text-[11px] font-black px-1.5 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-6 transition-all ${getBadgeColor(
            angles.rightElbow
          )}`}
          style={{ left: `${rightElbowPos.x}px`, top: `${rightElbowPos.y}px` }}
        >
          R-Elbow: {angles.rightElbow}°
        </div>
      )}
    </div>
  );
};

export default AngleOverlay;
