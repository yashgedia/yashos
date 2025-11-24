
import React, { useState, useEffect } from 'react';
import { WindowState, AppID, ThemeContextType } from './types';
import { WALLPAPERS } from './constants';
import { TopBar } from './components/TopBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { Finder } from './components/apps/Finder';
import { Terminal } from './components/apps/Terminal';
import { Calculator } from './components/apps/Calculator';
import { Settings } from './components/apps/Settings';
import { Photos } from './components/apps/Photos';
import { Safari } from './components/apps/Safari';
import { TicTacToe } from './components/apps/TicTacToe';
import { Notes } from './components/apps/Notes';
import { DataProvider } from './contexts/DataContext';
import { Apple } from 'lucide-react';

const AppContent = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Configs
  const DEFAULT_SIZE = { width: 900, height: 650 };
  const MOBILE_BREAKPOINT = 768;

  // Boot Sequence
  useEffect(() => {
    const timer = setInterval(() => {
        setLoadingProgress(prev => {
            if (prev >= 100) {
                clearInterval(timer);
                setTimeout(() => setIsLoading(false), 500);
                return 100;
            }
            return prev + Math.random() * 15;
        });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // Initial Load - Open Finder once loaded
  useEffect(() => {
    if (!isLoading) {
        // Short delay to allow OS fade in
        setTimeout(() => openApp(AppID.FINDER), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const openApp = (id: AppID, data?: any) => {
    const existingWindow = windows.find(w => w.id === id);
    
    // If opening Safari with a new URL, update the existing window
    if (existingWindow) {
      if (id === AppID.SAFARI && data?.initialUrl) {
         setWindows(prev => prev.map(w => w.id === id ? { ...w, data, isMinimized: false, zIndex: nextZIndex } : w));
      } else if (existingWindow.isMinimized) {
         setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
      } else {
         focusWindow(id);
         return; 
      }
      setActiveWindowId(id);
      setNextZIndex(prev => prev + 1);
      return;
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    
    // Custom sizes for specific apps
    let appSize = DEFAULT_SIZE;
    if (id === AppID.CALCULATOR) appSize = { width: 320, height: 480 };
    if (id === AppID.TIC_TAC_TOE) appSize = { width: 400, height: 500 };
    if (id === AppID.NOTES) appSize = { width: 400, height: 500 };

    const centerPos = isMobile 
        ? { x: 0, y: 0 } 
        : { x: Math.max(50, (window.innerWidth - appSize.width) / 2 + (windows.length * 20)), 
            y: Math.max(50, (window.innerHeight - appSize.height) / 2 + (windows.length * 20)) };

    const newWindow: WindowState = {
      id,
      title: getAppTitle(id),
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile && id !== AppID.CALCULATOR && id !== AppID.TIC_TAC_TOE, 
      zIndex: nextZIndex,
      position: centerPos,
      size: appSize,
      data: data
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const resizeWindow = (id: string, size: { width: number, height: number }, position: { x: number, y: number }) => {
     setWindows(prev => prev.map(w => w.id === id ? { ...w, size, position } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(id);
  };

  const getAppTitle = (id: AppID) => {
    switch (id) {
      case AppID.FINDER: return `Finder`;
      case AppID.TERMINAL: return 'Terminal';
      case AppID.CALCULATOR: return 'Calculator';
      case AppID.SETTINGS: return 'System Settings';
      case AppID.PHOTOS: return 'Photos';
      case AppID.SAFARI: return 'Safari';
      case AppID.TIC_TAC_TOE: return 'Tic Tac Toe';
      case AppID.NOTES: return 'Notes';
      default: return 'App';
    }
  };

  const renderAppContent = (windowState: WindowState) => {
    switch (windowState.id) {
      case AppID.FINDER: return <Finder isDarkMode={isDarkMode} openApp={openApp} />;
      case AppID.TERMINAL: return <Terminal />;
      case AppID.CALCULATOR: return <Calculator />;
      case AppID.SETTINGS: return <Settings theme={themeContext} />;
      case AppID.PHOTOS: return <Photos />;
      case AppID.SAFARI: return <Safari isDarkMode={isDarkMode} initialUrl={windowState.data?.initialUrl} />;
      case AppID.TIC_TAC_TOE: return <TicTacToe />;
      case AppID.NOTES: return <Notes />;
      default: return <div className="p-4">App Content Not Found</div>;
    }
  };

  const themeContext: ThemeContextType = {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(!isDarkMode),
    wallpaper,
    setWallpaper
  };

  if (isLoading) {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
            <Apple size={80} className="text-white mb-16" fill="white" />
            <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                />
            </div>
        </div>
    );
  }

  return (
    <div 
        className="relative w-full h-screen overflow-hidden bg-cover bg-center transition-all duration-1000 animate-fade-in font-sans"
        style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Desktop Overlay for Dark Mode tint */}
      {isDarkMode && <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-500" />}

      <TopBar activeAppTitle={activeWindowId ? getAppTitle(activeWindowId as AppID) : 'Finder'} isDarkMode={isDarkMode} />

      {/* Windows Area */}
      <div className="relative w-full h-full pt-8 pb-24 z-0">
        {windows.map(window => (
          <Window
            key={window.id}
            window={window}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onResize={resizeWindow}
            isDarkMode={isDarkMode}
          >
            {renderAppContent(window)}
          </Window>
        ))}
      </div>

      <Dock openApp={openApp} isDarkMode={isDarkMode} />
    </div>
  );
};

const App = () => (
    <DataProvider>
        <AppContent />
    </DataProvider>
);

export default App;
