import React from 'react';
import { PostureStatus } from '../../types/biomechanics';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BiomechanicalMetricsProps {
  status: PostureStatus;
}

export const BiomechanicalMetrics: React.FC<BiomechanicalMetricsProps> = ({ status }) => {
  const isGood = status.status === 'GOOD';
  const score = status.overallScore;

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
      
      {/* Top Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider">
            Real-Time Analysis
          </h3>
          <p className="text-base font-extrabold text-gray-900">Biomechanical Posture Score</p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
          isGood ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {isGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{status.status}</span>
        </div>
      </div>

      {/* Large Circular Score Gauge */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Dynamic Animated score ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className={`transition-all duration-700 ease-out ${
                score >= 85 ? 'stroke-brand-deepGreen' : score >= 70 ? 'stroke-amber-500' : 'stroke-brand-maroon'
              }`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute text-center">
            <span className="text-4xl font-black text-brand-deepGreen tracking-tight">
              {score}%
            </span>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              Posture
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Alignment Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        
        {/* Head Alignment */}
        <div className="p-3 rounded-2xl bg-brand-bgLight border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-gray-700">Head Alignment</span>
            {status.headAlignment.status === 'Good' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{status.headAlignment.detail}</p>
        </div>

        {/* Shoulder Balance */}
        <div className="p-3 rounded-2xl bg-brand-bgLight border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-gray-700">Shoulder Balance</span>
            {status.shoulderBalance.status === 'Good' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{status.shoulderBalance.detail}</p>
        </div>

        {/* Hip Alignment */}
        <div className="p-3 rounded-2xl bg-brand-bgLight border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-gray-700">Hip Alignment</span>
            {status.hipAlignment.status === 'Good' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{status.hipAlignment.detail}</p>
        </div>

        {/* Knee Position */}
        <div className="p-3 rounded-2xl bg-brand-bgLight border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-gray-700">Knee Position</span>
            {status.kneePosition.status === 'Good' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{status.kneePosition.detail}</p>
        </div>

      </div>

    </div>
  );
};
