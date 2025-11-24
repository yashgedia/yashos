import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Lock, Unlock, Save, RotateCcw, Check } from 'lucide-react';

export const Admin: React.FC = () => {
  const { data, updateData, resetData } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [jsonInput, setJsonInput] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yash123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      updateData(parsed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError('Invalid JSON format');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
        resetData();
        setJsonInput(JSON.stringify(data, null, 2)); 
        window.location.reload(); 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <div className="w-full max-w-xs p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Lock size={32} />
                </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1 dark:text-white">Admin Access</h2>
            <p className="text-xs text-center text-gray-500 mb-6">Enter password to edit portfolio data.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    autoFocus
                />
                <button 
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    Unlock
                </button>
            </form>
            {error && <p className="text-red-500 text-xs text-center mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
                    <Unlock size={16} />
                </div>
                <span className="font-semibold text-sm">Data Editor</span>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={handleReset}
                    className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                    <RotateCcw size={14} className="mr-1.5" /> Reset Default
                </button>
                <button 
                    onClick={handleSave}
                    className="flex items-center px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all active:scale-95"
                >
                    {success ? <Check size={14} className="mr-1.5" /> : <Save size={14} className="mr-1.5" />}
                    {success ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden relative">
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-transparent"
                spellCheck={false}
            />
        </div>
        
        {/* Status Bar */}
        <div className="px-4 py-1 bg-blue-600 text-white text-[10px] flex justify-between">
             <span>JSON Mode</span>
             <span>{jsonInput.length} chars</span>
        </div>
        
        {error && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce">
                {error}
            </div>
        )}
    </div>
  );
};