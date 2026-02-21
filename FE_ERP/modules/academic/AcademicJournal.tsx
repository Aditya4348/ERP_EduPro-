
import React, { useState } from 'react';
import { Card, Button, Modal, Table } from '@/components/UI';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { History, Plus, BookOpen, Clock, Edit2, Trash2, CheckCircle } from 'lucide-react';

export const AcademicJournal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const journals = [
    { id: '1', date: '2024-03-11', class: 'X RPL 1', subject: 'Pemrograman Dasar', material: 'Looping (For, While)', notes: 'Siswa antusias, 2 orang izin lomba.' },
    { id: '2', date: '2024-03-10', class: 'XI TKJ 2', subject: 'Sistem Operasi Jaringan', material: 'Konfigurasi IP Static', notes: 'Selesai tepat waktu.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <History className="text-indigo-600" /> Jurnal Mengajar
          </h2>
          <p className="text-slate-500">Dokumentasi harian aktivitas Belajar Mengajar (KBM).</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Tambah Jurnal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="!p-0 overflow-hidden">
              <Table headers={['Tgl & Kelas', 'Materi', 'Catatan', 'Aksi']}>
                 {journals.map(j => (
                   <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                         <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{j.class}</p>
                         <p className="text-[10px] text-slate-400 font-mono mt-1">{j.date}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{j.subject}</p>
                         <p className="text-xs text-slate-500 mt-1">{j.material}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs text-slate-500 italic">"{j.notes}"</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit2 size={16} /></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </Table>
           </Card>
        </div>

        <Card title="Status Verifikasi" className="h-fit">
           <div className="space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-xl">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black uppercase text-emerald-600">Terverifikasi</p>
                    <CheckCircle size={14} className="text-emerald-500" />
                 </div>
                 <p className="text-sm font-bold text-emerald-900 dark:text-emerald-400">12 Jurnal disetujui</p>
                 <p className="text-[10px] text-emerald-600 mt-1">Minggu ini oleh Wakasek Kurikulum</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase text-slate-400">Statistik Jam Mengajar</h4>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-2xl font-black text-slate-900 dark:text-white">24/32</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Jam Terealisasi / Target</p>
                    </div>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Jurnal Mengajar Baru">
         <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kelas</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500">
                     <option>X RPL 1</option>
                     <option>XI TKJ 2</option>
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
                  <input className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="Ex: Pemrograman Dasar" />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400">Materi yang Disampaikan</label>
               <input className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="Ex: Instalasi IDE Visual Studio Code" />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400">Catatan Kejadian di Kelas</label>
               <textarea rows={3} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="Masukkan catatan khusus jika ada siswa bermasalah atau sarana rusak..."></textarea>
            </div>
            <Button className="w-full py-4 shadow-xl shadow-indigo-200">Simpan Jurnal & Kirim Verifikasi</Button>
         </form>
      </Modal>
    </div>
  );
};
