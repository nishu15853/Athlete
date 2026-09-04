import React from 'react';
import { MobilityIndex } from '../../types/biomechanics';
import { Compass } from 'lucide-react';

interface RecoveryScoreCardProps {
  mobility: MobilityIndex;
}

export const RecoveryScoreCard: React.FC<RecoveryScoreCardProps> = ({ mobility }) => {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Rehabilitation Index
          </h3>
          <p className="text-sm font-extrabold text-gray-900">Recovery & Mobility Score</p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-brand-cyan/20 text-brand-deepGreen flex items-center justify-center">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center space-x-3 bg-brand-deepGreen text-white p-2.5 rounded-xl border border-brand-cyan/30 shadow-sm">
        <div className="text-3xl font-black text-brand-cyan tracking-tight leading-none shrink-0">
          {mobility.overallIndex}
          <span className="text-xs text-white/60 font-normal"> /100</span>
        </div>
        <div className="text-[11px] leading-tight">
          <p className="font-extrabold text-brand-cyan uppercase tracking-wider">MOBILITY INDEX</p>
          <p className="text-gray-300 text-[10px]">Optimal joint range & symmetrical movement stability.</p>
        </div>
      </div>

      {/* Metric Progress Bars Breakdown */}
      <div className="space-y-2 text-xs">
        {/* Posture Stability */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[11px] font-bold text-gray-700">
            <span>Posture Stability</span>
            <span className="text-brand-deepGreen">{mobility.stability}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-deepGreen h-2 rounded-full transition-all duration-500"
              style={{ width: `${mobility.stability}%` }}
            />
          </div>
        </div>

        {/* Body Symmetry */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[11px] font-bold text-gray-700">
            <span>Body Symmetry</span>
            <span className="text-brand-deepGreen">{mobility.symmetry}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-cyanDark h-2 rounded-full transition-all duration-500"
              style={{ width: `${mobility.symmetry}%` }}
            />
          </div>
        </div>

        {/* Range of Motion */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[11px] font-bold text-gray-700">
            <span>Range of Motion</span>
            <span className="text-brand-deepGreen">{mobility.movementRange}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${mobility.movementRange}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryScoreCard;
