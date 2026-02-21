
import React from 'react';
import { Card } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Users, UserCheck, Building2, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const GENDER_DATA = [
  { name: 'Laki-laki', value: 720 },
  { name: 'Perempuan', value: 564 },
];

const MAJOR_DATA = [
  { name: 'RPL', students: 450 },
  { name: 'TKJ', students: 380 },
  { name: 'MM', students: 320 },
  { name: 'DKV', students: 134 },
];

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export const MasterInsights: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Master Insights</h2>
          <p className="text-slate-500">Statistik dan analisis data master operasional sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Rasio Guru-Siswa', value: '1:13', icon: <TrendingUp />, color: 'indigo' },
          { label: 'Profil Lengkap', value: '92%', icon: <UserCheck />, color: 'emerald' },
          { label: 'Ruangan Aktif', value: '42/45', icon: <Building2 />, color: 'blue' },
          { label: 'Mitra Industri', value: '24', icon: <Briefcase />, color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribusi Siswa per Jurusan">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MAJOR_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Komposisi Gender Siswa">
          <div className="h-72 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GENDER_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {GENDER_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-12">
               {GENDER_DATA.map((entry, index) => (
                 <div key={entry.name} className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                   <span className="text-sm font-bold text-slate-700">{entry.name}</span>
                   <span className="text-sm text-slate-400">{Math.round((entry.value / 1284) * 100)}%</span>
                 </div>
               ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
