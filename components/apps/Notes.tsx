
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export const Notes: React.FC = () => {
  const [note, setNote] = useState('');
  const [lastSaved, setLastSaved] = useState<string>('');

  // Load from local storage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('yash_os_notes');
    if (savedNote) {
      setNote(savedNote);
    } else {
      setNote("Welcome to Notes!\n\nThis is a simple text editor. Whatever you type here is saved automatically to your browser's local storage, so it will be here when you come back.\n\n- Yash");
    }
  }, []);

  // Save to local storage whenever note changes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('yash_os_notes', note);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000); // Debounce save by 1s

    return () => clearTimeout(timer);
  }, [note]);

  return (
    <div className="h-full w-full flex flex-col bg-yellow-50 dark:bg-gray-800 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-yellow-200 dark:border-gray-700 bg-yellow-100/50 dark:bg-gray-900/50">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {lastSaved ? `Saved at ${lastSaved}` : 'Unsaved'}
        </span>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Save size={16} />
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="flex-1 w-full p-6 bg-transparent outline-none resize-none font-mono text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base selection:bg-yellow-200 dark:selection:bg-blue-900"
        placeholder="Type your notes here..."
        spellCheck={false}
      />
    </div>
  );
};
