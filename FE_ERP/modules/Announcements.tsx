
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Button, Modal } from '../components/UI';
import { Bell, Plus, Megaphone, Calendar, Users, Target, Trash2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: string;
  date: string;
  priority: 'Normal' | 'Urgent';
}

const INITIAL_NEWS: Announcement[] = [
  { id: '1', title: 'Libur Awal Ramadhan 1445H', content: 'Diberitahukan kepada seluruh siswa bahwa kegiatan KBM ditiadakan...', target: 'Seluruh Siswa', date: '2024-03-01', priority: 'Normal' },
  { id: '2', title: 'Rapat Persiapan Ujikom SMK', content: 'Mohon kehadiran seluruh Kaprog dan Guru Produktif pada jam 13:00...', target: 'Guru & Staff', date: '2024-03-05', priority: 'Urgent' },
];

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('edupro_news', INITIAL_NEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', target: 'Seluruh Siswa', priority: 'Normal' as const });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Announcement = { id: Date.now().toString(), ...formData, date: new Date().toISOString().split('T')[0] };
    setAnnouncements([newItem, ...announcements]);
    setIsModalOpen(false);
    setFormData({ title: '', content: '', target: 'Seluruh Siswa', priority: 'Normal' });
  };

  const deleteNews = (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="text-indigo-600" /> Pengumuman & Broadcast
          </h2>
          <p className="text-slate-500">Pusat informasi dan berita internal sekolah.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Buat Pengumuman
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.map((a) => (
          <Card key={a.id} className={`border-l-4 ${a.priority === 'Urgent' ? 'border-l-rose-500' : 'border-l-indigo-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${a.priority === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                   {a.priority}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar size={12} /> {a.date}
                </span>
              </div>
              <button onClick={() => deleteNews(a.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{a.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{a.content}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Target size={14} /> Target: <span className="text-slate-800">{a.target}</span>
               </div>
               <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Detail →</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Pengumuman Baru">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Judul Pengumuman</label>
            <input required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Target Audiens</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}>
                <option>Seluruh Siswa</option>
                <option>Guru & Staff</option>
                <option>Orang Tua</option>
                <option>Hanya Kelas X</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Prioritas</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Isi Pengumuman</label>
            <textarea required rows={4} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
          </div>
          <Button type="submit" className="w-full py-4 text-lg">Publikasikan Sekarang</Button>
        </form>
      </Modal>
    </div>
  );
};
