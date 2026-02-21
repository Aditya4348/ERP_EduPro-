
import React, { useState } from 'react';
import { Card, Table, Button } from '../components/UI';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookMarked, Layers, Award, ShieldCheck, ChevronRight, Plus } from 'lucide-react';

export const AcademicCurriculum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BookMarked className="text-indigo-600" /> Manajemen Kurikulum
          </h2>
          <p className="text-slate-500">Pengaturan struktur mata pelajaran dan standar penilaian.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
           <button 
            onClick={() => setActiveTab('structure')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'structure' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Struktur Mapel
           </button>
           <button 
            onClick={() => setActiveTab('kktp')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'kktp' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             KKTP / KKM
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <Card title="Tahun Pelajaran">
              <div className="space-y-4">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                    <p className="text-xs font-black uppercase text-indigo-600 mb-1">Status Aktif</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">2024/2025</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">Semester Ganjil</p>
                 </div>
                 <Button variant="secondary" className="w-full text-xs">Ubah Tahun Ajaran</Button>
              </div>
           </Card>

           <Card title="Sistem Penilaian">
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600">Kurikulum Merdeka</span>
                 </div>
                 <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
                    <Layers size={16} className="text-slate-300" />
                    <span className="text-sm font-medium text-slate-400">K13 (Legacy)</span>
                 </div>
              </div>
           </Card>
        </div>

        <div className="lg:col-span-3">
           <Card className="!p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100">{activeTab === 'structure' ? 'Daftar Mata Pelajaran' : 'Setting Kriteria Ketuntasan'}</h3>
                 <Button className="!px-3 !py-1.5 text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Tambah Item</Button>
              </div>
              <Table headers={['Kode', 'Nama Mata Pelajaran', 'Kelompok', activeTab === 'structure' ? 'Beban Jam' : 'KKTP', 'Aksi']}>
                 {[
                   { kode: 'MULOK-01', name: 'Bahasa Sunda', group: 'Muatan Lokal', value: '2 JP', kktp: '75' },
                   { kode: 'PRO-RPL-01', name: 'Pemrograman Web', group: 'Kejuruan', value: '8 JP', kktp: '80' },
                   { kode: 'NAS-01', name: 'Pendidikan Agama', group: 'Nasional', value: '3 JP', kktp: '75' },
                 ].map(item => (
                   <tr key={item.kode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.kode}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.group}</td>
                      <td className="px-6 py-4">
                         <span className="font-black text-indigo-600">{activeTab === 'structure' ? item.value : item.kktp}</span>
                      </td>
                      <td className="px-6 py-4">
                         <ChevronRight size={16} className="text-slate-300" />
                      </td>
                   </tr>
                 ))}
              </Table>
           </Card>
        </div>
      </div>
    </div>
  );
};
