
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { INITIAL_TEACHERS } from '../constants';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';

interface Teacher {
  id: string;
  nip: string;
  name: string;
  subject: string;
  status: 'Aktif' | 'Cuti' | 'Non-Aktif';
}

export const MasterTeachers: React.FC = () => {
  const navigate = useNavigate();
  // Cast INITIAL_TEACHERS to any to bypass the type check for the 'status' property which is inferred as string in constants.tsx
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('edupro_teachers', INITIAL_TEACHERS as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ nip: '', name: '', subject: '', status: 'Aktif' as const });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = { id: Date.now().toString(), ...formData };
    setTeachers([...teachers, newTeacher]);
    setIsModalOpen(false);
  };

  const deleteTeacher = (id: string) => {
    if (confirm('Hapus data guru?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const filtered = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.nip.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Master Data Guru</h2>
          <p className="text-slate-500">Kelola informasi seluruh tenaga pendidik.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
              type="text" 
              placeholder="Cari NIP / Nama..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Tambah Guru
          </Button>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <Table headers={['NIP / NUPTK', 'Nama Lengkap', 'Mata Pelajaran', 'Status', 'Aksi']}>
          {filtered.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{t.nip}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] uppercase">
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{t.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{t.subject}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  t.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{t.status}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => navigate(`/core/teachers/${t.id}`)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTeacher(t.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Data Guru">
        <form onSubmit={handleAdd} className="space-y-4">
           <div>
             <label className="block text-xs font-black uppercase text-slate-400 mb-2">NIP/NUPTK</label>
             <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={e => setFormData({...formData, nip: e.target.value})} required />
           </div>
           <div>
             <label className="block text-xs font-black uppercase text-slate-400 mb-2">Nama Lengkap</label>
             <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={e => setFormData({...formData, name: e.target.value})} required />
           </div>
           <div>
             <label className="block text-xs font-black uppercase text-slate-400 mb-2">Mata Pelajaran Utama</label>
             <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={e => setFormData({...formData, subject: e.target.value})} required />
           </div>
           <Button type="submit" className="w-full py-3">Simpan Data Guru</Button>
        </form>
      </Modal>
      <HelpGuide guideId="master-teachers" />
    </div>
  );
};
