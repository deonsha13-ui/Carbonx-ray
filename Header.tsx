import React from 'react';
import { Leaf, Home } from 'lucide-react';
import { PortalType } from '../types';

interface HeaderProps {
  activeTab: PortalType;
  onTabChange: (tab: PortalType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onTabChange(PortalType.INDIVIDUAL)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group"
            aria-label="Home"
          >
            <Home className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${activeTab === PortalType.INDIVIDUAL ? 'from-cyan-400 to-blue-600' : 'from-green-400 to-emerald-600'}`}>
              <Leaf className="w-6 h-6 text-black" />
            </div>
            <span className={`text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${activeTab === PortalType.INDIVIDUAL ? 'from-cyan-400 to-green-400' : 'from-green-400 to-cyan-400'}`}>
              Carbon-Xray
            </span>
          </div>
        </div>

        <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center">
          <button
            onClick={() => onTabChange(PortalType.INDIVIDUAL)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === PortalType.INDIVIDUAL
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            INDIVIDUALS
          </button>
          <button
            onClick={() => onTabChange(PortalType.ENTERPRISE)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === PortalType.ENTERPRISE
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ENTERPRISES
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;