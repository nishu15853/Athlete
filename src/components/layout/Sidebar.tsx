import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Camera,
  Dumbbell,
  History,
  Cpu,
  LogOut,
  Activity,
  ChevronRight,
  User,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Live Analysis',
      path: '/dashboard',
      icon: Camera,
      end: true,
    },
    {
      id: 'exercise',
      label: 'Exercise Reps',
      path: '/dashboard/exercise',
      icon: Dumbbell,
    },
  ];

  const secondaryNavItems = [
    {
      id: 'history',
      label: 'Session History',
      path: '/dashboard/history',
      icon: History,
    },
    {
      id: 'about',
      label: 'Architecture & Math',
      path: '/dashboard/about',
      icon: Cpu,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('athletemind_session');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="relative w-56 lg:w-60 shrink-0 h-full bg-gradient-to-b from-[#1B3830]/95 via-[#142C25]/95 to-[#0D1D19]/95 backdrop-blur-xl text-white p-3 rounded-none border-r border-brand-cyan/30 flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none">
      
      {/* Decorative ambient glowing orb */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Section: Brand Logo, System Pulse & Navigation */}
      <div className="relative space-y-3 w-full">
        {/* Brand Title & Tagline */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center space-x-2.5 px-1 py-1 cursor-pointer group select-none pb-1"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-cyan/20 border border-brand-cyan/60 flex items-center justify-center text-brand-cyan group-hover:scale-105 transition-transform shadow-glow-cyan shrink-0">
            <Activity className="w-5 h-5 animate-pulse-glow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wider text-white truncate">ATHLETEMIND</span>
              <span className="bg-brand-cyan text-brand-deepGreen font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-widest shrink-0">
                AI
              </span>
            </div>
            <p className="text-[10px] text-brand-cyan/80 font-medium tracking-tight truncate">
              Move Better. Recover Smarter.
            </p>
          </div>
        </div>

        {/* MedTech System Beacon Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/35 border border-brand-cyan/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-300">
              AI ENGINE READY
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[9px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded border border-brand-cyan/25">
            <Zap className="w-2.5 h-2.5 text-brand-cyan animate-pulse" />
            <span>60 FPS</span>
          </div>
        </div>

        {/* Navigation Group 1: Biomechanical Engine */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 px-2 text-[9px] font-mono font-black tracking-widest text-brand-cyan/70 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/60 animate-pulse" />
            <span>Biomechanical Engine</span>
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-cyan via-teal-300 to-[#72D6D4] text-[#122A24] font-extrabold shadow-[0_4px_18px_rgba(114,214,212,0.4)] scale-[1.02]'
                      : 'text-emerald-100/80 hover:text-white hover:bg-white/10 hover:translate-x-1 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#122A24] text-brand-cyan shadow-sm'
                            : 'bg-white/5 text-brand-cyan/80 border border-white/5 group-hover:border-brand-cyan/40 group-hover:bg-brand-cyan/15 group-hover:text-brand-cyan'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span className="truncate tracking-wide">{item.label}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#122A24] shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Navigation Group 2: Intelligence & Docs */}
        <div className="space-y-1 pt-1.5 border-t border-white/10">
          <div className="flex items-center space-x-1.5 px-2 text-[9px] font-mono font-black tracking-widest text-emerald-200/50 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
            <span>Platform Intel</span>
          </div>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-cyan via-teal-300 to-[#72D6D4] text-[#122A24] font-extrabold shadow-[0_4px_18px_rgba(114,214,212,0.4)] scale-[1.02]'
                      : 'text-emerald-100/80 hover:text-white hover:bg-white/10 hover:translate-x-1 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#122A24] text-brand-cyan shadow-sm'
                            : 'bg-white/5 text-brand-cyan/80 border border-white/5 group-hover:border-brand-cyan/40 group-hover:bg-brand-cyan/15 group-hover:text-brand-cyan'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span className="truncate tracking-wide">{item.label}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#122A24] shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Active Athlete Badge, System Telemetry & Sign Out */}
      <div className="relative pt-3 border-t border-white/10 space-y-2 mt-auto">
        {/* Active Athlete Profile Strip */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-brand-cyan to-emerald-400 p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-[#122A24] flex items-center justify-center text-brand-cyan text-[10px] font-black">
                <User className="w-3 h-3" />
              </div>
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-[#122A24]" />
            </div>
            <div className="min-w-0 leading-none">
              <p className="text-[10px] font-bold text-white truncate">Athlete Pro</p>
              <p className="text-[8.5px] font-mono text-brand-cyan/80 truncate">Active Session</p>
            </div>
          </div>
          <Activity className="w-3 h-3 text-brand-cyan/60 shrink-0 animate-pulse" />
        </div>

        {/* Glossy Rose Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400/60 hover:shadow-[0_0_14px_rgba(244,63,94,0.3)] transition-all duration-200 group active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
