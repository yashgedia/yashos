import React from 'react';
import { ThemeContextType } from '../../types';
import { WALLPAPERS } from '../../constants';
import { Moon, Sun, Monitor } from 'lucide-react';

interface SettingsProps {
  theme: ThemeContextType;
}

export const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const isDark = theme.isDarkMode;

  return (
    <div className={`h-full w-full p-6 overflow-y-auto ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#f5f5f7] text-black'}`}>
      
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>

      <div className="grid gap-6 max-w-2xl">
        
        {/* Appearance */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
           <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Appearance</h3>
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 {isDark ? <Moon size={20}/> : <Sun size={20}/>}
                 <span>Dark Mode</span>
              </div>
              <button 
                onClick={theme.toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-6' : ''}`} />
              </button>
           </div>
        </div>

        {/* Wallpaper */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Wallpaper</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {WALLPAPERS.map((wp, idx) => (
                    <button 
                        key={idx}
                        onClick={() => theme.setWallpaper(wp)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 hover:opacity-80 transition-all ${theme.wallpaper === wp ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'}`}
                    >
                        <img src={wp} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>

        {/* About System */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                   <Monitor size={24} className="text-gray-600" />
                </div>
                <div>
                    <h4 className="font-bold">YashOS Pro</h4>
                    <p className="text-sm text-gray-500">Version 1.0.0 (Web)</p>
                    <p className="text-xs text-gray-400 mt-1">Built with React & Tailwind</p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};
