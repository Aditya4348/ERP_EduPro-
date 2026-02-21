
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { INITIAL_STUDENTS } from '../constants';
import { Eye, Plus, Search, Trash2, FileUp, FileDown, CheckCircle2 } from 'lucide-react';

interface Student {
  id: string;
  nis: string;
  name: string;
  grade: string;
  major: string;
}

export const MasterStudents: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useLocalStorage<Student[]>('edupro_students', INITIAL_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ nis: '', name: '', grade: 'X', major: 'RPL' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Date.now().toString(),
      ...formData
    };
    setStudents([...students, newStudent]);
    setIsModalOpen(false);
    setFormData({ nis: '', name: '', grade: 'X', major: 'RPL' });
  };

  const handleImport = () => {
    alert('Simulasi Import Berhasil! 50 Data baru ditambahkan.');
    setIsImportModalOpen(false);
  };

  const deleteStudent = (id: string) => {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <Breadcrumbs />
      <HelpGuide guideId="master-students" />
      
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Master Data Siswa</h2>
          <p className="text-slate-500 dark:text-slate-400">Kelola informasi seluruh peserta didik aktif.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
             <FileUp size={16} /> Import Excel
          </Button>
          <Button variant="secondary">
             <FileDown size={16} /> Export Data
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
             <Plus size={18} /> Tambah Siswa
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
           <input 
            type="text" 
            placeholder="Cari NIS / Nama / NISN..."
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all w-full text-slate-900 dark:text-slate-100 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <select className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none">
              <option>Semua Kelas</option>
              <option>Tingkat X</option>
              <option>Tingkat XI</option>
              <option>Tingkat XII</option>
           </select>
           <select className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none">
              <option>Seluruh Status</option>
              <option>Aktif</option>
              <option>Alumni</option>
              <option>Mutasi</option>
           </select>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <Table headers={['NIS', 'Nama Lengkap', 'Tingkat', 'Jurusan', 'Kelengkapan', 'Aksi']}>
          {filtered.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{s.nis}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase transition-colors duration-300">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{s.grade}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">{s.major}</span>
              </td>
              <td className="px-6 py-4">
                 <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600">
                    <CheckCircle2 size={12} /> 100%
                 </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => navigate(`/core/students/${s.id}`)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    title="Lihat Detail"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => deleteStudent(s.id)} 
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Data via Excel">
         <div className="space-y-6">
            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
               <p className="text-sm text-indigo-900 font-medium">Panduan Batch Import:</p>
               <ol className="text-xs text-indigo-700 list-decimal list-inside mt-2 space-y-1">
                  <li>Unduh template file Excel resmi kami.</li>
                  <li>Isi data sesuai kolom yang tersedia (Jangan ubah header).</li>
                  <li>Unggah kembali file yang telah diisi.</li>
               </ol>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
               <FileUp size={48} className="mx-auto text-slate-300 group-hover:text-indigo-600 transition-colors mb-4" />
               <p className="font-bold text-slate-700">Tarik file Excel ke sini</p>
               <p className="text-xs text-slate-400 mt-1">Hanya file .xlsx atau .csv (Maks 10MB)</p>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary" className="flex-1">Unduh Template</Button>
               <Button onClick={handleImport} className="flex-1">Eksekusi Import</Button>
            </div>
         </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Siswa Baru">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">NIS</label>
                <input required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:border-indigo-500 transition-colors duration-300" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Kelas</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:border-indigo-500 transition-colors duration-300" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                   <option>X</option><option>XI</option><option>XII</option>
                </select>
             </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Nama Lengkap</label>
            <input required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:border-indigo-500 transition-colors duration-300" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Jurusan (Kode: RPL/TKJ/MM)</label>
            <input required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:border-indigo-500 transition-colors duration-300" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value.toUpperCase()})} placeholder="Contoh: RPL" />
          </div>
          <div className="pt-4 flex gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
             <Button type="submit" className="flex-1">Simpan Data</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
