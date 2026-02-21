import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MENU_ITEMS, ROLE_LABELS } from '../constants';
import { UserRole } from '../types';
import { 
  GraduationCap, Search, Bell, 
  LogOut, Sun, Moon, Home, 
  Calendar, Users, BookOpen, Settings,
  ChevronRight, X
} from 'lucide-react';
import { HelpGuide } from '@/components/HelpGuide';

export const DashboardLayoutMobile: React.FC = () => {
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredMenu = MENU_ITEMS.filter(item => user && item.roles.includes(user.role));
  console.log("filteredMenu", filteredMenu);

  
  // Ambil menu utama untuk bottom navigation (max 5 item)
  const mainMenuItems = filteredMenu;
  
  // Sisa menu untuk "More" section
  const moreMenuItems = filteredMenu.slice(5);

  // Cari item aktif dan sub-item untuk menentukan judul halaman
  const activeItem = filteredMenu.find(item => 
    location.pathname === item.path || 
    item.submenu?.some(sub => location.pathname.startsWith(sub.path))
  );

  const activeSubItem = activeItem?.submenu?.find(sub => location.pathname.startsWith(sub.path));
  const pageTitle = activeSubItem ? activeSubItem.title : activeItem?.title;

  // Mapping path ke guideId untuk komponen HelpGuide.
  const pathToGuideId: { [key: string]: string } = {
    '/': 'dashboard',
    
    // Core 
    '/core/students': 'master students',
    '/core/teachers': 'master teachers',
    '/core/staff': 'master staff',
    '/core/class': 'class management',
    '/core/school-profile': 'school profile',
    '/core/promotion-engine': 'promotion engine',
    '/core/master-insights': 'master insights',

    // Details
    '/core/student-detail': 'student detail',
    '/core/teacher-detail': 'teacher detail',
    '/core/staff-detail': 'staff detail',
    '/core/class-detail': 'class detail',

    // Academic
    '/academic/cbt': 'academic-cbt',
    '/finance/spp': 'finance-spp',

  };

  const helpGuideId = activeSubItem ? pathToGuideId[activeSubItem.path] : (activeItem ? pathToGuideId[activeItem.path] : undefined);
  console.log("helpGuideId", helpGuideId);





  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 flex items-center justify-between px-4 md:px-8 shrink-0 z-30">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logo untuk mobile dan desktop */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <GraduationCap size={isMobile ? 18 : 24} className="text-white" />
              </div>
              {!isMobile && (
                <div>
                  <h1 className="font-bold text-lg">EduPro ERP</h1>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Enterprise SaaS</p>
                </div>
              )}
            </div>
            
            {/* Search - Desktop only */}
            {!isMobile && (
              <div className="relative group ml-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari fitur, data, atau laporan..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl text-sm w-96 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none border text-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            {/* Search Mobile Button */}
            {isMobile && (
              <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Search size={18} />
              </button>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl transition-colors group"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={isMobile ? 18 : 20} /> : <Sun size={isMobile ? 18 : 20} />}
            </button>

            {/* Notifikasi - Desktop only */}
            {!isMobile && (
              <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative group">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
            )}

            {/* Separator untuk desktop */}
            {!isMobile && <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>}

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 md:gap-3 p-1 pl-1 md:pl-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl transition-all group"
              >
                {!isMobile && (
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">{user?.name}</p>
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">{user ? ROLE_LABELS[user.role] : 'Guest'}</p>
                  </div>
                )}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-indigo-200 dark:shadow-indigo-900/30 shadow-lg text-sm md:text-base">
                  {user?.name.charAt(0)}
                </div>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className={`${isMobile ? 'fixed inset-x-4 bottom-4' : 'absolute right-0 mt-3 w-64'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in transition-colors duration-300`}>
                  {isMobile && (
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{user?.name}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">{user ? ROLE_LABELS[user.role] : 'Guest'}</p>
                      </div>
                      <button onClick={() => setIsProfileOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-2">Impersonate Role (Dev)</p>
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
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
                  <button onClick={() => { logout(); navigate('/'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-bold flex items-center gap-2 transition-colors">
                    <LogOut size={16} /> Keluar Sistem
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Search Bar - muncul di bawah header untuk mobile */}
        {isMobile && (
          <div className="bg-white dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari fitur atau data..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header Info */}
            {isMobile && pageTitle && (
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {pageTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {user?.name} • {ROLE_LABELS[user?.role || UserRole.SUPER_ADMIN]}
                  </p>
                </div>
                 <HelpGuide guideId={helpGuideId} />
              </div>
            )}
            
            <Outlet />
          </div>
        </section>

        {/* Bottom Navigation untuk Mobile */}
        {isMobile && (
          <>
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1 z-40 shadow-lg ">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
                {mainMenuItems.map((item, index) => {
                  const isActive = location.pathname === item.path || 
                    item.submenu?.some(sub => location.pathname === sub.path);

                  
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                        isActive 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>
                        {item.title}
                      </span>
                      {isActive && (
                        <span className="absolute -top-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
                
                {/* Notifikasi di bottom nav untuk mobile */}
                {/* <button className="flex flex-col items-center py-2 px-3 text-slate-400 dark:text-slate-500 relative">
                  <Bell size={20} />
                  <span className="text-[10px] font-medium mt-1">Notif</span>
                  <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button> */}
              </div>
            </nav>

            {/* More Menu Modal untuk menu tambahan */}
            {showMobileMenu && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
                  onClick={() => setShowMobileMenu(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 animate-slide-up p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Menu Navigasi</h3>
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {filteredMenu.map((item, index) => {
                      const isActive = location.pathname === item.path;

                      console.log("isActive", isActive);
                      
                      if (item.submenu) {
                        return (
                          <div key={index} className="space-y-1">
                            <div className="text-sm font-bold text-slate-400 dark:text-slate-500 px-4 py-2">
                              {item.title}
                            </div>
                            {item.submenu
                              .filter(sub => user && sub.roles.includes(user.role))
                              .map((sub, sidx) => (
                                <Link
                                  key={sidx}
                                  to={sub.path}
                                  onClick={() => setShowMobileMenu(false)}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    location.pathname === sub.path
                                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {sub.icon}
                                  <span className="flex-1 text-sm">{sub.title}</span>
                                  <ChevronRight size={16} className="text-slate-400" />
                                </Link>
                              ))}
                          </div>
                        );
                      }
                      
                      return (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {item.icon}
                          <span className="flex-1 text-sm">{item.title}</span>
                          <ChevronRight size={16} className="text-slate-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};