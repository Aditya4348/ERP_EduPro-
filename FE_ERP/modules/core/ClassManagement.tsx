
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button, Modal } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { DoorOpen, Plus, Search, Trash2, Edit2, Users, Eye } from 'lucide-react';

interface SchoolClass {
  id: string;
  name: string;
  major: string;
  grade: string;
  homeroomTeacher: string;
  studentCount: number;
}

const INITIAL_CLASSES: SchoolClass[] = [
  { id: '1', name: 'X RPL 1', major: 'Rekayasa Perangkat Lunak', grade: 'X', homeroomTeacher: 'Iwan Setiawan', studentCount: 36 },
  { id: '2', name: 'XI TKJ 2', major: 'Teknik Komputer Jaringan', grade: 'XI', homeroomTeacher: 'Maya Indah', studentCount: 32 },
  { id: '3', name: 'XII MM 1', major: 'Multimedia', grade: 'XII', homeroomTeacher: 'Dedi Kurniawan', studentCount: 34 },
];

export const ClassManagement: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useLocalStorage<SchoolClass[]>('edupro_classes', INITIAL_CLASSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <DoorOpen className="text-indigo-600" /> Kelas & Jurusan
          </h2>
          <p className="text-slate-500">Konfigurasi ruang kelas dan rombongan belajar.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Cari kelas..."
            className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Tambah Kelas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <Card key={c.id} className="relative overflow-hidden group hover:border-indigo-400 transition-all border-2 border-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <DoorOpen size={80} />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                  TINGKAT {c.grade}
                </span>
                <h3 className="text-2xl font-black text-slate-900">{c.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{c.major}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
               <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Users size={14} />
                  </div>
                  <span className="text-slate-600 font-medium">{c.studentCount} Siswa Terdaftar</span>
               </div>
               <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Edit2 size={14} />
                  </div>
                  <span className="text-slate-600">Wali: <strong>{c.homeroomTeacher}</strong></span>
               </div>
            </div>

            <div className="mt-6 flex gap-2">
               <button 
                onClick={() => navigate(`/core/classes/${c.id}`)}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
               >
                  <Eye size={14} /> Lihat Detail
               </button>
               <button className="px-3 py-2 bg-slate-50 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                  <Trash2 size={16} />
               </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
