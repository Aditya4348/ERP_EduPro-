
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  Dribbble, Plus, Search, Users, 
  Calendar, Award, TrendingUp, Trophy, 
  ChevronRight, Filter, MoreVertical, 
  CheckCircle2, Clock, MapPin, Star,
  Music, Camera, Cpu, Heart, BookOpen,
  Trash2, X, GraduationCap
} from 'lucide-react';
import { Extracurricular as EskulType, EskulAchievement } from '../../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const INITIAL_ESKULS: EskulType[] = [
  { id: 'e1', name: 'Pramuka', category: 'Wajib', coach: 'Siti Aminah, M.Pd', schedule: 'Jumat, 14:00', location: 'Lapangan Utama', memberCount: 350, description: 'Pengembangan karakter dan kepanduan.', status: 'Aktif' },
  { id: 'e2', name: 'Robotik', category: 'Sains', coach: 'Bambang S, S.Kom', schedule: 'Sabtu, 09:00', location: 'Lab Komputer 2', memberCount: 45, description: 'Eksplorasi teknologi dan programming.', status: 'Aktif' },
  { id: 'e3', name: 'Basket', category: 'Olahraga', coach: 'Heri Susanto', schedule: 'Rabu, 15:30', location: 'Gor Sekolah', memberCount: 62, description: 'Klub basket putra dan putri.', status: 'Aktif' },
  { id: 'e4', name: 'Seni Tari', category: 'Seni', coach: 'Maya Indah', schedule: 'Kamis, 15:00', location: 'Aula Utama', memberCount: 28, description: 'Pelestarian tari tradisional dan modern.', status: 'Aktif' },
];

const INITIAL_ACHIEVEMENTS: EskulAchievement[] = [
  { id: 'ac1', title: 'Juara 1 LKS Nasional', eskulName: 'Robotik', rank: 'Juara 1', level: 'Nasional', date: '2024-01-15' },
  { id: 'ac2', title: 'Medali Emas O2SN', eskulName: 'Basket', rank: 'Emas', level: 'Provinsi', date: '2024-02-10' },
];

const CHART_DATA = [
  { name: 'Jan', active: 400, awards: 2 },
  { name: 'Feb', active: 420, awards: 5 },
  { name: 'Mar', active: 450, awards: 1 },
  { name: 'Apr', active: 480, awards: 4 },
];

export const Extracurricular: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'clubs' | 'awards' | 'enrollment'>('clubs');
  const [eskuls, setEskuls] = useLocalStorage<EskulType[]>('edupro_eskuls', INITIAL_ESKULS);
  const [awards, setAwards] = useLocalStorage<EskulAchievement[]>('edupro_eskul_awards', INITIAL_ACHIEVEMENTS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEskuls = useMemo(() => {
    return eskuls.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [eskuls, searchTerm]);

  const handleAddEskul = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEskul: EskulType = {
      id: `e${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      coach: formData.get('coach') as string,
      schedule: 'Senin, 15:00', // Default
      location: 'Kampus Utama', // Default
      memberCount: 0,
      description: formData.get('description') as string,
      status: 'Aktif'
    };
    setEskuls([...eskuls, newEskul]);
    setIsModalOpen(false);
  };

  const handleAddAward = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAward: EskulAchievement = {
      id: `ac${Date.now()}`,
      title: formData.get('title') as string,
      eskulName: formData.get('eskulName') as string,
      rank: formData.get('rank') as string,
      level: formData.get('level') as any,
      date: formData.get('date') as string,
    };
    setAwards([newAward, ...awards]);
    setIsAwardModalOpen(false);
  };

  const handleDeleteEskul = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Hapus klub ekstrakurikuler ini? Seluruh data anggota akan ikut terhapus.')) {
      setEskuls(eskuls.filter(eskul => eskul.id !== id));
    }
  };

  const getIconForEskul = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('robot')) return <Cpu size={24} />;
    if (n.includes('tari') || n.includes('seni')) return <Music size={24} />;
    if (n.includes('basket') || n.includes('olahraga')) return <Dribbble size={24} />;
    if (n.includes('fotografi')) return <Camera size={24} />;
    return <Heart size={24} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Dribbble size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ekstrakurikuler</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Pusat Minat & Bakat Siswa • Digital Management</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => alert('Fitur Rekap Nilai Nasional Siap!')}>
              <BookOpen size={18} /> Rekap Nilai
           </Button>
           <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Daftarkan Klub Baru
           </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 !p-0 overflow-hidden shadow-xl">
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                 <h4 className="font-black text-slate-800 dark:text-white">Tren Keaktifan Siswa</h4>
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Data Partisipasi Eskul 2024</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Siswa Aktif</span>
                 </div>
              </div>
           </div>
           <div className="h-64 w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={CHART_DATA}>
                    <defs>
                       <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
              <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Prestasi Tahun Ini</p>
              <p className="text-5xl font-black mt-2">{awards.length}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                 <Star size={14} className="text-amber-400" /> Top Performer: Robotik
              </div>
           </Card>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
        {[
          { id: 'clubs', label: 'Katalog Klub', icon: <TrendingUp size={16} /> },
          { id: 'awards', label: 'Arsip Prestasi', icon: <Trophy size={16} /> },
          { id: 'enrollment', label: 'Pendaftaran Siswa', icon: <Users size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl shadow-indigo-500/10' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW: CLUBS */}
      {activeTab === 'clubs' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari nama eskul atau pembina..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
             </div>
             <div className="flex gap-2 w-full md:w-auto">
                <Button variant="secondary" className="!py-2 !px-4 text-[10px] font-black uppercase tracking-widest"><Filter size={14} /> Filter</Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEskuls.map(eskul => (
              <Card 
                key={eskul.id} 
                onClick={() => navigate(`/student-affairs/extracurricular/${eskul.id}`)}
                className="group relative overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all shadow-xl hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all">
                  {getIconForEskul(eskul.name)}
                </div>
                <div className="flex flex-col h-full">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
                         {getIconForEskul(eskul.name)}
                      </div>
                      <div className="flex gap-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          eskul.category === 'Wajib' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {eskul.category}
                        </span>
                        <button onClick={(e) => handleDeleteEskul(e, eskul.id)} className="p-1 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 size={14} />
                        </button>
                      </div>
                   </div>
                   
                   <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1">{eskul.name}</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-6 italic line-clamp-2">"{eskul.description}"</p>
                   
                   <div className="mt-auto space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                         <Users size={14} className="text-slate-400" />
                         <span className="font-bold text-slate-700 dark:text-slate-200">{eskul.memberCount} Anggota Aktif</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                         <Clock size={14} className="text-slate-400" />
                         <span className="font-medium text-slate-600 dark:text-slate-400">{eskul.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                         <MapPin size={14} className="text-slate-400" />
                         <span className="font-medium text-slate-600 dark:text-slate-400">{eskul.location}</span>
                      </div>
                   </div>

                   <div className="mt-6 flex justify-end">
                      <span className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Kelola Ekskul <ChevronRight size={12} /></span>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          <div className="flex justify-end">
             <Button onClick={() => setIsAwardModalOpen(true)}>
                <Trophy size={16} /> Catat Prestasi Baru
             </Button>
          </div>
          <Card className="!p-0 overflow-hidden shadow-xl">
            <Table headers={['ID', 'Judul Prestasi', 'Bidang Eskul', 'Tingkat', 'Tanggal', 'Aksi']}>
                {awards.map(aw => (
                  <tr key={aw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{aw.id.slice(-3)}</td>
                    <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{aw.title}</p>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase">{aw.rank}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{aw.eskulName}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                          {aw.level}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{aw.date}</td>
                    <td className="px-6 py-4">
                        <button onClick={() => setAwards(awards.filter(a => a.id !== aw.id))} className="text-slate-300 hover:text-rose-600">
                           <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
            </Table>
          </Card>
        </div>
      )}

      {/* VIEW: ENROLLMENT (SIMULATION) */}
      {activeTab === 'enrollment' && (
        <Card title="Pendaftaran Ekskul Digital">
           <p className="text-sm text-slate-500 mb-8 leading-relaxed">Siswa dapat mendaftar secara mandiri melalui portal ini. Sebagai Admin, Anda dapat menyimulasikan pendaftaran ke klub yang diminati.</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eskuls.map(eskul => (
                <div key={eskul.id} className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl flex justify-between items-center group hover:border-indigo-400 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                         {getIconForEskul(eskul.name)}
                      </div>
                      <div>
                         <h5 className="font-black text-slate-800 dark:text-white">{eskul.name}</h5>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{eskul.category} • {eskul.memberCount} Siswa</p>
                      </div>
                   </div>
                   <Button variant="secondary" className="!py-2 !px-4 text-[10px] font-black uppercase" onClick={() => alert(`Simulasi: Pendaftaran Siswa ke ${eskul.name} Berhasil!`)}>Daftar Sekarang</Button>
                </div>
              ))}
           </div>
        </Card>
      )}

      {/* Modal: New Club */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Daftarkan Ekstrakurikuler Baru">
         <form className="space-y-6" onSubmit={handleAddEskul}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Eskul / Klub</label>
               <input name="name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" placeholder="Contoh: English Club" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kategori</label>
                  <select name="category" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Olahraga">Olahraga</option>
                     <option value="Seni">Seni</option>
                     <option value="Sains">Sains</option>
                     <option value="Wajib">Wajib</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pembina / Pelatih</label>
                  <input name="coach" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Nama pengajar..." />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Visi & Deskripsi Singkat</label>
               <textarea name="description" rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" placeholder="Tuliskan tujuan klub ini..."></textarea>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20">Publikasikan Katalog Ekskul</Button>
         </form>
      </Modal>

      {/* Modal: Add Award */}
      <Modal isOpen={isAwardModalOpen} onClose={() => setIsAwardModalOpen(false)} title="Catat Prestasi Baru">
         <form className="space-y-6" onSubmit={handleAddAward}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Kejuaraan / Judul Prestasi</label>
               <input name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none" placeholder="Ex: Juara 1 Olimpiade Robotik" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Eskul Pelaksana</label>
                  <select name="eskulName" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     {eskuls.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Peringkat / Predikat</label>
                  <input name="rank" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Medali Emas" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tingkat</label>
                  <select name="level" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Kecamatan">Kecamatan</option>
                     <option value="Kota">Kota/Kabupaten</option>
                     <option value="Provinsi">Provinsi</option>
                     <option value="Nasional">Nasional</option>
                     <option value="Internasional">Internasional</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal Pencapaian</label>
                  <input name="date" type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={new Date().toISOString().split('T')[0]} />
               </div>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-amber-500/20 bg-amber-600 hover:bg-amber-700">Simpan di Brankas Prestasi</Button>
         </form>
      </Modal>
    </div>
  );
};
