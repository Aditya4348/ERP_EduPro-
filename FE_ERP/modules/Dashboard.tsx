
import React from 'react';
import { Card } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';
import { useTheme } from '../context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Jan', students: 4000, finance: 2400 },
  { name: 'Feb', students: 3000, finance: 1398 },
  { name: 'Mar', students: 2000, finance: 9800 },
  { name: 'Apr', students: 2780, finance: 3908 },
  { name: 'May', students: 1890, finance: 4800 },
  { name: 'Jun', students: 2390, finance: 3800 },
];

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Utama</h2>
          <p className="text-slate-500 dark:text-slate-400">Selamat datang kembali! Berikut ringkasan performa sekolah hari ini.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">Unduh Laporan</button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Tambah Data</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Siswa', value: '1,284', change: '+2.5%', color: 'indigo' },
          { label: 'Total Guru', value: '98', change: 'Stable', color: 'emerald' },
          { label: 'Pendapatan SPP', value: 'Rp 450M', change: '+12%', color: 'blue' },
          { label: 'Rata-rata Nilai', value: '84.2', change: '+5.4%', color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-all duration-300">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-lg group-hover:bg-${stat.color}-600 dark:group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-300`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{stat.change}</span>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
             <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Tren Kehadiran & Keuangan">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Area type="monotone" dataKey="finance" stroke="#6366f1" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Sebaran Nilai Akademik">
           <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}} 
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
