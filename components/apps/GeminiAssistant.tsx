import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiAssistantProps {
  isDarkMode: boolean;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isDarkMode }) => {
  const { data: YASH_DATA } = useData();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Yash's AI assistant. Ask me anything about his skills, experience, or projects." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!process.env.API_KEY) {
        setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'model', text: "Error: API Key not configured in environment." }]);
        setInput('');
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Create prompt with context
      const systemContext = `
        You are an AI assistant for Yash Gedia's portfolio website. 
        Here is Yash's resume data: ${JSON.stringify(YASH_DATA)}.
        Answer questions about Yash based strictly on this data. 
        Be professional, enthusiastic, and concise. 
        If asked about something not in the data, say you don't have that information but suggest contacting him directly.
        Current query: ${userMsg}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemContext,
      });

      const text = response.text || "I couldn't generate a response at the moment.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Header */}
      <div className={`p-4 border-b flex items-center space-x-2 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-blue-50'}`}>
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full text-white">
            <Sparkles size={20} />
        </div>
        <div>
            <h3 className="font-bold text-sm">Yash AI</h3>
            <p className="text-xs opacity-70">Powered by Google Gemini</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-600'} text-white`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-tr-none' 
                        : (isDarkMode ? 'bg-gray-700 text-gray-100 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none')
                    }`}>
                        {msg.text}
                    </div>
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-gray-200/20 p-3 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="relative flex items-center">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my skills..."
                className={`w-full pl-4 pr-12 py-3 rounded-full focus:outline-none border focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
            >
                <Send size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};