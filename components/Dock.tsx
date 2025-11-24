
import React, { useState } from 'react';
import { AppID } from '../types';
import { Folder, Compass, Terminal, Calculator, Settings, Image, Gamepad2, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';

interface DockProps {
  openApp: (id: AppID) => void;
  isDarkMode: boolean;
}

export const Dock: React.FC<DockProps> = ({ openApp, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);

  const apps = [
    { id: AppID.FINDER, icon: Folder, label: 'Finder', color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: AppID.SAFARI, icon: Compass, label: 'Safari', color: 'text-blue-600', bg: 'bg-white' },
    { id: AppID.TERMINAL, icon: Terminal, label: 'Terminal', color: 'text-black', bg: 'bg-gray-800' },
    { id: AppID.NOTES, icon: StickyNote, label: 'Notes', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: AppID.TIC_TAC_TOE, icon: Gamepad2, label: 'Tic Tac Toe', color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: AppID.CALCULATOR, icon: Calculator, label: 'Calculator', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: AppID.PHOTOS, icon: Image, label: 'Photos', color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: AppID.SETTINGS, icon: Settings, label: 'Settings', color: 'text-gray-500', bg: 'bg-gray-200' },
  ];

  return (
    <>
      {/* Dock Container */}
      <div className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] w-auto max-w-[90vw] sm:max-w-fit
        transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}
      `}>
        <div className={`
          flex items-end overflow-x-auto no-scrollbar space-x-2 sm:space-x-4 px-4 pb-3 pt-3 rounded-2xl border
          ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-white/20'}
          backdrop-blur-xl shadow-2xl transition-all duration-300
        `}>
          {apps.map((app) => (
            <div key={app.id} className="group relative flex flex-col items-center flex-shrink-0">
              {/* Tooltip */}
              <div className={`
                absolute -top-14 px-3 py-1 rounded-lg text-xs font-medium
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 group-hover:scale-100 pointer-events-none
                ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white/90 text-gray-800 shadow-xl border border-white/50 backdrop-blur-md'}
              `}>
                {app.label}
              </div>
              
              <button
                onClick={() => openApp(app.id)}
                className={`
                  relative p-2 sm:p-3 rounded-2xl transition-all duration-300 transform sm:hover:-translate-y-4 sm:hover:scale-110
                  ${isDarkMode ? 'bg-gray-700/60 hover:bg-gray-600/80' : 'bg-white/60 hover:bg-white/90'}
                  border border-transparent hover:border-gray-300/30 shadow-lg group-active:scale-95
                `}
              >
                <app.icon 
                  className={`w-6 h-6 sm:w-10 sm:h-10 ${app.color}`} 
                  strokeWidth={1.5}
                />
              </button>
              
              {/* Active Dot (Simulated for Finder always active) */}
              <div className={`w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${app.id === AppID.FINDER ? 'bg-gray-400 opacity-100' : 'bg-gray-400 opacity-0 group-hover:opacity-50'}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Dock Toggle Button */}
      <button 
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? "Hide Dock" : "Show Dock"}
        className={`
            fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[101]
            flex items-center justify-center w-16 h-5 rounded-t-xl
            backdrop-blur-md border-t border-x cursor-pointer
            ${isDarkMode ? 'bg-gray-800/60 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white' : 'bg-white/60 border-white/40 text-gray-500 hover:bg-white/80 hover:text-black'}
            hover:h-7 transition-all duration-300
        `}
      >
         {isVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </>
  );
};
