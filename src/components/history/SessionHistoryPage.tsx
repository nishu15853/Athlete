import React, { useState, useEffect } from 'react';
import { History, Trash2, Calendar, Clock, Award, TrendingUp, BarChart2 } from 'lucide-react';
import { ExerciseSession } from '../../types/biomechanics';
import { getStoredSessions, clearStoredHistory } from '../../utils/storage';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export const SessionHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your session history?')) {
      clearStoredHistory();
      setSessions([]);
    }
  };

  // Format seconds to mm:ss
  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Recharts Chart Data Formatting
  const lineChartData = [...sessions].reverse().map((s, idx) => ({
    name: `Session #${idx + 1}`,
    score: s.averagePostureScore,
    duration: Math.round(s.durationSeconds / 60),
  }));

  const barChartData = [
    { name: 'Head Align', score: 92 },
    { name: 'Shoulder Bal', score: 88 },
    { name: 'Hip Level', score: 85 },
    { name: 'Knee Pos', score: 94 },
    { name: 'Spine Posture', score: 90 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <History className="w-6 h-6" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Session History & Analytics</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Historical logs of posture scores, mobility indices, and repetition progress saved in localStorage.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs border border-rose-200 flex items-center space-x-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* RECHARTS ANALYTICS GRAPH SECTION */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Posture Score Over Time Line Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-brand-deepGreen" />
                <h3 className="text-base font-extrabold text-gray-900">Posture Score Over Time</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">TREND ANALYSIS</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#294D45"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#72D6D4' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body Alignment Component Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-brand-maroon" />
                <h3 className="text-base font-extrabold text-gray-900">Body Alignment Symmetry</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">AVERAGE SCORES</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#7A3038" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* HISTORICAL SESSIONS LIST */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900">Recorded Assessment Sessions</h2>

        {sessions.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3 bg-brand-bgLight rounded-2xl">
            <History className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold">No recorded sessions yet.</p>
            <p className="text-xs text-gray-500">
              Complete a live analysis session on the Dashboard to view your historical records here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session, idx) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-brand-bgLight border border-gray-200 space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-mono text-xs font-bold text-brand-deepGreen">
                    SESSION #{sessions.length - idx}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{session.date}</span>
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">POSTURE SCORE</span>
                    <span className="text-3xl font-black text-brand-deepGreen">
                      {session.averagePostureScore}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">EXERCISE</span>
                    <span className="text-xs font-extrabold text-brand-maroon">
                      {session.exerciseType}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-200/60">
                  <div>
                    <span className="text-gray-400 block">Duration</span>
                    <span className="font-bold text-gray-800">{formatSecs(session.durationSeconds)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Quality</span>
                    <span className="font-bold text-emerald-700">{session.movementQuality}</span>
                  </div>
                </div>

                {session.repsCompleted !== undefined && (
                  <div className="bg-brand-cyan/20 p-2 rounded-xl text-center text-xs font-bold text-brand-deepGreen">
                    Reps Completed: {session.repsCompleted}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
