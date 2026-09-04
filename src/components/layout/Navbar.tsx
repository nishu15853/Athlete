import React from 'react';
import { Activity, Shield, Sparkles, LogOut, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActiveTab } from '../../types/biomechanics';

interface NavbarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  isTracking?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isTracking = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('athletemind_session');
    navigate('/login', { replace: true });
  };

  const handleLogoClick = () => {
    if (setActiveTab) {
      setActiveTab('dashboard');
    }
    navigate('/dashboard');
  };

  return (
    <header className="bg-brand-deepGreen text-white shadow-md border-b border-brand-deepGreenDark sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Title & Tagline */}
        <div 
          onClick={handleLogoClick} 
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

        {/* Quick Actions & Logout */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('dashboard');
              navigate('/dashboard');
            }}
            className="hidden sm:flex bg-brand-cyan hover:bg-brand-cyanDark text-brand-deepGreen font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-glow-cyan items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Analysis</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1 text-xs text-emerald-200/80 bg-white/5 px-2.5 py-1.5 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-brand-cyan" />
            <span>WASM v2.4</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1.5 rounded-lg">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Active Session</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign out of AthleteMind"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
