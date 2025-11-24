import React, { useEffect, useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

export const Terminal: React.FC = () => {
  const { data: YASH_DATA } = useData();
  const [lines, setLines] = useState<string[]>(["Last login: " + new Date().toUTCString() + " on ttys000"]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, () => string | string[]> = {
    help: () => "Available commands: help, clear, skills, contact, about, whoami",
    whoami: () => "root@yash-portfolio",
    contact: () => [
        `Email: ${YASH_DATA.contact.email}`,
        `Phone: ${YASH_DATA.contact.phone}`,
        ...YASH_DATA.contact.social.map((s: any) => `${s.name}: ${s.url}`)
    ],
    about: () => YASH_DATA.objective,
    skills: () => [
        "--- FRONTEND ---",
        ...YASH_DATA.skills.frontend,
        "",
        "--- BACKEND ---",
        ...YASH_DATA.skills.backend,
        "",
        "--- LANGUAGES ---",
        ...YASH_DATA.skills.languages
    ],
    clear: () => {
        setLines([]);
        return "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newLines = [...lines, `yash@macbook:~$ ${input}`];
      
      if (cmd in commands) {
        const output = commands[cmd]();
        if (Array.isArray(output)) {
            newLines.push(...output);
        } else if (output) {
            newLines.push(output);
        }
      } else if (cmd !== '') {
        newLines.push(`command not found: ${cmd}`);
      }
      
      setLines(newLines);
      setInput('');
    }
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="h-full w-full bg-black text-green-500 font-mono text-sm p-4 flex flex-col" onClick={() => document.getElementById('term-input')?.focus()}>
      <div className="flex-1 overflow-auto space-y-1" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div className="flex">
          <span className="mr-2 text-blue-400">yash@macbook:~$</span>
          <input
            id="term-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 text-white"
            autoFocus
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};