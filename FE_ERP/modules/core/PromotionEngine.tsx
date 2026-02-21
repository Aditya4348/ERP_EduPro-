
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Rocket, ChevronRight, UserCheck, AlertTriangle } from 'lucide-react';

export const PromotionEngine: React.FC = () => {
  const [students] = useLocalStorage<any[]>('edupro_students', []);
  const [step, setStep] = useState(1);
  const [sourceClass, setSourceClass] = useState('');
  const [targetClass, setTargetClass] = useState('');

  const handlePromote = () => {
    alert('Proses Kenaikan Kelas Berhasil! Sistem telah mengupdate data tingkat siswa.');
    setStep(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Rocket className="text-indigo-600" /> Promotion Engine
          </h2>
          <p className="text-slate-500">Otomatisasi kenaikan kelas dan kelulusan siswa secara massal.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 relative">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
           {[1, 2, 3].map(s => (
             <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border-2 border-slate-100'}`}>
               {s}
             </div>
           ))}
        </div>

        {step === 1 && (
          <Card title="Pilih Rombongan Belajar Asal">
            <div className="space-y-6">
               <p className="text-sm text-slate-600">Pilih kelas yang siswanya akan diproses untuk naik tingkat atau lulus.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={sourceClass} onChange={e => setSourceClass(e.target.value)}>
                    <option value="">Pilih Kelas Asal...</option>
                    <option>X RPL 1</option>
                    <option>XI TKJ 2</option>
                    <option>XII MM 1</option>
                  </select>
               </div>
               <div className="flex justify-end pt-4">
                  <Button disabled={!sourceClass} onClick={() => setStep(2)}>Lanjutkan <ChevronRight size={16} /></Button>
               </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Konfigurasi Tujuan & Seleksi Siswa">
            <div className="space-y-6">
               <div className="p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-xl flex gap-3">
                  <AlertTriangle className="shrink-0" />
                  <p className="text-sm italic">Siswa dengan rata-rata di bawah KKM akan ditandai secara otomatis untuk tinggal kelas.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Kelas Tujuan</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={targetClass} onChange={e => setTargetClass(e.target.value)}>
                      <option value="">Pilih Kelas Tujuan...</option>
                      <option>XI RPL 1</option>
                      <option>XII TKJ 2</option>
                      <option value="GRADUATED">Kelulusan (Alumni)</option>
                    </select>
                  </div>
               </div>

               <Table headers={['Seleksi', 'Nama Siswa', 'Rata-rata Nilai', 'Rekomendasi']}>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4"><input type="checkbox" defaultChecked /></td>
                    <td className="px-6 py-4 font-bold text-sm">Ahmad Faisal</td>
                    <td className="px-6 py-4">84.2</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Naik Kelas</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4"><input type="checkbox" /></td>
                    <td className="px-6 py-4 font-bold text-sm">Budi Santoso</td>
                    <td className="px-6 py-4">65.0</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase bg-rose-100 text-rose-700 px-2 py-1 rounded">Tinggal Kelas</span></td>
                  </tr>
               </Table>

               <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)}>Kembali</Button>
                  <Button disabled={!targetClass} onClick={() => setStep(3)}>Finalisasi <ChevronRight size={16} /></Button>
               </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Konfirmasi Akhir">
            <div className="text-center space-y-6 py-8">
               <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center">
                  <UserCheck size={40} />
               </div>
               <div className="max-w-md mx-auto">
                 <h3 className="text-2xl font-black text-slate-900">Siap untuk Memproses?</h3>
                 <p className="text-slate-500 mt-2">Anda akan memindahkan <span className="font-bold text-indigo-600">35 Siswa</span> dari <span className="font-bold text-slate-800">{sourceClass}</span> ke <span className="font-bold text-slate-800">{targetClass}</span>.</p>
                 <p className="text-xs text-rose-500 mt-4 font-bold uppercase tracking-wider">Tindakan ini tidak dapat dibatalkan!</p>
               </div>
               <div className="flex justify-center gap-4 pt-6">
                  <Button variant="ghost" onClick={() => setStep(2)}>Periksa Kembali</Button>
                  <Button onClick={handlePromote} className="px-8 shadow-xl shadow-indigo-200">Konfirmasi & Eksekusi</Button>
               </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
