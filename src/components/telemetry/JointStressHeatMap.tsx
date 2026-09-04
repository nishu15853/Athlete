import React from 'react';
import { Flame, ShieldAlert, CheckCircle, Activity, AlertTriangle } from 'lucide-react';
import { JointStress, JointAngles, PatientCondition } from '../../types/biomechanics';

interface JointStressHeatMapProps {
  stress: JointStress;
  angles: JointAngles;
  condition: PatientCondition;
}

export const JointStressHeatMap: React.FC<JointStressHeatMapProps> = ({
  stress,
  angles,
  condition,
}) => {
  const getStressLevelData = (level: 'normal' | 'moderate' | 'high') => {
    switch (level) {
      case 'high':
        return {
          pct: 85,
          colorClass: 'bg-rose-500',
          textClass: 'text-rose-600',
          bgLight: 'bg-rose-50 border-rose-200',
          label: 'High Shear Strain',
        };
      case 'moderate':
        return {
          pct: 55,
          colorClass: 'bg-amber-500',
          textClass: 'text-amber-600',
          bgLight: 'bg-amber-50 border-amber-200',
          label: 'Moderate Load',
        };
      default:
        return {
          pct: 20,
          colorClass: 'bg-emerald-500',
          textClass: 'text-emerald-600',
          bgLight: 'bg-emerald-50 border-emerald-200',
          label: 'Optimal / Safe',
        };
    }
  };

  const lkData = getStressLevelData(stress.leftKnee);
  const rkData = getStressLevelData(stress.rightKnee);
  const leData = getStressLevelData(stress.leftElbow);
  const reData = getStressLevelData(stress.rightElbow);
  const spineData = getStressLevelData(stress.spine);

  const hasHighStrain =
    stress.leftKnee === 'high' ||
    stress.rightKnee === 'high' ||
    stress.spine === 'high' ||
    stress.leftElbow === 'high' ||
    stress.rightElbow === 'high';

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200/80 shadow-sm space-y-3">
      {/* Card Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Safety Dashboard: Joint Stress Heat Map
            </h3>
            <p className="text-[10px] text-gray-500">Real-Time Kinematic Strain & Shear Force (Slide 7)</p>
          </div>
        </div>

        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
            hasHighStrain
              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {hasHighStrain ? '⚠ STRAIN ALERT' : '✓ SAFE LOAD'}
        </span>
      </div>

      {/* Condition Protocol Warning */}
      {condition === 'post-op' && (
        <div className="flex items-start space-x-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Post-Op Graft Safety Protocol:</span> Knee flexion capped at 90° to prevent excessive patellar tendon shear strain.
          </div>
        </div>
      )}

      {condition === 'geriatric' && (
        <div className="flex items-start space-x-2 p-2 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
          <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Geriatric Stability Protocol:</span> Center-of-mass alignment prioritized to mitigate loss-of-balance risks.
          </div>
        </div>
      )}

      {/* Heat Map Meters Grid */}
      <div className="space-y-2 text-xs">
        {/* Cervical Spine */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-gray-700">Cervical Spine / Neck Alignment</span>
            <span className={spineData.textClass}>{spineData.label}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${spineData.colorClass} transition-all duration-300`}
              style={{ width: `${spineData.pct}%` }}
            />
          </div>
        </div>

        {/* Left Knee */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-gray-700">Left Knee ({angles.leftKnee}°)</span>
            <span className={lkData.textClass}>{lkData.label}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${lkData.colorClass} transition-all duration-300`}
              style={{ width: `${lkData.pct}%` }}
            />
          </div>
        </div>

        {/* Right Knee */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-gray-700">Right Knee ({angles.rightKnee}°)</span>
            <span className={rkData.textClass}>{rkData.label}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${rkData.colorClass} transition-all duration-300`}
              style={{ width: `${rkData.pct}%` }}
            />
          </div>
        </div>

        {/* Elbows */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl border bg-gray-50/70">
            <span className="text-[10px] text-gray-500 block">L-Elbow ({angles.leftElbow}°)</span>
            <span className={`text-[11px] font-bold ${leData.textClass}`}>{leData.label}</span>
          </div>
          <div className="p-2 rounded-xl border bg-gray-50/70">
            <span className="text-[10px] text-gray-500 block">R-Elbow ({angles.rightElbow}°)</span>
            <span className={`text-[11px] font-bold ${reData.textClass}`}>{reData.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointStressHeatMap;
