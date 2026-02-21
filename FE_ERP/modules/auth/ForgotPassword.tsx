
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI';
import { ArrowLeft, Mail, Loader2, HelpCircle, ShieldCheck } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending code
    setTimeout(() => {
      navigate('/auth/verify-otp', { state: { email } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-inter transition-colors duration-300">
      {/* Left Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full animate-fade-in">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Lupa Password?</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Jangan khawatir, kami akan mengirimkan kode verifikasi 6-digit ke email anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Sekolah</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  placeholder="masukkan@email.anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 font-bold shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Kirim Kode Verifikasi'}
            </Button>
          </form>

          <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex gap-4 transition-colors">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 h-fit">
               <HelpCircle size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Butuh bantuan lain?</p>
               <p className="text-xs text-amber-700 dark:text-amber-500 mt-1 leading-relaxed">Jika anda tidak lagi memiliki akses ke email anda, silahkan hubungi IT Administrator sekolah atau Tata Usaha.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Section: Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 dark:bg-slate-950 items-center justify-center p-20 relative overflow-hidden transition-colors duration-300 border-l border-slate-800/50">
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
        <div className="relative z-10 text-center max-w-lg">
           <div className="w-24 h-24 bg-white/10 dark:bg-white/5 rounded-3xl mx-auto flex items-center justify-center border border-white/20 dark:border-white/10 mb-8 animate-pulse shadow-2xl">
              <ShieldCheck size={48} className="text-indigo-400" />
           </div>
           <h3 className="text-4xl font-black text-white">Keamanan Akun Prioritas Utama Kami</h3>
           <p className="text-slate-400 dark:text-slate-500 mt-6 text-lg leading-relaxed">EduPro menggunakan enkripsi tingkat militer (AES-256) untuk memastikan seluruh data otentikasi anda tetap aman.</p>
        </div>
      </div>
    </div>
  );
};
