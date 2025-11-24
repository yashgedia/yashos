import React from 'react';
import { YASH_DATA } from '../../constants';

interface VSCodeProps {
    isDarkMode: boolean;
}

export const VSCode: React.FC<VSCodeProps> = ({ isDarkMode }) => {
  const codeString = JSON.stringify(YASH_DATA, null, 2);
  
  return (
    <div className={`h-full w-full flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}>
      {/* Sidebar simulated */}
      <div className="flex h-full">
         <div className={`w-12 border-r ${isDarkMode ? 'border-gray-700 bg-[#252526]' : 'border-gray-200 bg-gray-50'} flex flex-col items-center py-4 space-y-4 hidden sm:flex`}>
            <div className="w-6 h-6 border-l-2 border-blue-500 pl-2">Files</div>
            <div className="w-6 h-6 opacity-50">Search</div>
            <div className="w-6 h-6 opacity-50">Git</div>
         </div>
         <div className="flex-1 flex flex-col overflow-hidden">
             {/* Tab */}
             <div className={`flex h-9 border-b ${isDarkMode ? 'bg-[#1e1e1e] border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                 <div className={`px-4 flex items-center text-xs border-r ${isDarkMode ? 'bg-[#1e1e1e] border-gray-700 text-white' : 'bg-white border-gray-200'} border-t-2 border-t-blue-500`}>
                    resume.json
                 </div>
             </div>
             
             {/* Code Area */}
             <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                <pre>
                    <code className={isDarkMode ? 'text-[#ce9178]' : 'text-green-700'}>
                        {codeString}
                    </code>
                </pre>
             </div>
         </div>
      </div>
      {/* Status Bar */}
       <div className={`h-6 ${isDarkMode ? 'bg-[#007acc] text-white' : 'bg-blue-600 text-white'} flex items-center px-4 text-xs justify-between`}>
           <div className="flex space-x-4">
               <span>main*</span>
               <span>0 errors</span>
               <span>0 warnings</span>
           </div>
           <div className="flex space-x-4">
               <span>Ln 1, Col 1</span>
               <span>UTF-8</span>
               <span>JSON</span>
           </div>
       </div>
    </div>
  );
};
