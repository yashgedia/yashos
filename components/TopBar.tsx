import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Search, Command } from 'lucide-react';

interface TopBarProps {
  activeAppTitle: string;
  isDarkMode: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ activeAppTitle, isDarkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const bgClass = isDarkMode ? 'bg-gray-900/50 text-white' : 'bg-white/50 text-black';

  return (
    <div className={`fixed top-0 left-0 w-full h-7 ${bgClass} backdrop-blur-md flex justify-between items-center px-4 text-xs font-medium select-none z-50`}>
      <div className="flex items-center space-x-4">
        <Command size={14} />
        <span className="font-bold">{activeAppTitle || 'Finder'}</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">File</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">Edit</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">View</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">Go</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">Window</span>
        <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded">Help</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-1">
            <Battery size={16} className="text-green-500" fill="currentColor" />
            <span>100%</span>
        </div>
        <Wifi size={14} />
        <Search size={14} />
        <span>{formatDate(time)}</span>
        <span>{formatTime(time)}</span>
      </div>
    </div>
  );
};
