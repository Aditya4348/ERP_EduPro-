
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_TEACHERS } from '../../constants';
import { Mail, Book, Calendar, ClipboardList, Clock, ChevronLeft, Award } from 'lucide-react';

export const TeacherDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers] = useLocalStorage<any[]>('edupro_teachers', INITIAL_TEACHERS);
  const teacher = teachers.find(t => t.id === id);

  if (!teacher) return (
    <div className="p-8 text-center animate-fade-in">
      <Breadcrumbs />
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">Data guru tidak ditemukan.</p>
        <Button onClick={() => navigate('/core/teachers')} className="mt-4 mx-auto">Kembali</Button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" onClick={() => navigate(-1)} className="p-2 rounded-full">
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Detail Tenaga Pendidik</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white font-black text-4xl mb-6 shadow-xl shadow-indigo-100">
              {teacher.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
            <p className="text-slate-400 font-mono text-sm mt-1">{teacher.nip}</p>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                teacher.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>{teacher.status}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Book size={16} className="text-slate-400" /> {teacher.subject}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" /> teacher@school.id
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400" /> Bergabung sejak 2015
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Jam Mengajar', value: '24 Jam/Minggu', icon: <Clock /> },
              { label: 'Total Kelas', value: '6 Kelas', icon: <ClipboardList /> },
              { label: 'Sertifikasi', value: 'Lulus Sertifikasi', icon: <Award /> },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <div className="w-10 h-10 bg-slate-50 text-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-slate-800 mt-1">{stat.value}</p>
              </Card>
            ))}
          </div>

          <Card title="Jadwal Mengajar Hari Ini">
            <div className="space-y-4">
              {[
                { time: '07:30 - 09:00', class: 'X RPL 1', room: 'Lab 01' },
                { time: '09:30 - 11:00', class: 'X RPL 2', room: 'Lab 01' },
                { time: '13:00 - 14:30', class: 'XII MM 1', room: 'R. Teori 10' },
              ].map((j, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-default group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {j.time.split(' ')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{j.class}</p>
                        <p className="text-xs text-slate-500">{j.time}</p>
                      </div>
                   </div>
                   <span className="text-xs font-black text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{j.room}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
