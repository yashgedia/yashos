
import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onResize: (id: string, size: { width: number; height: number }, position: { x: number; y: number }) => void;
  isDarkMode: boolean;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onResize,
  isDarkMode,
  children,
}) => {
  // Moving State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState(window.position);
  
  // Resizing State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const [currentSize, setCurrentSize] = useState(window.size);
  const [initialResize, setInitialResize] = useState({ width: 0, height: 0, x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const windowRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof document !== 'undefined' && document.body.clientWidth < 768;

  // Sync props to state
  useEffect(() => {
    if (!isDragging) setCurrentPos(window.position);
    if (!isResizing) setCurrentSize(window.size);
  }, [window.position, window.size, isDragging, isResizing]);

  // --- DRAG (MOVE) LOGIC ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized || isMobile) return;
    onFocus(window.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y,
    });
  };

  // --- RESIZE LOGIC ---
  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation(); // Prevent triggering drag
    e.preventDefault();
    if (window.isMaximized || isMobile) return;
    
    onFocus(window.id);
    setIsResizing(true);
    setResizeDir(dir);
    setInitialResize({
      width: currentSize.width,
      height: currentSize.height,
      x: currentPos.x,
      y: currentPos.y,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  // --- GLOBAL MOUSE MOVE ---
  const handleMouseMove = (e: MouseEvent) => {
    // Handling Move
    if (isDragging && !window.isMaximized && !isMobile) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setCurrentPos({ x: newX, y: newY });
    }

    // Handling Resize
    if (isResizing && !window.isMaximized && !isMobile && resizeDir) {
        const deltaX = e.clientX - initialResize.mouseX;
        const deltaY = e.clientY - initialResize.mouseY;

        let newWidth = initialResize.width;
        let newHeight = initialResize.height;
        let newX = initialResize.x;
        let newY = initialResize.y;

        // Min dimensions
        const MIN_W = 300;
        const MIN_H = 200;

        if (resizeDir.includes('e')) {
            newWidth = Math.max(MIN_W, initialResize.width + deltaX);
        }
        if (resizeDir.includes('s')) {
            newHeight = Math.max(MIN_H, initialResize.height + deltaY);
        }
        if (resizeDir.includes('w')) {
            const proposedWidth = initialResize.width - deltaX;
            if (proposedWidth >= MIN_W) {
                newWidth = proposedWidth;
                newX = initialResize.x + deltaX;
            }
        }
        // Note: North resizing affects Y position, omitted for simplicity to match standard web OS behavior
        // allowing safer interaction with top bar.

        setCurrentSize({ width: newWidth, height: newHeight });
        // Only update position if we resized from the left
        if (resizeDir.includes('w')) {
            setCurrentPos({ x: newX, y: newY });
        }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Persist position to parent
      onResize(window.id, currentSize, currentPos); 
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeDir(null);
      // Persist size and position to parent
      onResize(window.id, currentSize, currentPos);
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Add a transparent overlay to iframe apps (Safari) to prevent mouse capturing issues
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(el => el.style.pointerEvents = 'none');
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(el => el.style.pointerEvents = 'auto');
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isResizing]);

  if (window.isMinimized) return null;

  // Glassmorphic styles
  const baseClasses = `absolute flex flex-col rounded-xl overflow-hidden shadow-2xl transition-all ease-out border`;
  // Disable transition during drag/resize for performance
  const transitionClass = (isDragging || isResizing) ? 'duration-0' : 'duration-200';
  
  const themeClasses = isDarkMode 
    ? "bg-[#1e1e1e]/90 backdrop-blur-xl border-gray-600/30 text-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
    : "bg-white/90 backdrop-blur-xl border-white/40 text-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)]";
  
  const layoutStyle: React.CSSProperties = isMobile
    ? {
        top: '3rem',
        left: 0,
        width: '100%',
        height: 'calc(100% - 7rem)', 
        zIndex: window.zIndex,
      }
    : window.isMaximized
    ? {
        top: '2.5rem',
        left: 0,
        width: '100%',
        height: 'calc(100% - 6rem)',
        zIndex: window.zIndex,
      }
    : {
        top: currentPos.y,
        left: currentPos.x,
        width: currentSize.width,
        height: currentSize.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`${baseClasses} ${themeClasses} ${transitionClass}`}
      style={layoutStyle}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div
        className={`h-9 flex items-center px-4 select-none flex-shrink-0 ${isDarkMode ? 'bg-gradient-to-b from-white/10 to-transparent' : 'bg-gradient-to-b from-gray-100/50 to-transparent'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => !isMobile && onMaximize(window.id)}
      >
        <div className="flex space-x-2 mr-4 group">
          <button onClick={(e) => { e.stopPropagation(); onClose(window.id); }} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center">
             <X size={8} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }} className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center">
            <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }} className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center">
            {window.isMaximized ? <Square size={6} className="opacity-0 group-hover:opacity-100 text-black/50" fill="currentColor" /> : <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />}
          </button>
        </div>
        <div className="flex-1 text-center text-xs font-semibold opacity-80 truncate cursor-default">
          {window.title}
        </div>
        <div className="w-14"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
        
        {/* Resize Overlay when dragging (prevents iframe interference) */}
        {(isDragging || isResizing) && (
            <div className="absolute inset-0 z-50 bg-transparent" />
        )}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && !isMobile && (
        <>
            {/* Right */}
            <div 
                className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize hover:bg-blue-500/20 transition-colors z-40"
                onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            {/* Bottom */}
            <div 
                className="absolute bottom-0 left-0 w-full h-1.5 cursor-s-resize hover:bg-blue-500/20 transition-colors z-40"
                onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            {/* Left */}
            <div 
                className="absolute top-0 left-0 w-1.5 h-full cursor-w-resize hover:bg-blue-500/20 transition-colors z-40"
                onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            {/* Bottom-Right Corner */}
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-blue-500/20 rounded-tl"
                onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            {/* Bottom-Left Corner */}
            <div 
                className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 hover:bg-blue-500/20 rounded-tr"
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
        </>
      )}
    </div>
  );
};
