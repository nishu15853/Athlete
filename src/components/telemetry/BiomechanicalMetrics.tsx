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
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Real-Time Analysis
          </h3>
          <p className="text-sm font-extrabold text-gray-900">Posture Score</p>
        </div>
        <div
          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isGood
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isGood ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          <span>{status.status}</span>
        </div>
      </div>

      {/* Circular Score Gauge */}
      <div className="flex items-center justify-around py-1">
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Dynamic Animated score ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`transition-all duration-500 ease-out ${
                score >= 85
                  ? 'stroke-brand-deepGreen'
                  : score >= 70
                  ? 'stroke-amber-500'
                  : 'stroke-rose-600'
              }`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Score Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-brand-deepGreen tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              out of 100
            </span>
          </div>
        </div>

        {/* Key Metrics Quick Summary */}
        <div className="space-y-1.5 text-right text-xs">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Shoulders</span>
            <span
              className={`font-extrabold text-xs ${
                status.shoulderBalance.status === 'Good' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {status.shoulderBalance.detail}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Hips</span>
            <span
              className={`font-extrabold text-xs ${
                status.hipAlignment.status === 'Good' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {status.hipAlignment.detail}
            </span>
          </div>
        </div>
      </div>

      {/* Alignment Status Indicators Grid */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100 text-xs">
        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-600 font-medium">Head</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              status.headAlignment.status === 'Good'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {status.headAlignment.status}
          </span>
        </div>

        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-600 font-medium">Knees</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              status.kneePosition.status === 'Good'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {status.kneePosition.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BiomechanicalMetrics;
