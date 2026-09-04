import React from 'react';
import { Cpu, Info, Activity, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    { title: 'USER INPUT', desc: 'Webcam activation & user positioning in camera view frame.' },
    { title: 'CAMERA CAPTURE', desc: 'Continuous 30-60 FPS video frame extraction.' },
    { title: 'AI POSE DETECTION', desc: 'MediaPipe PoseLandmarker neural network inference on WebGL.' },
    { title: 'LANDMARK EXTRACTION', desc: '33 3D skeletal landmark coordinates (X, Y, Z, visibility).' },
    {
      title: 'BIOMECHANICAL ANALYSIS',
      desc: 'Trigonometric angle calculations (atan2) for elbows, knees, hips, and shoulders.',
    },
    {
      title: 'POSTURE CLASSIFICATION',
      desc: 'Rule-based biomechanical classification (Forward Head, Shoulder tilt, Knee valgus).',
    },
    {
      title: 'REAL-TIME FEEDBACK',
      desc: 'Visual overlay, posture scores, and Web SpeechSynthesis voice coach alerts.',
    },
    {
      title: 'SESSION ANALYTICS',
      desc: 'Recovery index calculation & localStorage session persistence.',
    },
  ];

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] max-h-[calc(100vh-theme(spacing.16))] overflow-y-auto overflow-x-hidden space-y-4 pr-1 pb-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center font-bold">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-black text-gray-900">How It Works & System Architecture</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Technical pipeline of the AthleteMind AI biomechanical computer vision platform.
          </p>
        </div>
      </div>

      {/* WORKFLOW PIPELINE FLOWCHART */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <Activity className="w-4 h-4 text-brand-cyanDark" />
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            1. Processing Workflow Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 relative hover:border-brand-cyan/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-extrabold font-mono text-brand-cyanDark bg-brand-cyan/20 px-2 py-0.5 rounded">
                    STEP 0{idx + 1}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-gray-300 font-bold hidden lg:inline text-xs">→</span>
                  )}
                </div>
                <h3 className="font-extrabold text-xs text-gray-900 mb-0.5">{step.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MATHEMATICAL FOUNDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <Cpu className="w-4 h-4 text-brand-cyanDark" />
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              2. Kinematic Angle Computation
            </h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Joint angles are derived trigonometrically using the 2D planar vector dot-product angle via atan2:
          </p>
          <div className="p-3 bg-gray-900 text-brand-cyan rounded-xl font-mono text-xs overflow-x-auto">
            θ = |atan2(Cy - By, Cx - Bx) - atan2(Ay - By, Ax - Bx)| × (180 / π)
          </div>
          <p className="text-[11px] text-gray-500">
            Where <strong>B</strong> is the joint vertex (e.g. Knee), and <strong>A</strong> & <strong>C</strong> are the connecting proximal and distal joints (e.g. Hip & Ankle). Angles are normalized to $[0^\circ, 180^\circ]$.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-brand-deepGreen">
            <Layers className="w-4 h-4 text-brand-cyanDark" />
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              3. Privacy & Compliance Guarantee
            </h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            AthleteMind operates entirely within the client runtime:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Client-Side WebGL / WASM Execution</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Video Frames Sent to Any Cloud Server</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Local Storage Encrypted & User-Controlled</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
