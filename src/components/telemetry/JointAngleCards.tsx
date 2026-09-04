import React from 'react';
import { JointAngles } from '../../types/biomechanics';
import { Activity } from 'lucide-react';

interface JointAngleCardsProps {
  angles: JointAngles;
}

export const JointAngleCards: React.FC<JointAngleCardsProps> = ({ angles }) => {
  const cards = [
    {
      id: 'leftElbow',
      label: 'LEFT ELBOW',
      value: angles.leftElbow,
      sub: 'Shoulder-Elbow-Wrist',
      color: 'text-brand-deepGreen',
    },
    {
      id: 'rightElbow',
      label: 'RIGHT ELBOW',
      value: angles.rightElbow,
      sub: 'Shoulder-Elbow-Wrist',
      color: 'text-brand-deepGreen',
    },
    {
      id: 'leftKnee',
      label: 'LEFT KNEE',
      value: angles.leftKnee,
      sub: 'Hip-Knee-Ankle',
      color: 'text-emerald-700',
    },
    {
      id: 'rightKnee',
      label: 'RIGHT KNEE',
      value: angles.rightKnee,
      sub: 'Hip-Knee-Ankle',
      color: 'text-emerald-700',
    },
    {
      id: 'leftHip',
      label: 'LEFT HIP',
      value: angles.leftHip,
      sub: 'Torso-Hip-Knee',
      color: 'text-indigo-700',
    },
    {
      id: 'rightHip',
      label: 'RIGHT HIP',
      value: angles.rightHip,
      sub: 'Torso-Hip-Knee',
      color: 'text-indigo-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 shadow-sm space-y-2.5">
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-brand-deepGreen" />
          <h3 className="text-xs font-extrabold text-gray-900">Joint Angle Analytics</h3>
        </div>
        <span className="text-[10px] font-mono text-brand-cyanDark bg-brand-cyan/15 px-2 py-0.5 rounded-full font-bold">
          ATAN2 ENGINE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((c) => (
          <div
            key={c.id}
            className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 hover:border-brand-cyan/40 transition-colors"
          >
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">
              {c.label}
            </span>
            <div className="flex items-baseline space-x-0.5 my-0.5">
              <span className={`text-xl font-black ${c.color}`}>{c.value}</span>
              <span className="text-xs font-bold text-rose-600">°</span>
            </div>
            <p className="text-[9px] text-gray-400 truncate">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JointAngleCards;
