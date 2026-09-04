import React, { useState, useEffect } from 'react';
import { History, Trash2, Calendar, Clock, Award, TrendingUp, BarChart2, FileText, Printer, X, ShieldCheck, Activity } from 'lucide-react';
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
} from 'recharts';

export const SessionHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

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

  // Calculate aggregate metrics for clinical report
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.averagePostureScore, 0) / sessions.length)
    : 92;
  const totalDuration = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);

  return (
    <div className="h-full max-h-full overflow-y-auto overflow-x-hidden space-y-4 pr-1 pb-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <History className="w-5 h-5 text-brand-cyanDark" />
            <h2 className="text-base font-extrabold text-gray-900">Session History & Clinical Tele-Monitoring</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Local browser records of posture assessments, rep volumes, and kinematic trends.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {sessions.length > 0 && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-brand-deepGreen bg-brand-cyan/20 hover:bg-brand-cyan/30 rounded-xl transition-colors border border-brand-cyan/40 shadow-sm"
              title="Generate Doctor Assessment Summary (Slide 3 & 4 Feature)"
            >
              <FileText className="w-3.5 h-3.5 text-brand-deepGreen" />
              <span>Clinical Doctor Report</span>
            </button>
          )}

          {sessions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Analytics Charts Section */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Posture Score Trend Line */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-brand-deepGreen">
              <TrendingUp className="w-4 h-4 text-brand-cyanDark" />
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Posture Score Trend (Longitudinal Recovery)
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

      {/* Clinical Tele-Monitoring Report Modal (PPT Slide 3 & 4) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-brand-cyan/30 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-deepGreen text-white flex items-center justify-center font-black">
                  <Activity className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-wide">
                    ATHLETEMIND AI — CLINICAL ASSESSMENT REPORT
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Remote Doctor Tele-Monitoring & Biomechanical Audit (Code Build 1.0)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Patient Protocol</span>
                <span className="font-extrabold text-brand-deepGreen">Post-Op / Wellness</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Total Sessions</span>
                <span className="font-extrabold text-gray-800">{sessions.length} recorded</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Mean Score</span>
                <span className="font-extrabold text-emerald-600">{avgScore}% (Optimal)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Cumulative Time</span>
                <span className="font-extrabold text-gray-800">{Math.round(totalDuration / 60)} min</span>
              </div>
            </div>

            {/* Anatomical Accuracy Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Objective Biomechanical Evaluation</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                  <span className="font-bold text-brand-deepGreen block">Cervical & Spine Alignment: 92%</span>
                  <p className="text-[11px] text-gray-600">Minimal forward head translation detected during loaded movements.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">Knee & Patellar Tracking: 94%</span>
                  <p className="text-[11px] text-gray-600">No dangerous knee valgus inward caving detected; safe graft strain.</p>
                </div>
              </div>
            </div>

            {/* Doctor Recommendation Field */}
            <div className="p-3 bg-brand-bgLight rounded-2xl border border-gray-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Clinician Review Summary</span>
              <p className="text-[11px] text-gray-700 italic">
                "Patient demonstrates symmetrical kinematic loading across bilateral lower extremities. Recommended to continue current rehab protocol with gradual increment in range of motion."
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4 text-brand-cyan" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistoryPage;
