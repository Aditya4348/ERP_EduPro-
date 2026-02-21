
import React, { useState } from 'react';
import { Card, Table, Button } from '@/components/UI';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_STUDENTS } from '@/constants';
import { UserCheck, Calendar, Search, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export const AcademicAttendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('X RPL 1');
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <UserCheck className="text-indigo-600" /> Absensi Digital
          </h2>
          <p className="text-slate-500">Pencatatan kehadiran siswa per jam pelajaran.</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           </div>
           <Button>Simpan Absensi</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 space-y-4">
           <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Pilih Rombel</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option>X RPL 1</option>
                <option>XI TKJ 2</option>
                <option>XII MM 1</option>
              </select>
           </div>
           <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Jam Pelajaran</label>
              <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none">
                <option>Jam 1-2 (07:00 - 08:30)</option>
                <option>Jam 3-4 (08:30 - 10:00)</option>
                <option>Jam 5-6 (10:30 - 12:00)</option>
              </select>
           </div>
           <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-xs mb-2">
                 <span className="text-slate-500">Terisi</span>
                 <span className="font-bold text-indigo-600">{Object.keys(attendance).length} / {INITIAL_STUDENTS.length}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                 <div className="bg-indigo-600 h-full transition-all" style={{width: `${(Object.keys(attendance).length / INITIAL_STUDENTS.length) * 100}%`}}></div>
              </div>
           </div>
        </Card>

        <Card className="md:col-span-3 !p-0 overflow-hidden">
          <Table headers={['NIS', 'Nama Siswa', 'Status Kehadiran', 'Keterangan']}>
            {INITIAL_STUDENTS.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{s.nis}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">{s.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {[
                      { val: 'H', label: 'Hadir', color: 'emerald', icon: <CheckCircle2 size={14} /> },
                      { val: 'S', label: 'Sakit', color: 'amber', icon: <Clock size={14} /> },
                      { val: 'I', label: 'Izin', color: 'blue', icon: <AlertCircle size={14} /> },
                      { val: 'A', label: 'Alpa', color: 'rose', icon: <XCircle size={14} /> }
                    ].map(status => (
                      <button
                        key={status.val}
                        onClick={() => handleStatusChange(s.id, status.val)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                          attendance[s.id] === status.val 
                          ? `bg-${status.color}-600 text-white border-transparent shadow-lg` 
                          : `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-${status.color}-500`
                        }`}
                        title={status.label}
                      >
                        {status.icon}
                        <span className="text-[8px] font-black">{status.val}</span>
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    placeholder="..." 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1 text-xs outline-none focus:border-indigo-500"
                  />
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
};
