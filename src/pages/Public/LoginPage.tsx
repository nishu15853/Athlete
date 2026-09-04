import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, Lock, Mail, ArrowRight, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

const SESSION_KEY = 'athletemind_session';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('demo.athlete@mind.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem(SESSION_KEY)) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email, timestamp: Date.now() }));
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }, 350);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: 'demo.athlete@mind.ai', isDemo: true, timestamp: Date.now() }));
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-deepGreen via-brand-deepGreenDark to-[#0d1e1a] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#72D6D4_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-cyan/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glow-cyan">
            <Activity className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-wider text-white">ATHLETEMIND</span>
              <span className="bg-brand-cyan text-brand-deepGreen font-black text-xs px-2 py-0.5 rounded-full uppercase tracking-widest">
                AI
              </span>
            </div>
            <p className="text-[11px] text-brand-cyan/80 font-medium">Biomechanical Intelligence Platform</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-brand-cyan/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-brand-cyan/20">
          <ShieldCheck className="w-4 h-4 text-brand-cyan" />
          <span>HIPAA-Ready Client-Side WASM</span>
        </div>
      </header>

      {/* Center Auth Card & Feature Highlights */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        {/* Left: MedTech Pitch */}
        <div className="lg:col-span-7 space-y-6 text-white text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-brand-cyan/15 text-brand-cyan px-3.5 py-1.5 rounded-full border border-brand-cyan/30 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>Real-Time Pose Kinematics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Next-Gen Athletic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-emerald-400">
              Movement Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
            Instant camera-based musculoskeletal evaluation running entirely client-side in your browser. Track joint angles, count reps, and optimize recovery without wearables.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 text-left">
              <Cpu className="w-5 h-5 text-brand-cyan mb-2" />
              <div className="font-bold text-sm text-white">33 3D Landmarks</div>
              <div className="text-[11px] text-gray-400">WASM / WebGL pose stream</div>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 text-left">
              <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-sm text-white">atan2 Kinematics</div>
              <div className="text-[11px] text-gray-400">Sub-degree joint calculation</div>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 text-left">
              <ShieldCheck className="w-5 h-5 text-brand-cyan mb-2" />
              <div className="font-bold text-sm text-white">100% Private</div>
              <div className="text-[11px] text-gray-400">Zero cloud video transmission</div>
            </div>
          </div>
        </div>

        {/* Right: Mock Login Form Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-gray-800 relative">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-brand-deepGreen">Sign In</h2>
              <p className="text-xs text-gray-500 mt-1">
                Access the real-time biomechanics dashboard & analysis tools
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@mind.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-brand-deepGreen hover:bg-brand-deepGreenDark text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-75"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-semibold">Or Instant Access</span>
              </div>
            </div>

            {/* Instant Demo Sign-In Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-cyan to-emerald-400 hover:from-brand-cyanDark hover:to-emerald-500 text-brand-deepGreen font-extrabold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center space-x-2 text-sm group"
            >
              <Sparkles className="w-4 h-4 text-brand-deepGreen group-hover:rotate-12 transition-transform" />
              <span>Instant Demo Sign-In</span>
            </button>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center space-x-2 text-[11px] text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>No credit card or external backend required</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 text-xs text-gray-400">
        AthleteMind AI &copy; {new Date().getFullYear()} &bull; Client-Side Biomechanical Neural Engine
      </footer>
    </div>
  );
};

export default LoginPage;
