import React from 'react';
import { Cpu, Info, ArrowDown, Activity, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    { title: 'USER INPUT', desc: 'Webcam activation & user positioning in camera view frame.' },
    { title: 'CAMERA CAPTURE', desc: 'Continuous 30 FPS video frame extraction.' },
    { title: 'AI POSE DETECTION', desc: 'MediaPipe PoseLandmarker neural network inference.' },
    { title: 'LANDMARK EXTRACTION', desc: '33 3D skeletal landmark coordinates (X, Y, Z, visibility).' },
    { title: 'BIOMECHANICAL ANALYSIS', desc: 'Trigonometric angle calculations (atan2) for elbows, knees, hips, and shoulders.' },
    { title: 'POSTURE CLASSIFICATION', desc: 'Rule-based biomechanical classification (Forward Head, Shoulder tilt, Knee valgus).' },
    { title: 'REAL-TIME FEEDBACK', desc: 'Visual overlay, posture scores, and Web SpeechSynthesis voice coach alerts.' },
    { title: 'SESSION ANALYTICS', desc: 'Recovery index calculation & localStorage session persistence.' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center font-bold">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">How It Works & System Architecture</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Technical pipeline of the AthleteMind AI biomechanical computer vision platform.
          </p>
        </div>
      </div>

      {/* WORKFLOW PIPELINE FLOWCHART */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <Activity className="w-5 h-5" />
          <h2 className="text-lg font-extrabold text-gray-900">1. Processing Workflow Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-brand-bgLight border border-gray-200 relative hover:border-brand-cyan/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-extrabold font-mono text-brand-cyanDark bg-brand-cyan/20 px-2 py-0.5 rounded">
                    STEP 0{idx + 1}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-gray-300 font-bold hidden lg:inline">→</span>
                  )}
                </div>
                <h3 className="font-extrabold text-xs text-gray-900 mb-1">{step.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE DIAGRAM */}
      <div className="bg-brand-deepGreen text-white p-8 rounded-3xl border border-brand-cyan/30 shadow-2xl space-y-6">
        <div className="flex items-center space-x-2">
          <Layers className="w-6 h-6 text-brand-cyan" />
          <h2 className="text-xl font-extrabold tracking-tight">2. Technical System Architecture</h2>
        </div>

        <div className="p-6 rounded-2xl bg-brand-deepGreenDark/90 border border-brand-cyan/20 space-y-4 font-mono text-xs text-brand-cyan">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">WEBCAM VIDEO FEED</p>
              <p className="text-[10px] text-gray-400">MediaDevices API</p>
            </div>
            <ArrowDown className="w-5 h-5 sm:-rotate-90 text-brand-cyan" />

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">MEDIAPIPE POSE</p>
              <p className="text-[10px] text-gray-400">WASM Landmarker Model</p>
            </div>
            <ArrowDown className="w-5 h-5 sm:-rotate-90 text-brand-cyan" />

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">33 KEYPOINTS</p>
              <p className="text-[10px] text-gray-400">Normalized 3D Vectors</p>
            </div>
            <ArrowDown className="w-5 h-5 sm:-rotate-90 text-brand-cyan" />

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">TRIGONOMETRIC ENGINE</p>
              <p className="text-[10px] text-gray-400">atan2 Vector Calculations</p>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <ArrowDown className="w-5 h-5 text-brand-cyan animate-bounce" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">RULE ENGINE</p>
              <p className="text-[10px] text-gray-400">Posture Rules</p>
            </div>
            <ArrowDown className="w-5 h-5 sm:-rotate-90 text-brand-cyan" />

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">REAL-TIME FEEDBACK</p>
              <p className="text-[10px] text-gray-400">SpeechSynthesis Voice</p>
            </div>
            <ArrowDown className="w-5 h-5 sm:-rotate-90 text-brand-cyan" />

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <p className="text-white font-bold">DASHBOARD UI</p>
              <p className="text-[10px] text-gray-400">React + Tailwind + Canvas</p>
            </div>
          </div>
        </div>
      </div>

      {/* MEDICAL DISCLAIMER CARD */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-900 flex items-start space-x-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-950 mb-1">Medical Disclaimer</h4>
          <p className="leading-relaxed">
            This application provides wellness and biomechanical insights only and is not a medical diagnosis. AthleteMind AI is designed strictly for movement awareness, physical exercise tracking, and wellness habit formation. Always consult a qualified healthcare or physical therapy professional for medical advice.
          </p>
        </div>
      </div>

    </div>
  );
};
