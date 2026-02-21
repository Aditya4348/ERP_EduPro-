
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/UI';
import { GraduationCap, Mail, Lock, Loader2, Chrome, Monitor, Layers, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Default to SUPER_ADMIN for demo
    await login(UserRole.SUPER_ADMIN);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-inter transition-colors duration-300">
      {/* Left Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full animate-fade-in">
          <div className="mb-10 flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
               <GraduationCap size={28} className="text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">EduPro ERP</h1>
               <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest">Enterprise Edition</p>
             </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Silahkan masuk ke akun anda untuk mengelola sistem sekolah.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="admin@school.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {/* Fixed: Removed invalid 'size' prop from Link component which caused a TypeScript error */}
                <Link to="/auth/forgot-password" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">Ingat saya di perangkat ini</label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-lg font-bold shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Memproses...
                </>
              ) : 'Masuk Sekarang'}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
             <p className="text-sm text-slate-400 dark:text-slate-500">Atau masuk dengan akun sekolah lainnya:</p>
             <div className="flex gap-4 w-full">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300 transition-all duration-200">
                  <Chrome size={18} /> Google
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300 transition-all duration-200">
                  <Monitor size={18} /> Microsoft
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Right Section: Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 dark:bg-slate-950 items-center justify-center p-20 relative overflow-hidden transition-colors duration-300 border-l border-slate-800/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
           <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-md p-10 rounded-[40px] border border-white/10 dark:border-white/5 shadow-2xl animate-in zoom-in duration-700">
             <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-8 transform -rotate-12 group hover:rotate-0 transition-transform duration-500">
                <Layers size={48} className="text-white" />
             </div>
             <h3 className="text-3xl font-black text-white leading-tight">Masa Depan Manajemen Sekolah Digital</h3>
             <p className="text-slate-400 dark:text-slate-500 mt-4 text-lg">Platform ERP terintegrasi yang memudahkan kolaborasi guru, siswa, dan orang tua dalam satu ekosistem.</p>
           </div>
           
           <div className="grid grid-cols-3 gap-6">
              {[
                { icon: <ShieldCheck />, label: 'Security' },
                { icon: <Zap />, label: 'Fast' },
                { icon: <HeartHandshake />, label: 'Reliable' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-600 hover:text-indigo-400 transition-colors cursor-default transition-all duration-300">
                   <div className="p-3 bg-white/5 rounded-2xl border border-white/5">{item.icon}</div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
