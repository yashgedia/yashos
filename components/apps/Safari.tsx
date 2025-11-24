
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Share, Plus, X } from 'lucide-react';

interface SafariProps {
  initialUrl?: string;
  isDarkMode: boolean;
}

// Google allows embedding via this specific URL pattern
const DEFAULT_URL = 'https://www.google.com/webhp?igu=1';

export const Safari: React.FC<SafariProps> = ({ initialUrl, isDarkMode }) => {
  // History Stack Management
  const [history, setHistory] = useState<string[]>([initialUrl || DEFAULT_URL]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [inputValue, setInputValue] = useState(history[0]);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (initialUrl) {
       navigateTo(initialUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const navigateTo = (url: string) => {
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        // Simple heuristic: if it looks like a domain, add https, otherwise search google
        if (target.includes('.') && !target.includes(' ')) {
            target = 'https://' + target;
        } else {
            target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
        }
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(target);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setInputValue(target);
    setIsLoading(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputValue);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setInputValue(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setInputValue(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      // Re-setting the src forces reload
      const current = history[currentIndex];
      iframeRef.current.src = current;
    }
  };

  const currentUrl = history[currentIndex];

  return (
    <div className={`flex flex-col h-full w-full ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Browser Toolbar */}
      <div className={`flex flex-col flex-shrink-0 ${isDarkMode ? 'bg-[#2a2a2a] border-gray-700' : 'bg-[#f5f5f7] border-gray-200'} border-b pt-3 pb-2 px-4 space-y-2`}>
        
        {/* Top Controls Row */}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-4 text-gray-500">
            <button 
                onClick={handleBack} 
                disabled={currentIndex === 0}
                className={`transition-colors ${currentIndex === 0 ? 'opacity-30 cursor-default' : 'hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                <ArrowLeft size={18} />
            </button>
            <button 
                onClick={handleForward}
                disabled={currentIndex === history.length - 1}
                className={`transition-colors ${currentIndex === history.length - 1 ? 'opacity-30 cursor-default' : 'hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                <ArrowRight size={18} />
            </button>
            <button onClick={handleRefresh} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                {isLoading ? <X size={16} /> : <RotateCw size={16} />}
            </button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleSubmit} className="flex-1 flex justify-center">
            <div className={`relative flex items-center w-full max-w-2xl h-9 rounded-lg px-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] hover:bg-[#1a1a1a] text-gray-200' : 'bg-gray-200/60 hover:bg-gray-200 text-gray-800'} focus-within:ring-2 focus-within:ring-blue-500/50 shadow-sm`}>
              <Lock size={12} className="mr-2 text-gray-400" />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="bg-transparent border-none outline-none text-xs w-full text-center focus:text-left selection:bg-blue-200"
              />
              {isLoading && <div className="absolute right-3 w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>}
            </div>
          </form>

          <div className="flex space-x-4 text-gray-500">
             <Share size={16} className="hover:text-blue-500 transition-colors cursor-pointer"/>
             <Plus size={18} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className={`flex items-center px-4 py-1.5 space-x-2 text-[11px] font-medium overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-[#2a2a2a] text-gray-400 border-b border-gray-700' : 'bg-[#f5f5f7] text-gray-600 border-b border-gray-200'}`}>
         {[
            { name: 'Google', url: 'https://www.google.com/webhp?igu=1' },
            { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
            { name: 'Bing', url: 'https://www.bing.com' },
            { name: 'Portfolio', url: 'https://blackfxtudio.com' } // Example
         ].map((bm, i) => (
             <button 
                key={i}
                onClick={() => navigateTo(bm.url)}
                className="flex items-center space-x-1 hover:bg-gray-400/10 px-2 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap"
             >
                {bm.name}
             </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white w-full h-full overflow-hidden">
        <iframe 
            ref={iframeRef}
            src={currentUrl} 
            className="w-full h-full border-none bg-white"
            onLoad={() => setIsLoading(false)}
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {/* Safe Browsing Overlay (Detection is imperfect, but good UX addition) */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 bg-yellow-100 text-yellow-800 text-xs text-center border-t border-yellow-200 transition-transform duration-500 ${isLoading ? 'translate-y-full' : 'translate-y-0'}`}>
            If the site refuses to connect, it might block embedding. 
            <a href={currentUrl} target="_blank" rel="noreferrer" className="ml-2 font-bold underline hover:text-yellow-900">Open in new tab</a>
        </div>
      </div>
    </div>
  );
};
