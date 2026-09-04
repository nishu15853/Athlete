import React from 'react';
import { MobilityIndex } from '../../types/biomechanics';
import { ShieldCheck, Flame, Compass } from 'lucide-react';

interface RecoveryScoreCardProps {
  mobility: MobilityIndex;
}

export const RecoveryScoreCard: React.FC<RecoveryScoreCardProps> = ({ mobility }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider">
            Rehabilitation Index
          </h3>
          <p className="text-base font-extrabold text-gray-900">Recovery & Mobility Score</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-brand-cyan/20 text-brand-deepGreen flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center space-x-4 bg-brand-deepGreen text-white p-4 rounded-2xl border border-brand-cyan/30 shadow-md">
        <div className="text-4xl font-black text-brand-cyan tracking-tight">
          {mobility.overallIndex}
          <span className="text-lg text-white/60 font-normal"> / 100</span>
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-extrabold text-brand-cyan uppercase tracking-wider">MOBILITY INDEX</p>
          <p className="text-gray-200">Optimal joint range & symmetrical movement stability.</p>
        </div>
      </div>

      {/* Metric Progress Bars Breakdown */}
      <div className="space-y-3.5 text-xs">
        
        {/* Posture Stability */}
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Posture Stability</span>
            <span className="text-brand-deepGreen">{mobility.stability}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-deepGreen h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${mobility.stability}%` }}
            />
          </div>
        </div>

        {/* Body Symmetry */}
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Body Symmetry</span>
            <span className="text-brand-deepGreen">{mobility.symmetry}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-maroon h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${mobility.symmetry}%` }}
            />
          </div>
        </div>

        {/* Movement Range */}
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Movement Range</span>
            <span className="text-brand-deepGreen">{mobility.movementRange}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-cyanDark h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${mobility.movementRange}%` }}
            />
          </div>
        </div>

        {/* Alignment Score */}
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Alignment Score</span>
            <span className="text-brand-deepGreen">{mobility.alignment}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${mobility.alignment}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
