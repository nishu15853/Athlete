import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Camera,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Zap,
  BarChart3,
  CheckCircle2,
  LogIn,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bgLight text-gray-800 flex flex-col selection:bg-brand-cyan selection:text-brand-deepGreen">
      {/* Top Public Header Navigation */}
      <header className="bg-brand-deepGreen text-white shadow-md border-b border-brand-deepGreenDark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-brand-cyan group-hover:scale-105 transition-transform shadow-glow-cyan">
              <Activity className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-white">ATHLETEMIND</span>
                <span className="bg-brand-cyan text-brand-deepGreen font-black text-xs px-2 py-0.5 rounded-full uppercase tracking-widest">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-brand-cyan/80 font-medium tracking-tight">
                Move Better. Recover Smarter.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-glow-cyan flex items-center space-x-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 flex-1">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deepGreen via-brand-deepGreenDark to-[#122622] text-white p-8 md:p-12 shadow-2xl border border-brand-cyan/20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#72D6D4_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-cyan/15 text-brand-cyan px-3.5 py-1.5 rounded-full border border-brand-cyan/30 text-xs font-semibold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5 animate-bounce" />
                <span>Browser-Based Computer Vision AI</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                ATHLETEMIND <span className="text-brand-cyan">AI</span>
              </h1>

              <p className="text-xl md:text-2xl font-medium text-brand-cyan/90">
                AI-Driven Biomechanical Wellness & Rehabilitation
              </p>

              <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl">
                Transforming a standard camera into an intelligent movement analysis system for posture awareness, recovery tracking, and accessible biomechanical insights.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-extrabold px-7 py-3.5 rounded-xl shadow-glow-cyan text-base flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Camera className="w-5 h-5" />
                  <span>Start Live Analysis</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 text-base flex items-center space-x-2 transition-all"
                >
                  <Sparkles className="w-5 h-5 text-brand-cyan" />
                  <span>Instant Demo Access</span>
                </button>
              </div>

              {/* Quick Benefits Pills */}
              <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-300 border-t border-white/10">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>No Special Hardware Needed</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Zero Video Leaves Browser</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Sub-Degree atan2 Kinematics</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/15 text-xs text-brand-cyan font-bold tracking-wider uppercase">
                  <span>Skeletal Extraction</span>
                  <span className="bg-brand-cyan/20 px-2 py-0.5 rounded text-white text-[10px]">WASM / WebGL</span>
                </div>
                <div className="relative h-48 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deepGreen/80 to-transparent" />
                  <div className="text-center space-y-2 z-10">
                    <span className="text-5xl font-black text-brand-cyan block">33</span>
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-widest block">
                      3D Kinematic Landmarks
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-brand-cyan font-black text-base block">60 FPS</span>
                    <span className="text-gray-300 text-[10px]">Inference Rate</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-brand-cyan font-black text-base block">100%</span>
                    <span className="text-gray-300 text-[10px]">Private & Local</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THREE CORE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">1. Instant Camera Tracking</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Standard webcam video processed entirely in your browser. Extracts 33 3D skeletal points with sub-second initialization.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 text-brand-deepGreen flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">2. Biomechanical Scoring</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Clinical rules calculate posture status, detecting forward head posture, shoulder height differentials, and pelvic tilts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">3. Absolute Privacy</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Zero video or image data is ever transmitted over the network. All computer vision models run locally on your device.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        AthleteMind AI &copy; {new Date().getFullYear()} &bull; Client-Side Biomechanical Neural Engine &bull; Non-Diagnostic Informational Tool
      </footer>
    </div>
  );
};

export default LandingPage;
