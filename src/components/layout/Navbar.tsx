import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActiveTab } from '../../types/biomechanics';

interface NavbarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  isTracking?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

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

      </div>
    </header>
  );
};

export default Navbar;
