
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MENU_ITEMS, ROLE_LABELS } from '../constants';
import { UserRole } from '../types';
import { 
  GraduationCap, ChevronDown, Search, Bell, 
  LogOut, ChevronLeft, Sun, Moon 
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredMenu = MENU_ITEMS.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 dark:bg-slate-900 text-white transition-all duration-300 flex flex-col z-40 border-r border-slate-800/50 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <GraduationCap size={24} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg whitespace-nowrap">EduPro ERP</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise SaaS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-1">
          {filteredMenu.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.submenu?.some(s => location.pathname === s.path));
            const isExpanded = expandedMenus.includes(item.title);

            return (
              <div key={idx}>
                {item.submenu ? (
                  <button 
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all group ${isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400'}`}
                  >
                    <span className={`${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}>{item.icon}</span>
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.title}</span>
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all group ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400'}`}
                  >
                    <span className={`${location.pathname === item.path ? 'text-white' : 'group-hover:text-white'}`}>{item.icon}</span>
                    {!isSidebarCollapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                )}

                {item.submenu && isExpanded && !isSidebarCollapsed && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-slate-800 pl-4 animate-fade-in">
                    {item.submenu.filter(s => user && s.roles.includes(user.role)).map((sub, sidx) => (
                      <Link 
                        key={sidx} 
                        to={sub.path} 
                        className={`flex items-center gap-3 py-2 text-sm transition-colors ${location.pathname === sub.path ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-white'}`}
                      >
                        {sub.icon}
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors group text-slate-400"
           >
             <ChevronLeft size={20} className={`transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
             {!isSidebarCollapsed && <span className="font-medium">Collapse Sidebar</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari fitur, data, atau laporan..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl text-sm w-96 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none border text-slate-900 dark:text-slate-100"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative group">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pl-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">{user ? ROLE_LABELS[user.role] : 'Guest'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-indigo-200 dark:shadow-indigo-900/30 shadow-lg">
                   {user?.name.charAt(0)}
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in transition-colors duration-300">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-2">Impersonate Role (Dev)</p>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.values(UserRole).slice(0, 5).map(role => (
                        <button 
                          key={role} 
                          onClick={() => { login(role); setIsProfileOpen(false); }}
                          className={`text-left text-xs px-3 py-2 rounded-lg transition-colors ${user?.role === role ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-bold flex items-center gap-2 transition-colors">
                    <LogOut size={16} /> Keluar Sistem
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};
