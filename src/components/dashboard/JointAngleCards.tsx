import React from 'react';
import { JointAngles } from '../../types/biomechanics';
import { Activity, Gauge, Sparkles } from 'lucide-react';

interface JointAngleCardsProps {
  angles: JointAngles;
}

export const JointAngleCards: React.FC<JointAngleCardsProps> = ({ angles }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-brand-deepGreen" />
          <h3 className="text-base font-extrabold text-gray-900">Joint Angle Analytics</h3>
        </div>
        <span className="text-[11px] font-mono text-brand-cyanDark bg-brand-cyan/15 px-2.5 py-0.5 rounded-full font-bold">
          TRIGONOMETRIC ENGINE
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Left Elbow */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            LEFT ELBOW
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-brand-deepGreen">{angles.leftElbow}</span>
            <span className="text-sm font-bold text-brand-maroon">°</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Shoulder-Elbow-Wrist</p>
        </div>

        {/* Right Elbow */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            RIGHT ELBOW
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-brand-deepGreen">{angles.rightElbow}</span>
            <span className="text-sm font-bold text-brand-maroon">°</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Shoulder-Elbow-Wrist</p>
        </div>

        {/* Left Knee */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            LEFT KNEE
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-700">{angles.leftKnee}</span>
            <span className="text-sm font-bold text-brand-maroon">°</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Hip-Knee-Ankle</p>
        </div>

        {/* Right Knee */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            RIGHT KNEE
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-700">{angles.rightKnee}</span>
            <span className="text-sm font-bold text-brand-maroon">°</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Hip-Knee-Ankle</p>
        </div>

        {/* Shoulder Alignment */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            SHOULDER ALIGNMENT
          </span>
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
            angles.shoulderAlignment === 'Balanced'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {angles.shoulderAlignment}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Acromion Plane Differential</p>
        </div>

        {/* Hip Alignment */}
        <div className="p-3.5 rounded-2xl bg-brand-bgLight border border-gray-200 hover:border-brand-deepGreen/30 transition-colors">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
            HIP ALIGNMENT
          </span>
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
            angles.hipAlignment === 'Balanced'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {angles.hipAlignment}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Iliac Crest Tilt Angle</p>
        </div>

      </div>
    </div>
  );
};
