import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Camera, ChevronRight, ShieldCheck, Cpu, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../../types/biomechanics';

interface LandingPageProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const navigate = useNavigate();

  const handleNav = (tab: ActiveTab, path: string) => {
    if (setActiveTab) setActiveTab(tab);
    navigate(path);
  };
  return (
    <div className="space-y-12 pb-12">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deepGreen via-brand-deepGreenDark to-[#122622] text-white p-8 md:p-12 shadow-2xl border border-brand-cyan/20">
        {/* Background Subtle Biomechanical Lines Visual */}
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
                onClick={() => handleNav('dashboard', '/dashboard')}
                className="bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-extrabold px-7 py-3.5 rounded-xl shadow-glow-cyan text-base flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Camera className="w-5 h-5" />
                <span>Start Analysis</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNav('about', '/dashboard/about')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 text-base flex items-center space-x-2 transition-all"
              >
                <Cpu className="w-5 h-5 text-brand-cyan" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Quick Benefits Pills */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-300 border-t border-white/10">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                <span>Zero Backend Required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                <span>33 Body Landmark Tracking</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                <span>Real-Time Angle Calculations</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Simulated AI Human Skeleton Visual & Scanning Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm bg-brand-deepGreenDark/80 rounded-2xl p-4 border border-brand-cyan/40 shadow-glow-green overflow-hidden">
              
              {/* Scanline animation */}
              <div className="animate-scanline" />

              {/* Top Banner Status inside visual */}
              <div className="flex justify-between items-center text-xs mb-3 pb-2 border-b border-brand-cyan/20 text-brand-cyan font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                  <span>BIOMECH_SCANNER_V2</span>
                </span>
                <span>30 FPS</span>
              </div>

              {/* Simulated Skeleton Canvas Visual */}
              <div className="relative h-64 bg-black/40 rounded-xl flex items-center justify-center border border-brand-cyan/10 overflow-hidden">
                <svg viewBox="0 0 200 300" className="w-full h-full p-2 stroke-brand-cyan fill-none stroke-[2.5] stroke-round">
                  {/* Head */}
                  <circle cx="100" cy="50" r="18" className="stroke-brand-cyan fill-brand-cyan/20 animate-pulse" />
                  {/* Shoulders */}
                  <line x1="60" y1="85" x2="140" y2="85" className="stroke-brand-cyan" />
                  {/* Arms */}
                  <line x1="60" y1="85" x2="45" y2="135" />
                  <line x1="45" y1="135" x2="35" y2="175" />
                  <line x1="140" y1="85" x2="155" y2="135" />
                  <line x1="155" y1="135" x2="165" y2="175" />
                  {/* Spine */}
                  <line x1="100" y1="85" x2="100" y2="160" className="stroke-white" />
                  {/* Hips */}
                  <line x1="75" y1="160" x2="125" y2="160" className="stroke-brand-cyan" />
                  {/* Legs */}
                  <line x1="75" y1="160" x2="70" y2="220" />
                  <line x1="70" y1="220" x2="68" y2="275" />
                  <line x1="125" y1="160" x2="130" y2="220" />
                  <line x1="130" y1="220" x2="132" y2="275" />

                  {/* Joint Nodes */}
                  <circle cx="60" cy="85" r="4" className="fill-brand-cyan stroke-white" />
                  <circle cx="140" cy="85" r="4" className="fill-brand-cyan stroke-white" />
                  <circle cx="45" cy="135" r="4" className="fill-brand-maroon stroke-white" />
                  <circle cx="155" cy="135" r="4" className="fill-brand-maroon stroke-white" />
                  <circle cx="75" cy="160" r="4" className="fill-brand-cyan stroke-white" />
                  <circle cx="125" cy="160" r="4" className="fill-brand-cyan stroke-white" />
                  <circle cx="70" cy="220" r="4" className="fill-emerald-400 stroke-white" />
                  <circle cx="130" cy="220" r="4" className="fill-emerald-400 stroke-white" />
                </svg>

                {/* Floating Metric Badges */}
                <div className="absolute top-3 left-3 bg-brand-deepGreen/90 text-brand-cyan text-[10px] font-mono px-2 py-1 rounded border border-brand-cyan/40">
                  L_ELBOW: 165°
                </div>
                <div className="absolute top-3 right-3 bg-brand-deepGreen/90 text-brand-cyan text-[10px] font-mono px-2 py-1 rounded border border-brand-cyan/40">
                  R_KNEE: 170°
                </div>
                <div className="absolute bottom-3 left-3 bg-brand-deepGreen/90 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-400/40">
                  POSTURE: 92% (GOOD)
                </div>
              </div>

              {/* Scanner Stats Footer */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-[10px]">Symmetry Index</p>
                  <p className="text-brand-cyan font-bold">96.4%</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-[10px]">Spine Angle</p>
                  <p className="text-emerald-400 font-bold">178.2°</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CORE FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-deepGreen/10 text-brand-deepGreen flex items-center justify-center mb-4">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Webcam Pose Detection</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Uses MediaPipe Pose AI to identify 33 body keypoints in real time directly inside your browser with high precision.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Biomechanical Angle Analytics</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Calculates real-time vector angles for elbows, knees, hips, and shoulders to flag posture imbalances and joint strains.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 text-brand-deepGreen flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Rehabilitation & Recovery</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tracks exercise repetitions (squats, arm raises), provides real-time voice feedback, and saves recovery trends in local history.
          </p>
        </div>
      </div>

      {/* USE CASES / TARGET AREAS */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Designed for Sports Technology & Physical Rehabilitation
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-brand-bgLight border border-gray-200 text-center">
            <span className="text-2xl mb-1 block">🧘‍♂️</span>
            <h4 className="font-bold text-gray-800 text-sm">Posture Correction</h4>
            <p className="text-xs text-gray-500 mt-1">Desk posture & forward head alerts</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-bgLight border border-gray-200 text-center">
            <span className="text-2xl mb-1 block">🏋️‍♂️</span>
            <h4 className="font-bold text-gray-800 text-sm">Exercise Rep Counter</h4>
            <p className="text-xs text-gray-500 mt-1">Squat & movement depth tracking</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-bgLight border border-gray-200 text-center">
            <span className="text-2xl mb-1 block">🏥</span>
            <h4 className="font-bold text-gray-800 text-sm">Injury Prevention</h4>
            <p className="text-xs text-gray-500 mt-1">Asymmetry & knee valgus warnings</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-bgLight border border-gray-200 text-center">
            <span className="text-2xl mb-1 block">📊</span>
            <h4 className="font-bold text-gray-800 text-sm">Session Analytics</h4>
            <p className="text-xs text-gray-500 mt-1">Mobility index & recovery score</p>
          </div>
        </div>
      </div>
    </div>
  );
};
