
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button, Modal } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  LayoutGrid, Plus, Trash2, ArrowLeft, 
  Info, ListChecks, Edit3, Save, 
  ChevronRight, Sparkles, BookOpen, 
  ShieldCheck, HelpCircle
} from 'lucide-react';
import { OSISSection } from '../../types';

const INITIAL_SECTIONS: OSISSection[] = [
  { id: '1', name: 'Inti', description: 'Pengurus harian inti yang bertanggung jawab atas koordinasi seluruh kegiatan OSIS.', jobdesk: ['Memimpin rapat', 'Koordinasi eksternal', 'Manajemen administrasi'] },
  { id: '2', name: 'Sekbid 1 - Ketaqwaan', description: 'Bidang pembinaan ketaqwaan terhadap Tuhan Yang Maha Esa.', jobdesk: ['Kegiatan keagamaan harian', 'Peringatan hari besar agama', 'Pembinaan rohani'] },
  { id: '3', name: 'Sekbid 2 - Bela Negara', description: 'Bidang pembinaan kesadaran bela negara dan disiplin.', jobdesk: ['Latihan kepemimpinan', 'Upacara bendera', 'Disiplin siswa'] },
  { id: '4', name: 'Sekbid 3 - Kewirausahaan', description: 'Bidang pembinaan kreativitas, keterampilan dan kewirausahaan.', jobdesk: ['Koperasi siswa', 'Bazar sekolah', 'Produksi kreatif'] },
  { id: '5', name: 'MPK', description: 'Majelis Perwakilan Kelas yang bertugas mengawasi kinerja OSIS.', jobdesk: ['Rapat pleno', 'Pengawasan proker', 'Evaluasi pengurus'] },
];

export const OSISSections: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useLocalStorage<OSISSection[]>('edupro_osis_sections', INITIAL_SECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<OSISSection, 'id'>>({
    name: '',
    description: '',
    jobdesk: []
  });
  
  const [tempJobdesk, setTempJobdesk] = useState('');

  const handleOpenModal = (section?: OSISSection) => {
    if (section) {
      setEditingId(section.id);
      setFormData({
        name: section.name,
        description: section.description,
        jobdesk: section.jobdesk
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', jobdesk: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSections(sections.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      const newSection: OSISSection = {
        id: `s${Date.now()}`,
        ...formData
      };
      setSections([...sections, newSection]);
    }
    setIsModalOpen(false);
  };

  const addJobdesk = () => {
    if (!tempJobdesk) return;
    setFormData({ ...formData, jobdesk: [...formData.jobdesk, tempJobdesk] });
    setTempJobdesk('');
  };

  const removeJobdesk = (index: number) => {
    setFormData({ ...formData, jobdesk: formData.jobdesk.filter((_, i) => i !== index) });
  };

  const deleteSection = (id: string) => {
    if (confirm('Yakin ingin menghapus Seksi Bidang ini? Data pengurus di bidang ini mungkin perlu disesuaikan.')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Manajemen Seksi Bidang</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Konfigurasi Struktur & Pembagian Tugas OSIS/MPK</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Sekbid Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <Card key={section.id} className="relative group overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all shadow-xl flex flex-col h-full">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                <LayoutGrid size={80} />
             </div>
             
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                   {section.name.charAt(0)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenModal(section)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100" title="Edit"><Edit3 size={16} /></button>
                   <button onClick={() => deleteSection(section.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100" title="Hapus"><Trash2 size={16} /></button>
                </div>
             </div>

             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{section.name}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3 italic">
                "{section.description}"
             </p>

             <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <ListChecks size={14} /> Daftar Jobdesk / Tugas:
                   </p>
                   <ul className="space-y-1.5">
                      {section.jobdesk.map((job, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                           <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                           {job}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </Card>
        ))}
        
        <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center py-20 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer group" onClick={() => handleOpenModal()}>
           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all mb-4">
              <Plus size={32} />
           </div>
           <p className="font-black uppercase tracking-widest text-xs">Tambah Seksi Bidang</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck size={120} />
            </div>
            <h4 className="text-xl font-black mb-4">Pentingnya Struktur Sekbid</h4>
            <p className="text-sm text-indigo-100 leading-relaxed max-w-md">Struktur yang jelas membantu OSIS dalam mendistribusikan tanggung jawab secara adil. Pastikan setiap jobdesk sudah didiskusikan dengan Pembina OSIS.</p>
            <Button variant="secondary" className="mt-8 !bg-white !text-indigo-600 shadow-xl" onClick={() => window.open('https://id.wikipedia.org/wiki/Organisasi_Siswa_Intra_Sekolah', '_blank')}>
               <HelpCircle size={16} /> Pelajari Standar Nasional
            </Button>
         </Card>

         <Card title="Tips Mengatur Jobdesk">
            <div className="space-y-4">
               {[
                 { title: 'Spesifik & Terukur', desc: 'Gunakan kata kerja aktif seperti "Mengelola", "Membuat", atau "Mengoordinasi".' },
                 { title: 'Tugas Rutin vs Event', desc: 'Bedakan antara tugas harian seksi bidang dengan tugas khusus saat ada acara.' },
                 { title: 'Kolaborasi Antar Bidang', desc: 'Cantumkan poin kerjasama jika tugas tersebut melibatkan seksi bidang lain.' },
               ].map((tip, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-indigo-600 font-bold text-xs">0{i+1}</div>
                    <div>
                       <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">{tip.title}</h5>
                       <p className="text-xs text-slate-500">{tip.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Seksi Bidang' : 'Buat Seksi Bidang Baru'}>
         <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Seksi Bidang / Divisi</label>
               <input 
                  required 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" 
                  placeholder="Contoh: Sekbid 4 - Kesenian"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Deskripsi Penjelasan (Fokus Bidang)</label>
               <textarea 
                  required 
                  rows={3} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all" 
                  placeholder="Jelaskan fokus utama dari bidang ini..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
               />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-slate-400">Pengaturan Jobdesk (List Tugas)</label>
               <div className="flex gap-2">
                  <input 
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500" 
                    placeholder="Masukkan satu butir tugas..."
                    value={tempJobdesk}
                    onChange={e => setTempJobdesk(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addJobdesk())}
                  />
                  <Button type="button" variant="secondary" onClick={addJobdesk}><Plus size={18} /></Button>
               </div>
               
               <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.jobdesk.map((job, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group">
                       <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{job}</span>
                       <button type="button" onClick={() => removeJobdesk(idx)} className="text-slate-300 hover:text-rose-500"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  {formData.jobdesk.length === 0 && (
                    <p className="text-center py-4 text-xs text-slate-400 italic">Belum ada jobdesk yang ditambahkan.</p>
                  )}
               </div>
            </div>

            <div className="pt-4 flex gap-3">
               <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Batal</Button>
               <Button type="submit" className="flex-[2] py-4 shadow-xl shadow-indigo-200">
                  <Save size={18} /> Simpan Struktur Sekbid
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};
