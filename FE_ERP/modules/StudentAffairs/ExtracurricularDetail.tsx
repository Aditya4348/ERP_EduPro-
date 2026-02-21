
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button, Modal, Table } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  ArrowLeft, Users, Calendar, Award, 
  Settings, CheckCircle2, Plus, Trash2, 
  History, Star, Info, LayoutGrid,
  ClipboardCheck, Clock, ShieldCheck, Edit3,
  UserPlus, FileSpreadsheet, Sparkles,
  ChevronRight, MapPin, X, Wallet, Box,
  ListChecks, TrendingUp, ArrowUpRight, ArrowDownRight,
  UserRound, GraduationCap, Save
} from 'lucide-react';
import { 
  Extracurricular, EskulMember, EskulSession, 
  EskulProgram, EskulFinanceLog, EskulAsset 
} from '../../types';

const MOCK_MEMBERS: EskulMember[] = [
  { id: 'm1', studentId: 's1', studentName: 'Ahmad Faisal', className: 'XI RPL 1', joinDate: '2023-07-15', role: 'Ketua', grade: 'A' },
  { id: 'm2', studentId: 's2', studentName: 'Budi Santoso', className: 'X TKJ 2', joinDate: '2023-08-01', role: 'Anggota', grade: 'B' },
  { id: 'm3', studentId: 's3', studentName: 'Citra Dewi', className: 'XI MM 1', joinDate: '2023-07-20', role: 'Sekretaris', grade: 'A' },
];

export const ExtracurricularDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'org' | 'proker' | 'attendance' | 'finance' | 'assets' | 'grading' | 'settings'>('overview');
  
  // Base Data States
  const [eskuls, setEskuls] = useLocalStorage<Extracurricular[]>('edupro_eskuls', []);
  const eskul = useMemo(() => eskuls.find(e => e.id === id), [eskuls, id]);
  
  // Feature Specific Persistence
  const [members, setMembers] = useLocalStorage<EskulMember[]>(`edupro_eskul_members_${id}`, MOCK_MEMBERS);
  const [sessions, setSessions] = useLocalStorage<EskulSession[]>(`edupro_eskul_sessions_${id}`, []);
  const [prokers, setProkers] = useLocalStorage<EskulProgram[]>(`edupro_eskul_proker_${id}`, []);
  const [finances, setFinances] = useLocalStorage<EskulFinanceLog[]>(`edupro_eskul_finance_${id}`, []);
  const [assets, setAssets] = useLocalStorage<EskulAsset[]>(`edupro_eskul_assets_${id}`, []);

  // UI States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isProkerModalOpen, setIsProkerModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // Sync member count
  useEffect(() => {
    if (eskul && members.length !== eskul.memberCount) {
      setEskuls(eskuls.map(e => e.id === id ? { ...e, memberCount: members.length } : e));
    }
  }, [members, id]);

  if (!eskul) return (
    <div className="p-12 text-center">
       <p className="text-slate-500 font-bold italic">Memuat atau Klub tidak ditemukan...</p>
       <Button onClick={() => navigate('/student-affairs/extracurricular')} className="mt-4 mx-auto">Kembali</Button>
    </div>
  );

  // Computed Values
  const financeStats = useMemo(() => {
    const masuk = finances.filter(f => f.type === 'Masuk').reduce((acc, curr) => acc + curr.amount, 0);
    const keluar = finances.filter(f => f.type === 'Keluar').reduce((acc, curr) => acc + curr.amount, 0);
    return { masuk, keluar, saldo: masuk - keluar };
  }, [finances]);

  const pengurusInti = {
    ketua: members.find(m => m.role === 'Ketua'),
    sekretaris: members.find(m => m.role === 'Sekretaris'),
    bendahara: members.find(m => m.role === 'Bendahara')
  };

  // Handlers
  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMember: EskulMember = {
      id: `m${Date.now()}`,
      studentId: `s${Date.now()}`,
      studentName: formData.get('name') as string,
      className: formData.get('class') as string,
      joinDate: new Date().toISOString().split('T')[0],
      role: formData.get('role') as any || 'Anggota',
      grade: 'B'
    };
    setMembers([newMember, ...members]);
    setIsMemberModalOpen(false);
  };

  const handleAddProker = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProker: EskulProgram = {
      id: `pr${Date.now()}`,
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      status: 'Rencana',
      description: formData.get('description') as string
    };
    setProkers([newProker, ...prokers]);
    setIsProkerModalOpen(false);
  };

  const handleAddFinance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: EskulFinanceLog = {
      id: `f${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      type: formData.get('type') as any
    };
    setFinances([newLog, ...finances]);
    setIsFinanceModalOpen(false);
  };

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAsset: EskulAsset = {
      id: `as${Date.now()}`,
      name: formData.get('name') as string,
      qty: Number(formData.get('qty')),
      condition: formData.get('condition') as any
    };
    setAssets([...assets, newAsset]);
    setIsAssetModalOpen(false);
  };

  const updateEskulSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...eskul,
      schedule: formData.get('schedule') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      coach: formData.get('coach') as string
    };
    setEskuls(eskuls.map(e => e.id === id ? updated : e));
    alert('Pengaturan eskul berhasil diperbarui!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700">
                 {eskul.category}
               </span>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">AKTIF • {eskul.memberCount} ANGGOTA</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{eskul.name}</h2>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => setIsMemberModalOpen(true)}>
              <UserPlus size={18} /> Anggota Baru
           </Button>
           <Button onClick={() => setIsSessionModalOpen(true)}>
              <Plus size={18} /> Catat Latihan
           </Button>
        </div>
      </div>

      {/* Navigation Tabs - Horizontal Scrollable on Mobile */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full overflow-x-auto custom-scrollbar whitespace-nowrap">
        {[
          { id: 'overview', label: 'Ringkasan', icon: <LayoutGrid size={16} /> },
          { id: 'members', label: 'Anggota', icon: <Users size={16} /> },
          { id: 'org', label: 'Struktur', icon: <UserRound size={16} /> },
          { id: 'proker', label: 'Proker', icon: <ListChecks size={16} /> },
          { id: 'attendance', label: 'Absensi', icon: <History size={16} /> },
          { id: 'finance', label: 'Kas Eskul', icon: <Wallet size={16} /> },
          { id: 'assets', label: 'Aset/Alat', icon: <Box size={16} /> },
          { id: 'grading', label: 'Nilai Rapor', icon: <Star size={16} /> },
          { id: 'settings', label: 'Pengaturan', icon: <Settings size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-lg' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Side */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* TAB: OVERVIEW */}
           {activeTab === 'overview' && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card title="Info Pembinaan">
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">{eskul.coach.charAt(0)}</div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-black">Pembina</p><p className="text-sm font-bold">{eskul.coach}</p></div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-black">Jadwal</p><p className="text-sm font-bold">{eskul.schedule}</p></div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><MapPin size={20} /></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-black">Lokasi</p><p className="text-sm font-bold">{eskul.location}</p></div>
                         </div>
                      </div>
                   </Card>
                   <Card className="bg-indigo-600 text-white border-none shadow-xl flex flex-col justify-center text-center p-8">
                      <TrendingUp className="mx-auto opacity-20 mb-4" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Keaktifan Rata-rata</p>
                      <p className="text-5xl font-black mt-2">92%</p>
                   </Card>
                </div>
                <Card title="Proker Terdekat">
                   <div className="space-y-3">
                      {prokers.slice(0, 2).map(p => (
                        <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700">
                           <div>
                              <p className="text-sm font-black">{p.title}</p>
                              <p className="text-xs text-slate-500">{p.date}</p>
                           </div>
                           <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg">{p.status}</span>
                        </div>
                      ))}
                      {prokers.length === 0 && <p className="text-center py-6 text-slate-400 text-sm italic">Belum ada program kerja yang direncanakan.</p>}
                   </div>
                </Card>
             </div>
           )}

           {/* TAB: ORGANISASI */}
           {activeTab === 'org' && (
             <div className="space-y-8">
                <div className="flex flex-col items-center gap-12 py-10">
                   {/* Ketua */}
                   <div className="text-center space-y-4">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Ketua Eskul</p>
                      <div className="w-24 h-24 bg-indigo-600 rounded-[32px] mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                         {pengurusInti.ketua?.studentName.charAt(0) || '?'}
                      </div>
                      <h4 className="text-lg font-black">{pengurusInti.ketua?.studentName || 'Belum Ditentukan'}</h4>
                      <p className="text-xs text-slate-500 font-bold">{pengurusInti.ketua?.className || '-'}</p>
                   </div>

                   {/* Sekretaris & Bendahara */}
                   <div className="grid grid-cols-2 gap-20 relative before:absolute before:top-[-40px] before:left-1/2 before:-translate-x-1/2 before:w-[80%] before:h-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      <div className="text-center space-y-3">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sekretaris</p>
                         <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-400 text-xl font-black">
                            {pengurusInti.sekretaris?.studentName.charAt(0) || '?'}
                         </div>
                         <h5 className="text-sm font-bold">{pengurusInti.sekretaris?.studentName || 'Belum Ada'}</h5>
                      </div>
                      <div className="text-center space-y-3">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bendahara</p>
                         <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-400 text-xl font-black">
                            {pengurusInti.bendahara?.studentName.charAt(0) || '?'}
                         </div>
                         <h5 className="text-sm font-bold">{pengurusInti.bendahara?.studentName || 'Belum Ada'}</h5>
                      </div>
                   </div>
                </div>
                <Card title="Assign Jabatan">
                   <p className="text-xs text-slate-500 mb-4">Ubah jabatan anggota di Tab 'Anggota' untuk memperbarui struktur ini.</p>
                   <Button variant="secondary" onClick={() => setActiveTab('members')}>Ke Daftar Anggota</Button>
                </Card>
             </div>
           )}

           {/* TAB: PROKER */}
           {activeTab === 'proker' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Program Kerja Strategis</h3>
                   <Button onClick={() => setIsProkerModalOpen(true)} className="!py-1.5 text-[10px]"><Plus size={14} /> Tambah Proker</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {prokers.map(p => (
                     <Card key={p.id} className="group hover:border-indigo-500 transition-all border-2 border-transparent">
                        <div className="flex justify-between items-start mb-3">
                           <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase rounded-md">{p.date}</span>
                           <button onClick={() => setProkers(prokers.filter(x => x.id !== p.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={14} /></button>
                        </div>
                        <h4 className="font-black text-slate-800 dark:text-white">{p.title}</h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{p.description}"</p>
                        <div className="mt-4 flex justify-between items-center">
                           <select 
                            value={p.status} 
                            onChange={(e) => setProkers(prokers.map(x => x.id === p.id ? {...x, status: e.target.value as any} : x))}
                            className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black border-none rounded-lg px-2 py-1 outline-none"
                           >
                              <option>Rencana</option><option>Berjalan</option><option>Selesai</option>
                           </select>
                        </div>
                     </Card>
                   ))}
                   {prokers.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 italic border-2 border-dashed border-slate-100 rounded-3xl">Belum ada proker terdaftar.</div>}
                </div>
             </div>
           )}

           {/* TAB: KEUANGAN */}
           {activeTab === 'finance' && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                      <p className="text-[10px] font-black text-emerald-600 uppercase">Total Masuk</p>
                      <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">Rp {financeStats.masuk.toLocaleString()}</p>
                   </Card>
                   <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800">
                      <p className="text-[10px] font-black text-rose-600 uppercase">Total Keluar</p>
                      <p className="text-xl font-black text-rose-700 dark:text-rose-400">Rp {financeStats.keluar.toLocaleString()}</p>
                   </Card>
                   <Card className="bg-indigo-600 text-white border-none shadow-xl">
                      <p className="text-[10px] font-black text-indigo-200 uppercase">Saldo Kas</p>
                      <p className="text-xl font-black">Rp {financeStats.saldo.toLocaleString()}</p>
                   </Card>
                </div>
                <Card className="!p-0 overflow-hidden">
                   <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                      <h4 className="font-black text-sm uppercase">Log Transaksi Kas</h4>
                      <Button onClick={() => setIsFinanceModalOpen(true)} className="!py-1.5 text-[10px]"><Plus size={14} /> Catat Transaksi</Button>
                   </div>
                   <Table headers={['Tgl', 'Deskripsi', 'Tipe', 'Nominal', 'Aksi']}>
                      {finances.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                           <td className="px-6 py-4 text-xs font-mono text-slate-400">{f.date}</td>
                           <td className="px-6 py-4 text-sm font-bold">{f.description}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${f.type === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                 {f.type}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm font-black">Rp {f.amount.toLocaleString()}</td>
                           <td className="px-6 py-4"><button onClick={() => setFinances(finances.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                   </Table>
                </Card>
             </div>
           )}

           {/* TAB: ASSETS */}
           {activeTab === 'assets' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Inventaris Barang & Alat</h3>
                   <Button onClick={() => setIsAssetModalOpen(true)} className="!py-1.5 text-[10px]"><Plus size={14} /> Tambah Aset</Button>
                </div>
                <Card className="!p-0 overflow-hidden">
                   <Table headers={['Nama Barang', 'Qty', 'Kondisi', 'Aksi']}>
                      {assets.map(a => (
                        <tr key={a.id}>
                           <td className="px-6 py-4 font-bold text-sm">{a.name}</td>
                           <td className="px-6 py-4 text-sm font-mono">{a.qty} Unit</td>
                           <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                a.condition === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                                a.condition === 'Rusak' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                              }`}>{a.condition}</span>
                           </td>
                           <td className="px-6 py-4"><button onClick={() => setAssets(assets.filter(x => x.id !== a.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                      {assets.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada aset terdaftar.</td></tr>}
                   </Table>
                </Card>
             </div>
           )}

           {/* TAB: SETTINGS */}
           {activeTab === 'settings' && (
             <Card title="Pengaturan Ekstrakurikuler">
                <form onSubmit={updateEskulSettings} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Hari Latihan Tetap</label>
                         <input name="schedule" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={eskul.schedule} placeholder="Ex: Senin & Kamis, 15:30" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Lokasi Latihan Rutin</label>
                         <input name="location" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={eskul.location} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Nama Pembina / Pelatih Utama</label>
                      <input name="coach" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={eskul.coach} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Deskripsi / Visi Eskul</label>
                      <textarea name="description" rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" defaultValue={eskul.description}></textarea>
                   </div>
                   <Button type="submit" className="w-full py-4 shadow-xl shadow-indigo-500/20"><Save size={18} /> Simpan Perubahan Konfigurasi</Button>
                </form>
             </Card>
           )}

           {/* Existing Tabs (Keep as they are) */}
           {activeTab === 'members' && (
             <Card className="!p-0 overflow-hidden shadow-xl border-2 border-slate-100 dark:border-slate-800">
                <Table headers={['Nama Siswa', 'Kelas', 'Jabatan', 'Aksi']}>
                   {members.map(m => (
                     <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">{m.studentName.charAt(0)}</div>
                           <span className="text-sm font-bold">{m.studentName}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">{m.className}</td>
                        <td className="px-6 py-4">
                           <select 
                            value={m.role} 
                            onChange={(e) => setMembers(members.map(x => x.id === m.id ? {...x, role: e.target.value as any} : x))}
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[9px] font-black uppercase px-2 py-1 outline-none"
                           >
                              <option>Ketua</option><option>Sekretaris</option><option>Bendahara</option><option>Anggota</option>
                           </select>
                        </td>
                        <td className="px-6 py-4"><button onClick={() => setMembers(members.filter(x => x.id !== m.id))} className="text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button></td>
                     </tr>
                   ))}
                </Table>
             </Card>
           )}

           {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Riwayat Latihan</h4>
                   <Button onClick={() => setIsSessionModalOpen(true)} className="!py-1.5 text-[10px]"><Plus size={14} /> Catat Sesi</Button>
                </div>
                <Card className="!p-0 overflow-hidden">
                   <Table headers={['Tanggal', 'Materi/Topik', 'Peserta', 'Aksi']}>
                      {sessions.map(s => (
                        <tr key={s.id}>
                           <td className="px-6 py-4 text-xs font-mono font-bold">{s.date}</td>
                           <td className="px-6 py-4 text-sm font-bold text-indigo-600">{s.topic}</td>
                           <td className="px-6 py-4 text-xs font-black">{s.attendanceCount} Siswa</td>
                           <td className="px-6 py-4"><button onClick={() => setSessions(sessions.filter(x => x.id !== s.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                   </Table>
                </Card>
              </div>
           )}

           {activeTab === 'grading' && (
             <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[32px] border border-indigo-100 flex justify-between items-center">
                   <div className="flex gap-4 items-center">
                      <Sparkles className="text-indigo-600" size={32} />
                      <div><h4 className="font-black">Smart Grading</h4><p className="text-xs text-slate-500">Nilai eskul otomatis masuk ke Raport Kesiswaan.</p></div>
                   </div>
                   <Button variant="secondary" onClick={() => alert('Nilai berhasil disinkronkan!')}><FileSpreadsheet size={16} /> Sync Rapor</Button>
                </div>
                <Card className="!p-0 overflow-hidden">
                   <Table headers={['Nama Siswa', 'Predikat', 'Deskripsi Capaian']}>
                      {members.map(m => (
                        <tr key={m.id}>
                           <td className="px-6 py-4 text-sm font-bold">{m.studentName}</td>
                           <td className="px-6 py-4">
                              <select className="bg-white dark:bg-slate-800 border rounded-lg px-2 py-1 font-black text-xs text-indigo-600" defaultValue={m.grade}>
                                 <option>A</option><option>B</option><option>C</option><option>D</option>
                              </select>
                           </td>
                           <td className="px-6 py-4"><input className="w-full bg-transparent border-b text-xs text-slate-500 outline-none" defaultValue="Aktif mengikuti latihan rutin." /></td>
                        </tr>
                      ))}
                   </Table>
                </Card>
             </div>
           )}
        </div>

        {/* Sidebar Side */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
              <ShieldCheck className="absolute -right-4 -bottom-4 opacity-10" size={120} />
              <h4 className="text-lg font-black mb-6 flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-500" /> Status Eskul</h4>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-black mb-2">Legalitas</p>
                    <div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={16} className="text-emerald-500" /> SK Pembina Valid</div>
                 </div>
                 <Button className="w-full !bg-indigo-600 !text-white shadow-xl shadow-indigo-500/20">Cetak Sertifikat Massal</Button>
              </div>
           </Card>

           <Card title="Aset Utama">
              <div className="space-y-3">
                 {assets.slice(0, 3).map(a => (
                   <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-xs font-bold">{a.name}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-slate-100">{a.qty} Unit</span>
                   </div>
                 ))}
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest" onClick={() => setActiveTab('assets')}>Lihat Semua Aset <ChevronRight size={14} /></Button>
              </div>
           </Card>

           <Card title="Log Aktivitas">
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                    <p className="text-[11px] text-slate-500">Klub didaftarkan ke sistem pada periode 2024/2025.</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                    <p className="text-[11px] text-slate-500">Sinkronisasi nilai rapor semester ganjil aktif.</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Feature Modals */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Daftarkan Anggota / Pengurus">
         <form className="space-y-6" onSubmit={handleAddMember}>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Nama Siswa</label><input name="name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Kelas</label><input name="class" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Jabatan</label>
                  <select name="role" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Anggota">Anggota</option><option value="Ketua">Ketua</option><option value="Sekretaris">Sekretaris</option><option value="Bendahara">Bendahara</option>
                  </select>
               </div>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20">Konfirmasi Pendaftaran</Button>
         </form>
      </Modal>

      <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title="Catat Sesi Pertemuan">
         <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setSessions([{ id: `s${Date.now()}`, date: formData.get('date') as string, topic: formData.get('topic') as string, attendanceCount: Number(formData.get('attendance')) }, ...sessions]);
            setIsSessionModalOpen(false);
         }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Tanggal</label><input name="date" type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={new Date().toISOString().split('T')[0]} /></div>
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Hadir</label><input name="attendance" type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder={members.length.toString()} /></div>
            </div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Materi/Topik</label><input name="topic" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl">Simpan Sesi</Button>
         </form>
      </Modal>

      <Modal isOpen={isProkerModalOpen} onClose={() => setIsProkerModalOpen(false)} title="Tambah Program Kerja">
         <form className="space-y-6" onSubmit={handleAddProker}>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Judul Proker</label><input name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Tanggal Target</label><input name="date" type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Deskripsi Singkat</label><textarea name="description" rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none"></textarea></div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20">Daftarkan Proker</Button>
         </form>
      </Modal>

      <Modal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} title="Catat Transaksi Kas">
         <form className="space-y-6" onSubmit={handleAddFinance}>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Keterangan</label><input name="description" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Iuran Mingguan / Beli Alat" /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Tipe</label>
                  <select name="type" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Masuk">Masuk (+)</option><option value="Keluar">Keluar (-)</option>
                  </select>
               </div>
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Nominal</label><input name="amount" type="number" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl">Simpan Ke Buku Kas</Button>
         </form>
      </Modal>

      <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title="Register Aset Baru">
         <form className="space-y-6" onSubmit={handleAddAsset}>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Nama Barang</label><input name="name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Jumlah</label><input name="qty" type="number" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" /></div>
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Kondisi</label>
                  <select name="condition" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
                  </select>
               </div>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl">Catat Aset</Button>
         </form>
      </Modal>
    </div>
  );
};
