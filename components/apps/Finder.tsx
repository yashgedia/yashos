import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { AppID } from '../../types';
import { 
  User, Briefcase, Layers, MapPin, Mail, Github, Linkedin, Instagram, 
  Clock, FileText, ChevronRight, Laptop, Edit3, MinusCircle, ExternalLink,
  Cpu, GraduationCap, Code, Menu, X
} from 'lucide-react';

interface FinderProps {
  isDarkMode: boolean;
  openApp: (id: AppID, data?: any) => void;
}

type TabID = 'overview' | 'experience' | 'projects' | 'skills' | 'education' | 'recents';

interface NavItemProps {
  id: TabID;
  icon: any;
  label: string;
  activeTab: TabID;
  setActiveTab: (id: TabID) => void;
  isDarkMode: boolean;
  isEditMode: boolean;
  closeSidebar?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  id, 
  icon: Icon, 
  label, 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  isEditMode,
  closeSidebar
}) => {
  const isActive = activeTab === id;
  
  // Active State Styles
  const activeStyles = isDarkMode 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1' 
      : 'bg-white text-gray-900 shadow-md shadow-gray-200/50 border border-gray-100 translate-x-1';
      
  // Inactive State Styles
  const inactiveStyles = 'hover:bg-gray-400/10 text-gray-500 dark:text-gray-400 hover:translate-x-0.5';

  return (
    <button 
      onClick={() => { setActiveTab(id); if(closeSidebar) closeSidebar(); }}
      className={`
          group relative flex items-center justify-between w-full p-2.5 px-3 rounded-xl text-sm transition-all duration-300 ease-out
          ${isActive ? activeStyles : inactiveStyles}
      `}
      title={label}
    >
      {/* Animated Active Border Indicator */}
      <div className={`
          absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300
          ${isActive ? (isDarkMode ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-blue-500') : 'w-0 opacity-0'}
      `} />

      <div className={`flex items-center space-x-3 transition-all duration-300 ${isActive ? 'pl-2' : ''}`}>
        <Icon 
          size={18} 
          className={`transition-colors duration-300 flex-shrink-0 ${isActive ? (isDarkMode ? 'text-white' : 'text-blue-600') : 'text-blue-500 opacity-80 group-hover:opacity-100'}`} 
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span className={`font-medium ${isActive ? 'tracking-wide' : ''}`}>{label}</span>
      </div>
      {isEditMode && <MinusCircle size={14} className="text-red-500 animate-pulse" />}
    </button>
  );
};

export const Finder: React.FC<FinderProps> = ({ isDarkMode, openApp }) => {
  const { data: YASH_DATA } = useData();
  const [activeTab, setActiveTab] = useState<TabID>('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic Styles
  const sidebarClass = isDarkMode ? 'bg-gray-800/95' : 'bg-gray-100/95';
  const contentClass = isDarkMode ? 'bg-[#1e1e1e]/90' : 'bg-white/90';
  const textClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const headingClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-white/10' : 'border-gray-200/50';

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-full w-full select-none overflow-hidden relative">
      
      {/* Mobile Toggle & Backdrop */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 sm:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        absolute sm:relative z-30 h-full w-64 sm:w-60 flex-shrink-0 flex flex-col pt-5 pb-3 px-4 space-y-6 
        ${sidebarClass} backdrop-blur-xl border-r ${borderClass} transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full sm:translate-x-0'}
      `}>
        
        {/* Mobile Header in Sidebar */}
        <div className="flex sm:hidden justify-between items-center mb-2">
            <span className="font-bold text-lg opacity-50">Menu</span>
            <button onClick={closeSidebar} className="p-1 rounded-full hover:bg-gray-400/20">
                <X size={20} />
            </button>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
            {/* Favorites */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 mb-2 px-3 uppercase tracking-wider">Favorites</div>
              <div className="space-y-1">
                <NavItem id="overview" icon={User} label="About Me" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
                <NavItem id="experience" icon={Briefcase} label="Experience" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
                <NavItem id="projects" icon={Layers} label="Projects" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
                <NavItem id="skills" icon={Cpu} label="Skills" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
                <NavItem id="education" icon={GraduationCap} label="Education" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
              </div>
            </div>

            {/* Recents */}
            <div>
               <div className="text-[10px] font-bold text-gray-400 mb-2 px-3 uppercase tracking-wider">Recents</div>
               <div className="space-y-1">
                 <NavItem id="recents" icon={Clock} label="Recent Files" activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} isEditMode={isEditMode} closeSidebar={closeSidebar} />
               </div>
            </div>

            {/* Locations (Visual Only) */}
            <div>
                <div className="text-[10px] font-bold text-gray-400 mb-2 px-3 uppercase tracking-wider">Locations</div>
                <div className="px-3 py-2 flex items-center space-x-3 opacity-60">
                    <Laptop size={15} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">Yash's MacBook</span>
                </div>
            </div>
        </div>

        {/* Edit Mode Toggle */}
        <div className="mt-auto pt-4 border-t border-gray-400/10">
             <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center space-x-2 text-xs font-medium px-2 py-1 rounded hover:bg-gray-400/10 transition-colors ${isEditMode ? 'text-blue-500' : 'text-gray-500'}`}
             >
                <Edit3 size={12} />
                <span>{isEditMode ? 'Done' : 'Edit Sidebar'}</span>
             </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-auto ${contentClass} backdrop-blur-3xl p-0 relative`}>
        
        {/* Mobile Toggle Button (Visible only on mobile) */}
        <div className="sm:hidden sticky top-0 z-10 p-4 pb-2 bg-inherit backdrop-blur-md flex items-center border-b border-gray-200/10">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-gray-700/50 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
                <Menu size={20} />
            </button>
            <span className={`font-semibold text-lg ${headingClass}`}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto p-4 sm:p-10 animate-fade-in pb-20">
             <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Profile Header */}
                <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-xl border ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-white/10' : 'bg-gradient-to-br from-white to-gray-50 border-white/60'}`}>
                    {/* Background Decorative Blur */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative group flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <img 
                            src={YASH_DATA.avatar} 
                            alt={YASH_DATA.name}
                            className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                        />
                    </div>
                    
                    <div className="text-center sm:text-left z-10">
                        <h1 className={`text-3xl sm:text-5xl font-bold mb-2 tracking-tight ${headingClass}`}>{YASH_DATA.name}</h1>
                        <p className={`text-lg sm:text-xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500`}>
                            {YASH_DATA.role}
                        </p>
                        
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
                             <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                <MapPin size={12} className="mr-1.5" /> {YASH_DATA.location}
                             </div>
                             <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                <Mail size={12} className="mr-1.5" /> {YASH_DATA.contact.email}
                             </div>
                        </div>

                        <div className="flex gap-4 justify-center sm:justify-start">
                             {YASH_DATA.contact.social.map((social: any) => (
                                 <a 
                                    key={social.name}
                                    href={social.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-sm ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                                 >
                                     {social.name === 'LinkedIn' && <Linkedin size={20} />}
                                     {social.name === 'GitHub' && <Github size={20} />}
                                     {social.name === 'Instagram' && <Instagram size={20} />}
                                 </a>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Biography */}
                <div className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white/60 border-white/40'}`}>
                    <h3 className={`text-xl font-bold mb-4 flex items-center ${headingClass}`}>
                        <User size={20} className="mr-2 text-blue-500" /> Professional Summary
                    </h3>
                    <p className={`leading-relaxed text-base sm:text-lg opacity-90 ${textClass}`}>
                        {YASH_DATA.objective}
                    </p>
                </div>

             </div>
          </div>
        )}

        {/* --- EXPERIENCE TAB --- */}
        {activeTab === 'experience' && (
            <div className="h-full overflow-y-auto p-4 sm:p-10 pb-20">
                <h2 className={`text-3xl font-bold mb-8 hidden sm:block ${headingClass}`}>Professional Experience</h2>
                <div className="max-w-4xl space-y-8">
                    {YASH_DATA.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative sm:pl-0">
                            {/* Timeline Line (Desktop) */}
                            <div className={`hidden sm:block absolute left-[150px] top-0 bottom-0 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                                {/* Date Column */}
                                <div className="sm:w-[150px] flex-shrink-0 pt-1 text-sm font-semibold text-blue-500 sm:text-right">
                                    {exp.duration}
                                </div>
                                
                                {/* Content Column */}
                                <div className="flex-1 relative">
                                    {/* Dot */}
                                    <div className={`hidden sm:block absolute -left-[55px] top-1.5 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'bg-gray-900 border-blue-500' : 'bg-white border-blue-500'}`}></div>
                                    
                                    <div className={`p-5 sm:p-6 rounded-2xl border transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800/50 border-white/10 hover:bg-gray-800' : 'bg-white/60 border-white/40 hover:bg-white'}`}>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 gap-2">
                                            <div>
                                                <h3 className={`text-xl font-bold ${headingClass}`}>{exp.role}</h3>
                                                <div className="text-base font-medium text-blue-500/80">{exp.company}</div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded bg-gray-200/20 w-fit ${textClass}`}>{exp.location}</span>
                                        </div>
                                        
                                        <ul className="mt-4 space-y-2">
                                            {exp.responsibilities.map((resp: string, i: number) => (
                                                <li key={i} className={`text-sm flex items-start ${textClass}`}>
                                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                                                    <span className="opacity-90">{resp}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Sub-projects within job */}
                                        {exp.projects && exp.projects.length > 0 && (
                                            <div className="mt-6 pt-4 border-t border-dashed border-gray-400/20">
                                                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">Key Projects</h4>
                                                <div className="grid gap-3">
                                                    {exp.projects.map((proj: any, pi: number) => (
                                                        <div 
                                                            key={pi} 
                                                            onClick={() => proj.url && openApp(AppID.SAFARI, { initialUrl: proj.url })}
                                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'bg-black/20 hover:bg-black/30' : 'bg-gray-50 hover:bg-gray-100'}`}
                                                        >
                                                            <div>
                                                                <div className={`font-semibold text-sm ${headingClass}`}>{proj.name}</div>
                                                                <div className="text-xs opacity-60">{proj.desc}</div>
                                                            </div>
                                                            {proj.url && <ExternalLink size={14} className="opacity-50" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
            <div className="h-full overflow-y-auto p-4 sm:p-10 pb-20">
                 <h2 className={`text-3xl font-bold mb-2 hidden sm:block ${headingClass}`}>Portfolio Gallery</h2>
                 <p className={`mb-8 hidden sm:block ${textClass}`}>A collection of professional and personal work.</p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Combine all projects */}
                    {[...YASH_DATA.experience[0].projects, ...YASH_DATA.projects].map((item: any, idx: number) => {
                        const title = 'name' in item ? item.name : item.title;
                        const desc = item.desc;
                        const url = 'url' in item ? item.url : null;
                        const stack = 'stack' in item ? item.stack : 'Full Stack';
                        const isLinkAvailable = !!url;

                        return (
                            <div 
                                key={idx} 
                                onClick={() => isLinkAvailable && openApp(AppID.SAFARI, { initialUrl: url })}
                                className={`
                                    group relative flex flex-col p-6 rounded-3xl border transition-all duration-300 
                                    ${isLinkAvailable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl' : 'cursor-default opacity-90'}
                                    ${isDarkMode ? 'bg-gray-800/40 border-white/5 hover:bg-gray-800/80' : 'bg-white/60 border-white/40 hover:bg-white'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        <Layers size={24} />
                                    </div>
                                    {isLinkAvailable && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(url, '_blank');
                                            }}
                                            title="Open External Link"
                                            className={`p-2 rounded-full transition-all duration-200 opacity-100 sm:opacity-0 group-hover:opacity-100 sm:hover:scale-110 z-10 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-700'}`}
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <h3 className={`font-bold text-xl mb-2 line-clamp-1 ${headingClass}`}>{title}</h3>
                                <p className={`text-xs font-bold uppercase tracking-wider mb-3 opacity-60 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                                    {stack}
                                </p>
                                <p className={`text-sm leading-relaxed mb-6 flex-1 ${textClass}`}>
                                    {desc}
                                </p>
                                
                                {isLinkAvailable ? (
                                    <div className="pt-4 border-t border-gray-500/10 flex items-center text-sm font-semibold text-blue-500">
                                        View Project <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ) : (
                                    <div className={`pt-4 border-t border-gray-500/10 flex items-center text-xs font-medium opacity-50 ${textClass}`}>
                                        Internal Project
                                    </div>
                                )}
                            </div>
                        );
                    })}
                 </div>
            </div>
        )}

        {/* --- SKILLS TAB --- */}
        {activeTab === 'skills' && (
            <div className="h-full overflow-y-auto p-4 sm:p-10 pb-20">
                <h2 className={`text-3xl font-bold mb-8 hidden sm:block ${headingClass}`}>Technical Skills</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Render Skill Sections */}
                    {[
                        { title: 'Programming Languages', icon: Code, skills: YASH_DATA.skills.languages, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { title: 'Backend Development', icon: Layers, skills: YASH_DATA.skills.backend, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { title: 'Frontend Development', icon: Laptop, skills: YASH_DATA.skills.frontend, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { title: 'Database & Tools', icon: Clock, skills: [...YASH_DATA.skills.database, ...YASH_DATA.skills.tools], color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    ].map((section, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white/60 border-white/40'}`}>
                            <div className="flex items-center mb-6">
                                <div className={`p-2 rounded-xl mr-3 ${section.bg} ${section.color}`}>
                                    <section.icon size={20} />
                                </div>
                                <h3 className={`text-lg font-bold ${headingClass}`}>{section.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {section.skills.map((skill: string, i: number) => (
                                    <span 
                                        key={i} 
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-700/50 text-gray-200 border border-gray-600' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- EDUCATION TAB --- */}
        {activeTab === 'education' && (
            <div className="h-full overflow-y-auto p-4 sm:p-10 pb-20">
                <h2 className={`text-3xl font-bold mb-8 hidden sm:block ${headingClass}`}>Education</h2>
                <div className="max-w-3xl">
                    {YASH_DATA.education.map((edu: any, idx: number) => (
                        <div key={idx} className={`relative overflow-hidden p-8 rounded-3xl border mb-6 ${isDarkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white/60 border-white/40'}`}>
                            {/* Decorative Background Icon */}
                            <GraduationCap className="absolute -right-6 -bottom-6 text-gray-500/5 rotate-12" size={180} />
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${headingClass}`}>{edu.institution}</h3>
                                    <div className={`text-lg font-medium mb-1 text-blue-500`}>{edu.degree}</div>
                                    <div className={`text-sm opacity-70 mb-6 ${textClass}`}>{edu.year}</div>
                                    
                                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200/50'}`}>
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Key Coursework</h4>
                                        <p className={`text-sm leading-relaxed ${textClass}`}>{edu.details.replace('Coursework:', '')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- RECENTS TAB --- */}
        {activeTab === 'recents' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 pb-20">
                <h2 className={`text-xl font-bold mb-4 px-2 hidden sm:block ${headingClass}`}>Recent Files</h2>
                <div className="space-y-1">
                    {YASH_DATA.recentFiles.map((file: any, i: number) => (
                        <div key={i} className={`group flex items-center p-3 rounded-xl transition-colors cursor-default ${isDarkMode ? 'hover:bg-blue-600/20' : 'hover:bg-blue-50'}`}>
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1">
                                <div className={`font-medium ${headingClass}`}>{file.name}</div>
                                <div className="text-xs opacity-60 flex items-center gap-2">
                                    <span>{file.type.toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{file.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                     <div className={`group flex items-center p-3 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-blue-600/20' : 'hover:bg-blue-50'}`} onClick={() => openApp(AppID.SAFARI, { initialUrl: 'https://linkedin.com' })}>
                         <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                         </div>
                         <div className="flex-1">
                                <div className={`font-medium ${headingClass}`}>Resume_Full.pdf</div>
                                <div className="text-xs opacity-60 flex items-center gap-2">
                                    <span>PDF</span>
                                    <span>•</span>
                                    <span>Available on Request</span>
                                </div>
                         </div>
                         <ExternalLink size={14} className="opacity-0 group-hover:opacity-50" />
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};