
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/UI';
import { ArrowLeft, Loader2, Fingerprint, ShieldCheck } from 'lucide-react';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "email@anda.com";
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert('Password baru telah dikirim ke email anda.');
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-inter transition-colors duration-300">
      {/* Left Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full animate-fade-in">
          {/* Fixed: Removed invalid 'university-link' prop from Link component */}
          <Link to="/auth/forgot-password" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} /> Kembali
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Verifikasi Email</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Kami telah mengirimkan kode 6-digit ke <span className="font-bold text-slate-900 dark:text-slate-100">{email}</span></p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  // Fixed: Wrapped assignment in braces to ensure the ref callback returns void
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-black bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  required
                />
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 font-bold shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40"
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Verifikasi & Lanjutkan'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tidak menerima kode? {' '}
              {timer > 0 ? (
                <span className="text-slate-400 dark:text-slate-600 font-medium transition-colors">Kirim ulang dalam {timer}s</span>
              ) : (
                <button 
                  onClick={() => { setTimer(60); setOtp(['','','','','','']); }}
                  className="text-indigo-600 dark:text-indigo-400 font-black hover:underline transition-colors"
                >
                  Kirim Ulang Kode
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 dark:bg-slate-950 items-center justify-center p-20 relative overflow-hidden transition-colors duration-300 border-l border-slate-800/50">
        <div className="absolute top-0 right-0 p-10 opacity-10 dark:opacity-5 transform rotate-12">
           <Fingerprint size={400} className="text-white" />
        </div>
        <div className="relative z-10 text-center space-y-6 max-sm">
           <div className="inline-flex p-4 bg-indigo-600/20 rounded-3xl border border-indigo-500/30 text-indigo-400 mb-4 animate-pulse">
             <ShieldCheck size={48} />
           </div>
           <h3 className="text-4xl font-black text-white leading-tight">Otentikasi Dua Faktor</h3>
           <p className="text-slate-400 dark:text-slate-500 text-lg mx-auto leading-relaxed">EduPro memastikan setiap akses ke database sekolah divalidasi dengan standar keamanan tertinggi.</p>
        </div>
      </div>
    </div>
  );
};
