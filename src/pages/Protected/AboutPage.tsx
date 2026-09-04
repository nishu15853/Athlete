import React from 'react';
import { Cpu, Info, Activity, Layers, CheckCircle2, Table, ShieldCheck, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    { title: 'USER INPUT', desc: 'Select patient condition (Post-Op / Geriatric / Wellness) & capture mode.' },
    { title: 'INGESTION', desc: 'Continuous 30-60 FPS live camera frames or uploaded therapy video clips.' },
    { title: 'AI POSE EXTRACTION', desc: 'MediaPipe PoseLandmarker neural network inference via WebGL / WASM.' },
    { title: 'LANDMARK MAPPING', desc: 'Extraction of 33 3D skeletal landmark coordinates with visibility scores.' },
    {
      title: 'KINEMATIC COMPUTATION',
      desc: 'Hardened arctan2 radial vector subtraction with branch-cut wrap normalization.',
    },
    {
      title: 'JOINT STRESS CLASSIFICATION',
      desc: 'Real-time joint shear load & valgus strain heat mapping against clinical bounds.',
    },
    {
      title: 'FEEDBACK LOOP',
      desc: 'Instant visual HUD tags, posture scoring, and Web Speech voice coach alerts.',
    },
    {
      title: 'CLINICAL TELE-MONITORING',
      desc: 'Digital session audits, mobility trends, and 1-click printable doctor reports.',
    },
  ];

  const landmarkMappings = [
    {
      joint: 'Left Knee',
      proximal: 'Left Hip (23)',
      vertex: 'Left Knee (25)',
      distal: 'Left Ankle (27)',
      clinicalRange: '135° – 180° (Standing / Extension), <90° (Flexion)',
    },
    {
      joint: 'Right Knee',
      proximal: 'Right Hip (24)',
      vertex: 'Right Knee (26)',
      distal: 'Right Ankle (28)',
      clinicalRange: '135° – 180° (Standing / Extension), <90° (Flexion)',
    },
    {
      joint: 'Left Elbow',
      proximal: 'Left Shoulder (11)',
      vertex: 'Left Elbow (13)',
      distal: 'Left Wrist (15)',
      clinicalRange: '160° – 180° (Full Extension), <50° (Deep Flexion)',
    },
    {
      joint: 'Right Elbow',
      proximal: 'Right Shoulder (12)',
      vertex: 'Right Elbow (14)',
      distal: 'Right Wrist (16)',
      clinicalRange: '160° – 180° (Full Extension), <50° (Deep Flexion)',
    },
    {
      joint: 'Left Hip',
      proximal: 'Left Shoulder (11)',
      vertex: 'Left Hip (23)',
      distal: 'Left Knee (25)',
      clinicalRange: '160° – 180° (Upright Torso), <100° (Squat / Fold)',
    },
    {
      joint: 'Right Hip',
      proximal: 'Right Shoulder (12)',
      vertex: 'Right Hip (24)',
      distal: 'Right Knee (26)',
      clinicalRange: '160° – 180° (Upright Torso), <100° (Squat / Fold)',
    },
  ];

  return (
    <div className="h-full max-h-full overflow-y-auto overflow-x-hidden space-y-4 pr-1 pb-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center font-bold">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-black text-gray-900">How It Works & Biomechanical Engine</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Technical pipeline, hardened kinematic trigonometry, and landmark mapping specifications.
          </p>
        </div>
      </div>

      {/* WORKFLOW PIPELINE FLOWCHART */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <Activity className="w-4 h-4 text-brand-cyanDark" />
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            1. 5-Stage Processing Pipeline (PPT Slide 4)
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
                    STAGE 0{idx + 1}
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

      {/* HARDENED KINEMATIC ANGLE COMPUTATION ENGINE */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <Cpu className="w-4 h-4 text-brand-cyanDark" />
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            2. Hardened Kinematic Angle Computation Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="space-y-2.5">
            <p className="leading-relaxed">
              Joint angles are derived trigonometrically using the 2D planar vector difference via <code className="text-brand-deepGreen font-bold bg-brand-cyan/20 px-1 py-0.5 rounded font-mono">atan2</code> with radial wrap normalization:
            </p>

            <div className="p-3.5 bg-gray-900 text-brand-cyan rounded-xl font-mono text-xs space-y-1.5 overflow-x-auto shadow-inner">
              <div className="text-gray-400">// 1. Raw radial difference between bone vectors:</div>
              <div>Δθ = |atan2(Cy - By, Cx - Bx) - atan2(Ay - By, Ax - Bx)|</div>
              <div className="text-gray-400">// 2. Radial boundary cut normalization across (-π ↔ +π):</div>
              <div>if (Δθ &gt; π) Δθ = 2π - Δθ</div>
              <div className="text-gray-400">// 3. Degree conversion & confidence gating:</div>
              <div>θ_deg = Δθ × (180 / π)  [normalized to 0° – 180°]</div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              Where <strong className="text-gray-800">B</strong> is the joint vertex (e.g., Knee), <strong className="text-gray-800">A</strong> is the proximal joint (Hip), and <strong className="text-gray-800">C</strong> is the distal joint (Ankle).
            </p>
          </div>

          {/* RATIONALE: ATAN2 VS ARCCOS */}
          <div className="p-4 rounded-2xl bg-brand-bgLight border border-brand-cyan/30 space-y-2.5">
            <h3 className="font-extrabold text-brand-deepGreen text-xs flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-cyanDark" />
              <span>Why atan2 Vector Subtraction is Used over Vector Dot Product (arccos)</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] text-gray-700">
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Eliminates Division by Zero:</strong> Dot-product arccos requires dividing by vector magnitudes <code className="font-mono text-[10px] bg-white px-1">‖u‖·‖v‖</code>, crashing if limbs contract or keypoints coincide.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Prevents Rounding Overflow NaN:</strong> Floating-point dot products frequently produce <code className="font-mono text-[10px] bg-white px-1">1.0000000001</code>, causing <code className="font-mono text-[10px] bg-white px-1">arccos()</code> to return <strong className="text-rose-600">NaN</strong>.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Square Root Overhead:</strong> Does not require Euclidean norm calculations (<code className="font-mono text-[10px] bg-white px-1">Math.sqrt</code>), delivering ultra-low latency at 60 FPS.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Visibility Gating:</strong> Enforces <code className="font-mono text-[10px] bg-white px-1">minConfidence = 0.5</code> to suppress baseline spikes when body parts exit the camera frame.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ANATOMICAL LANDMARK MAPPING TABLE */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <Table className="w-4 h-4 text-brand-cyanDark" />
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            3. Complete Landmark Index Mapping Table
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase">
                <th className="py-2.5 px-3">Joint Segment</th>
                <th className="py-2.5 px-3">Proximal Landmark (A)</th>
                <th className="py-2.5 px-3">Joint Vertex (B)</th>
                <th className="py-2.5 px-3">Distal Landmark (C)</th>
                <th className="py-2.5 px-3">Clinical Normal & Rehab Bounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {landmarkMappings.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-gray-900">{row.joint}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-brand-deepGreen">{row.proximal}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-brand-cyanDark font-extrabold">{row.vertex}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">{row.distal}</td>
                  <td className="py-2.5 px-3 text-[11px] text-gray-500">{row.clinicalRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRIVACY & COMPLIANCE GUARANTEE */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-brand-deepGreen">
          <ShieldCheck className="w-4 h-4 text-brand-cyanDark" />
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            4. Privacy, HIPAA/GDPR Compliance & Multi-Language Reference
          </h2>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          AthleteMind AI executes 100% on-device within the browser sandbox. Verified reference implementations of the kinematic engine are provided in <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-brand-deepGreen">src/utils/math/kinematics.ts</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-brand-deepGreen">kinematics.py</code> (NumPy), and <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-brand-deepGreen">kinematics.go</code> (Go).
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
