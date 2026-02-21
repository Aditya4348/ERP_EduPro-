
import React, { useState } from 'react';
import { Card, Button, Modal } from '@/components/UI';
import { HelpGuide } from '@/components/HelpGuide';

interface Material {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  type: 'PDF' | 'Video' | 'Quiz';
  date: string;
}

const INITIAL_MATERIALS: Material[] = [
  { id: '1', title: 'Pemrograman Dasar - Variabel', subject: 'RPL', teacher: 'Iwan Setiawan', type: 'PDF', date: '2024-02-01' },
  { id: '2', title: 'Tutorial Jaringan LAN', subject: 'TKJ', teacher: 'Siti Aminah', type: 'Video', date: '2024-02-03' },
];

export const AcademicLMS: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Learning Management System</h2>
          <p className="text-slate-500">Akses materi pembelajaran dan tugas siswa.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Unggah Materi Baru</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <Card key={m.id} className="relative group cursor-pointer hover:border-indigo-500 transition-colors">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              m.type === 'PDF' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h4 className="font-bold text-slate-800 line-clamp-1">{m.title}</h4>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{m.subject} • {m.teacher}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{m.type}</span>
              <span className="text-[10px] text-slate-400">{m.date}</span>
            </div>
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all rounded-xl" />
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Unggah Materi Pembelajaran">
        <div className="space-y-4">
           <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-slate-600 font-medium">Klik atau tarik file ke sini</p>
              <p className="text-xs text-slate-400 mt-1">PDF, MP4, atau ZIP (Maks 50MB)</p>
           </div>
           <Button className="w-full" onClick={() => setIsModalOpen(false)}>Simpan Materi</Button>
        </div>
      </Modal>

      <HelpGuide guideId="academic-lms" />
    </div>
  );
};
