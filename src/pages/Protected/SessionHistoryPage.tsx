import React, { useState, useEffect } from 'react';
import { History, Trash2, Calendar, Clock, Award, TrendingUp, BarChart2 } from 'lucide-react';
import { SessionRecord } from '../../types/workout';
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
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your workout & posture history?')) {
      clearStoredHistory();
      setSessions([]);
    }
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const lineChartData = [...sessions].reverse().map((s, idx) => ({
    name: `S#${idx + 1}`,
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
    <div className="h-[calc(100vh-theme(spacing.16))] max-h-[calc(100vh-theme(spacing.16))] overflow-y-auto overflow-x-hidden space-y-4 pr-1 pb-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <History className="w-5 h-5 text-brand-cyanDark" />
            <h2 className="text-base font-extrabold text-gray-900">Session History & Analytics</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Local browser records of posture assessments, rep volumes, and kinematic trends.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Analytics Charts Section */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Posture Score Trend Line */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-brand-deepGreen">
              <TrendingUp className="w-4 h-4 text-brand-cyanDark" />
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Posture Score Trend
              </h3>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#294D45',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#72D6D4"
                    strokeWidth={3}
                    dot={{ fill: '#294D45', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Symmetry / Biomechanical Bar Chart */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-brand-deepGreen">
              <BarChart2 className="w-4 h-4 text-brand-cyanDark" />
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Anatomical Accuracy Index
              </h3>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#888888" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#294D45',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="score" fill="#294D45" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Session Logs List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
          Recorded Sessions ({sessions.length})
        </h3>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 space-y-2 border border-gray-200/80">
            <Award className="w-10 h-10 mx-auto text-gray-300" />
            <p className="font-bold text-sm text-gray-600">No workout sessions recorded yet.</p>
            <p className="text-xs">
              Complete an analysis or rep counter session and click "Save Session" to track your progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-2.5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-sm text-gray-900 block">
                      {session.exerciseType}
                    </span>
                    <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{session.date}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      session.movementQuality === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-brand-cyan/20 text-brand-deepGreen'
                    }`}
                  >
                    {session.movementQuality}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Posture Score</span>
                    <span className="text-lg font-black text-brand-deepGreen">
                      {session.averagePostureScore}
                      <span className="text-xs text-gray-400 font-normal">/100</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Duration</span>
                    <span className="text-xs font-bold text-gray-700 flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{formatSecs(session.durationSeconds)}</span>
                    </span>
                  </div>
                </div>

                {session.repsCompleted !== undefined && (
                  <div className="text-xs font-bold text-brand-deepGreen bg-brand-cyan/10 p-2 rounded-xl text-center">
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

export default SessionHistoryPage;
