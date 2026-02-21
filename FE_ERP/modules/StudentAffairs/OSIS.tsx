
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  Users, Calendar, FileText, MessageSquare, 
  TrendingUp, Award, Clock, CheckCircle, 
  Plus, Search, Filter, ShieldCheck, 
  ChevronRight, ArrowUpRight, DollarSign,
  UserCheck, Send, AlertCircle, Trash2, XCircle,
  Eye, Settings, LayoutGrid, User, BookOpen,
  Wallet, Box, Receipt, ArrowUpCircle, ArrowDownCircle,
  PackageCheck, MapPin
} from 'lucide-react';
import { OSISMember, OSISProgram, OSISProposal, OSISAspiration, OSISSection, OSISGlobalFinanceLog, OSISAsset } from '../../types';

const INITIAL_MEMBERS: OSISMember[] = [
  { id: '1', name: 'Ahmad Faisal', position: 'Ketua OSIS', section: 'Inti', class: 'XI RPL 1', status: 'Aktif' },
  { id: '2', name: 'Citra Dewi', position: 'Sekretaris Umum', section: 'Inti', class: 'XI MM 1', status: 'Aktif' },
  { id: '3', name: 'Budi Santoso', position: 'Ketua Sekbid 1', section: 'Ketaqwaan', class: 'X TKJ 2', status: 'Aktif' },
];

const INITIAL_SECTIONS: OSISSection[] = [
  { id: '1', name: 'Inti', description: 'Pengurus harian inti yang bertanggung jawab atas koordinasi seluruh kegiatan OSIS.', jobdesk: ['Memimpin rapat', 'Koordinasi eksternal', 'Manajemen administrasi'] },
  { id: '2', name: 'Sekbid 1 - Ketaqwaan', description: 'Bidang pembinaan ketaqwaan terhadap Tuhan Yang Maha Esa.', jobdesk: ['Kegiatan keagamaan harian', 'Peringatan hari besar agama', 'Pembinaan rohani'] },
  { id: '3', name: 'Sekbid 2 - Bela Negara', description: 'Bidang pembinaan kesadaran bela negara dan disiplin.', jobdesk: ['Latihan kepemimpinan', 'Upacara bendera', 'Disiplin siswa'] },
  { id: '4', name: 'Sekbid 3 - Kewirausahaan', description: 'Bidang pembinaan kreativitas, keterampilan dan kewirausahaan.', jobdesk: ['Koperasi siswa', 'Bazar sekolah', 'Produksi kreatif'] },
  { id: '5', name: 'MPK', description: 'Majelis Perwakilan Kelas yang bertugas mengawasi kinerja OSIS.', jobdesk: ['Rapat pleno', 'Pengawasan proker', 'Evaluasi pengurus'] },
];

const INITIAL_PROGRAMS: OSISProgram[] = [
  { id: 'p1', title: 'Classmeeting Ganjil', date: '2024-06-15', budget: 5000000, status: 'Planned', progress: 20 },
  { id: 'p2', title: 'LDKS Pengurus Baru', date: '2024-05-10', budget: 12000000, status: 'In Progress', progress: 65 },
  { id: 'p3', title: 'Pensi HUT Sekolah', date: '2024-08-20', budget: 25000000, status: 'Planned', progress: 5 },
];

const INITIAL_PROPOSALS: OSISProposal[] = [
  { id: 'pr1', title: 'Proposal Dana Pensi 2024', submittedBy: 'Citra Dewi', date: '2024-03-01', status: 'Pembina_Approved', category: 'Anggaran' },
  { id: 'pr2', title: 'Izin Kegiatan Bukber Akbar', submittedBy: 'Ahmad Faisal', date: '2024-03-05', status: 'Checking', category: 'Kegiatan' },
];

const INITIAL_ASPIRATIONS: OSISAspiration[] = [
  { id: 'a1', sender: 'Anonymous', date: '2024-03-10', subject: 'Fasilitas Kantin', content: 'Mohon agar kebersihan kantin lebih diperhatikan oleh pihak sekolah.', status: 'New' },
  { id: 'a2', sender: 'Siswa Kelas X', date: '2024-03-08', subject: 'Eskul Baru', content: 'Apakah mungkin diadakan eskul E-Sports?', status: 'Responded', response: 'Sedang kami diskusikan dengan kesiswaan.' },
];

export const OSIS: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pengurus' | 'proker' | 'proposal' | 'aspirasi' | 'kas' | 'aset'>('dashboard');
  
  // States with Persistence
  const [members, setMembers] = useLocalStorage<OSISMember[]>('edupro_osis_members', INITIAL_MEMBERS);
  const [sections] = useLocalStorage<OSISSection[]>('edupro_osis_sections', INITIAL_SECTIONS);
  const [programs, setPrograms] = useLocalStorage<OSISProgram[]>('edupro_osis_programs', INITIAL_PROGRAMS);
  const [proposals, setProposals] = useLocalStorage<OSISProposal[]>('edupro_osis_proposals', INITIAL_PROPOSALS);
  const [aspirations, setAspirations] = useLocalStorage<OSISAspiration[]>('edupro_osis_aspirations', INITIAL_ASPIRATIONS);
  
  // New States: Finance and Assets
  const [globalFinance, setGlobalFinance] = useLocalStorage<OSISGlobalFinanceLog[]>('edupro_osis_global_finance', []);
  const [osisAssets, setOsisAssets] = useLocalStorage<OSISAsset[]>('edupro_osis_assets', []);

  // UI Modal States
  const [isProkerModalOpen, setIsProkerModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAspirationModalOpen, setIsAspirationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  
  const [selectedProfileMember, setSelectedProfileMember] = useState<OSISMember | null>(null);
  const [selectedAspiration, setSelectedAspiration] = useState<OSISAspiration | null>(null);
  const [aspirationResponse, setAspirationResponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Finance Calculation
  const financeStats = useMemo(() => {
    const masuk = globalFinance.filter(f => f.type === 'Masuk').reduce((acc, curr) => acc + curr.amount, 0);
    const keluar = globalFinance.filter(f => f.type === 'Keluar').reduce((acc, curr) => acc + curr.amount, 0);
    return { masuk, keluar, saldo: masuk - keluar };
  }, [globalFinance]);

  // Dashboard Stats Calculation
  const stats = useMemo(() => {
    const totalBudgetUsed = programs.reduce((acc, curr) => acc + curr.budget, 0);
    const completedProker = programs.filter(p => p.status === 'Completed').length;
    const pendingProposals = proposals.filter(p => p.status === 'Checking' || p.status === 'Pembina_Approved').length;
    const newAspirations = aspirations.filter(a => a.status === 'New').length;
    return { totalBudgetUsed, completedProker, pendingProposals, newAspirations, totalProker: programs.length };
  }, [programs, proposals, aspirations]);

  // Handlers
  const handleAddProgram = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProker: OSISProgram = {
      id: `p${Date.now()}`,
      title: formData.get('title') as string,
      budget: Number(formData.get('budget')),
      date: formData.get('date') as string,
      status: 'Planned',
      progress: 0
    };
    setPrograms([...programs, newProker]);
    setIsProkerModalOpen(false);
  };

  const handleAddFinance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: OSISGlobalFinanceLog = {
      id: `f${Date.now()}`,
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      type: formData.get('type') as any,
      category: formData.get('category') as string,
    };
    setGlobalFinance([newLog, ...globalFinance]);
    setIsFinanceModalOpen(false);
  };

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAsset: OSISAsset = {
      id: `as${Date.now()}`,
      name: formData.get('name') as string,
      qty: Number(formData.get('qty')),
      condition: formData.get('condition') as any,
      location: formData.get('location') as string,
    };
    setOsisAssets([...osisAssets, newAsset]);
    setIsAssetModalOpen(false);
  };

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMember: OSISMember = {
      id: `m${Date.now()}`,
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      section: formData.get('section') as string,
      class: formData.get('class') as string,
      status: 'Aktif'
    };
    setMembers([...members, newMember]);
    setIsMemberModalOpen(false);
  };

  const handleRespondAspiration = () => {
    if (!selectedAspiration) return;
    const updated = aspirations.map(a => 
      a.id === selectedAspiration.id 
      ? { ...a, status: 'Responded' as const, response: aspirationResponse } 
      : a
    );
    setAspirations(updated);
    setIsAspirationModalOpen(false);
    setAspirationResponse('');
    setSelectedAspiration(null);
  };

  const updateProposalStatus = (id: string, newStatus: OSISProposal['status']) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const openMemberProfile = (member: OSISMember) => {
    setSelectedProfileMember(member);
    setIsProfileModalOpen(true);
  };

  const getProposalStatusLabel = (status: string) => {
    switch(status) {
      case 'Checking': return { label: 'Pemeriksaan', color: 'bg-amber-100 text-amber-700' };
      case 'Pembina_Approved': return { label: 'Disetujui Pembina', color: 'bg-blue-100 text-blue-700' };
      case 'Wakasek_Approved': return { label: 'Disetujui Wakasek', color: 'bg-indigo-100 text-indigo-700' };
      case 'Final_Approved': return { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' };
      case 'Rejected': return { label: 'Ditolak', color: 'bg-rose-100 text-rose-700' };
      default: return { label: status, color: 'bg-slate-100 text-slate-700' };
    }
  };

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">OSIS & MPK</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Organisasi Siswa Intra Sekolah • Periode 2023/2024</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => navigate('/student-affairs/osis/sections')}>
              <LayoutGrid size={18} /> Kelola Sekbid
           </Button>
           <Button onClick={() => {
              if (activeTab === 'kas') setIsFinanceModalOpen(true);
              else if (activeTab === 'aset') setIsAssetModalOpen(true);
              else setIsProkerModalOpen(true);
           }}>
              <Plus size={18} /> {activeTab === 'kas' ? 'Catat Transaksi' : activeTab === 'aset' ? 'Tambah Aset' : 'Buat Program'}
           </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full overflow-x-auto custom-scrollbar whitespace-nowrap">
        {[
          { id: 'dashboard', label: 'Ringkasan', icon: <TrendingUp size={16} /> },
          { id: 'pengurus', label: 'Struktur Pengurus', icon: <UserCheck size={16} /> },
          { id: 'proker', label: 'Program Kerja', icon: <Calendar size={16} /> },
          { id: 'proposal', label: 'Proposal Digital', icon: <FileText size={16} /> },
          { id: 'aspirasi', label: 'Aspirasi Siswa', icon: <MessageSquare size={16} /> },
          { id: 'kas', label: 'Kas Organisasi', icon: <Wallet size={16} /> },
          { id: 'aset', label: 'Inventaris Aset', icon: <Box size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl shadow-indigo-500/10' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-indigo-600 text-white border-none shadow-xl relative overflow-hidden">
                 <DollarSign className="absolute -right-2 -bottom-2 w-20 h-20 opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Anggaran Proker</p>
                 <p className="text-2xl font-black mt-1">Rp {stats.totalBudgetUsed.toLocaleString('id-ID')}</p>
                 <p className="text-[10px] mt-2 opacity-80">Dari seluruh program aktif</p>
              </Card>
              <Card className="flex flex-col justify-center border-l-4 border-emerald-500">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo Kas Global</p>
                 <p className="text-2xl font-black text-emerald-600">Rp {financeStats.saldo.toLocaleString('id-ID')}</p>
                 <p className="text-[10px] text-emerald-600 font-bold mt-1">Iuran & Dana Abadi OSIS</p>
              </Card>
              <Card className="flex flex-col justify-center border-l-4 border-amber-500">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proposal Aktif</p>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.pendingProposals}</p>
                 <p className="text-[10px] text-amber-600 font-bold mt-1">Sedang dalam proses review</p>
              </Card>
              <Card className="flex flex-col justify-center border-l-4 border-rose-500">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aspirasi Baru</p>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.newAspirations}</p>
                 <p className="text-[10px] text-rose-600 font-bold mt-1">Butuh Respon Segera</p>
              </Card>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Program Kerja Mendatang">
                 <div className="space-y-4">
                    {programs.filter(p => p.status !== 'Completed').slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                         <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[8px] font-black uppercase text-indigo-600">{new Date(p.date).toLocaleString('id-ID', {month: 'short'}).toUpperCase()}</span>
                            <span className="text-lg font-black text-slate-800 dark:text-white">{p.date.split('-')[2]}</span>
                         </div>
                         <div className="flex-1">
                            <h5 className="text-sm font-black text-slate-800 dark:text-white">{p.title}</h5>
                            <div className="flex items-center gap-4 mt-1">
                               <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full" style={{width: `${p.progress}%`}}></div>
                               </div>
                               <span className="text-[10px] font-bold text-slate-400">{p.progress}%</span>
                            </div>
                         </div>
                         <button onClick={() => navigate(`/student-affairs/osis/program/${p.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><ArrowUpRight size={18} /></button>
                      </div>
                    ))}
                    {programs.filter(p => p.status !== 'Completed').length === 0 && (
                      <p className="text-center py-8 text-slate-400 text-sm italic">Tidak ada proker yang sedang berjalan.</p>
                    )}
                 </div>
              </Card>

              <Card title="Struktur Inti OSIS">
                 <div className="space-y-4">
                    {members.slice(0, 3).map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">{m.name.charAt(0)}</div>
                           <div>
                              <p className="text-sm font-bold">{m.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-black">{m.position}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">{m.class}</span>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      )}

      {/* VIEW: PENGURUS */}
      {activeTab === 'pengurus' && (
        <Card className="!p-0 overflow-hidden shadow-xl">
           <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="font-black text-slate-800 dark:text-white">Daftar Pengurus Terdaftar</h4>
              <div className="flex gap-2">
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none" placeholder="Cari nama pengurus..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 </div>
                 <Button onClick={() => setIsMemberModalOpen(true)} className="!py-2 !px-4 text-xs font-black"><Plus size={14} /> Tambah</Button>
              </div>
           </div>
           <Table headers={['Nama Lengkap', 'Jabatan', 'Seksi Bidang', 'Kelas', 'Aksi']}>
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-[10px] uppercase">
                            {m.name.charAt(0)}
                         </div>
                         <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
                         {m.position}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-xs text-slate-500">{m.section}</td>
                   <td className="px-6 py-4 text-xs text-slate-500">{m.class}</td>
                   <td className="px-6 py-4">
                      <div className="flex gap-1 items-center">
                        <button 
                          onClick={() => openMemberProfile(m)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                        >
                           <Eye size={16} />
                        </button>
                        <button onClick={() => setMembers(members.filter(mem => mem.id !== m.id))} className="p-2 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                           <Trash2 size={16} />
                        </button>
                      </div>
                   </td>
                </tr>
              ))}
           </Table>
        </Card>
      )}

      {/* VIEW: PROKER */}
      {activeTab === 'proker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {programs.map(p => (
             <Card 
               key={p.id} 
               onClick={() => navigate(`/student-affairs/osis/program/${p.id}`)}
               className="relative group overflow-hidden hover:border-indigo-500 transition-all shadow-xl cursor-pointer"
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                   <Calendar size={64} />
                </div>
                <div className="flex items-start justify-between mb-4">
                   <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                     p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                     p.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                   }`}>
                      {p.status}
                   </span>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.status !== 'Completed' && (
                         <button onClick={(e) => { e.stopPropagation(); setPrograms(programs.map(pr => pr.id === p.id ? {...pr, status: 'Completed', progress: 100} : pr)); }} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Tandai Selesai"><CheckCircle size={14} /></button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setPrograms(programs.filter(pr => pr.id !== p.id)); }} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100" title="Hapus"><Trash2 size={14} /></button>
                   </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{p.title}</h4>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                   <Clock size={14} /> Pelaksanaan: <span className="font-bold text-slate-800 dark:text-white">{p.date}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                   <DollarSign size={14} /> Anggaran: <span className="font-bold text-slate-800 dark:text-white">Rp {p.budget.toLocaleString()}</span>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 mb-1.5">
                      <span>Progres Persiapan</span>
                      <span className="text-indigo-600">{p.progress}%</span>
                   </div>
                   <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-700" style={{width: `${p.progress}%`}}></div>
                   </div>
                </div>
             </Card>
           ))}
        </div>
      )}

      {/* VIEW: KAS OSIS */}
      {activeTab === 'kas' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                 <div className="flex items-center gap-3">
                    <ArrowDownCircle className="text-emerald-600" size={32} />
                    <div>
                       <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Total Pemasukan</p>
                       <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">Rp {financeStats.masuk.toLocaleString()}</p>
                    </div>
                 </div>
              </Card>
              <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800">
                 <div className="flex items-center gap-3">
                    <ArrowUpCircle className="text-rose-600" size={32} />
                    <div>
                       <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Total Pengeluaran</p>
                       <p className="text-2xl font-black text-rose-700 dark:text-rose-400">Rp {financeStats.keluar.toLocaleString()}</p>
                    </div>
                 </div>
              </Card>
              <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden">
                 <Wallet className="absolute -right-2 -bottom-2 opacity-10" size={80} />
                 <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Saldo Saat Ini</p>
                 <p className="text-3xl font-black">Rp {financeStats.saldo.toLocaleString()}</p>
              </Card>
           </div>

           <Card className="!p-0 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Buku Kas Besar OSIS</h4>
                 <Button onClick={() => setIsFinanceModalOpen(true)} className="!py-1.5 !px-4 text-[10px]"><Receipt size={14} /> Tambah Transaksi</Button>
              </div>
              <Table headers={['Tanggal', 'Keterangan & Kategori', 'Tipe', 'Nominal', 'Aksi']}>
                 {globalFinance.map(log => (
                   <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{log.date}</td>
                      <td className="px-6 py-4">
                         <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{log.description}</p>
                         <span className="text-[9px] font-black uppercase text-indigo-500">{log.category}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                           log.type === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                         }`}>{log.type}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-sm">Rp {log.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                         <button onClick={() => setGlobalFinance(globalFinance.filter(f => f.id !== log.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                      </td>
                   </tr>
                 ))}
                 {globalFinance.length === 0 && (
                   <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat transaksi kas organisasi.</td></tr>
                 )}
              </Table>
           </Card>
        </div>
      )}

      {/* VIEW: ASSETS */}
      {activeTab === 'aset' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div>
                 <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
                    <PackageCheck size={18} className="text-indigo-600" /> Inventaris Barang OSIS
                 </h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total {osisAssets.length} Aset Terdaftar</p>
              </div>
              <Button onClick={() => setIsAssetModalOpen(true)} className="!py-1.5 !px-4 text-[10px]"><Plus size={14} /> Registrasi Barang</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {osisAssets.map(asset => (
                <Card key={asset.id} className="group hover:border-indigo-500 transition-all shadow-lg border-2 border-transparent">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center">
                         <Box size={20} />
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        asset.condition === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                        asset.condition === 'Rusak' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>{asset.condition}</span>
                   </div>
                   <h5 className="font-black text-slate-800 dark:text-white mb-1">{asset.name}</h5>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{asset.qty} Unit</p>
                   
                   <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1 font-bold">
                         <MapPin size={10} /> {asset.location}
                      </span>
                      <button onClick={() => setOsisAssets(osisAssets.filter(a => a.id !== asset.id))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                         <Trash2 size={14} />
                      </button>
                   </div>
                </Card>
              ))}
              {osisAssets.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold">Belum ada aset terdaftar.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Existing Tab Views for Proposal and Aspirasi (Already in the file) */}
      {activeTab === 'proposal' && (
        <Card className="!p-0 overflow-hidden shadow-xl">
           <Table headers={['ID', 'Judul Proposal', 'Pengaju', 'Kategori', 'Status', 'Kelola Status']}>
              {proposals.map(pr => {
                const statusInfo = getProposalStatusLabel(pr.status);
                return (
                  <tr key={pr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                     <td className="px-6 py-4 text-xs font-mono text-slate-400">#{pr.id.slice(-4)}</td>
                     <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{pr.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{pr.date}</p>
                     </td>
                     <td className="px-6 py-4 text-sm font-medium text-slate-600">{pr.submittedBy}</td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                           {pr.category}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                           {statusInfo.label}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <button onClick={() => updateProposalStatus(pr.id, 'Final_Approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Terima"><CheckCircle size={16} /></button>
                           <button onClick={() => updateProposalStatus(pr.id, 'Rejected')} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Tolak"><XCircle size={16} /></button>
                        </div>
                     </td>
                  </tr>
                );
              })}
           </Table>
        </Card>
      )}

      {activeTab === 'aspirasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-4">
              {aspirations.map(asp => (
                <Card key={asp.id} className="hover:border-indigo-500 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            <MessageSquare size={20} />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-800 dark:text-white">{asp.subject}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{asp.sender} • {asp.date}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                        asp.status === 'New' ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                         {asp.status}
                      </span>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl italic">
                      "{asp.content}"
                   </p>
                   {asp.response && (
                     <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black uppercase text-indigo-600 mb-2 flex items-center gap-2">
                           <ShieldCheck size={14} /> Tanggapan Pengurus OSIS:
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{asp.response}</p>
                     </div>
                   )}
                   {asp.status === 'New' && (
                     <div className="mt-6 flex justify-end">
                        <Button 
                          onClick={() => { setSelectedAspiration(asp); setIsAspirationModalOpen(true); }}
                          variant="secondary" 
                          className="!py-2 !px-4 text-[10px] font-black uppercase tracking-widest"
                        >
                          Balas Aspirasi
                        </Button>
                     </div>
                   )}
                </Card>
              ))}
           </div>
        </div>
      )}

      {/* MODALS */}
      
      {/* Modal: Kas Transaksi */}
      <Modal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} title="Catat Transaksi Kas OSIS">
         <form className="space-y-6" onSubmit={handleAddFinance}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Keterangan Transaksi</label>
               <input name="description" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Iuran Mingguan Pengurus" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kategori</label>
                  <select name="category" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option>Iuran Wajib</option><option>Sponsor</option><option>Dana Sekolah</option><option>Konsumsi</option><option>Logistik</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tanggal</label>
                  <input name="date" type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" defaultValue={new Date().toISOString().split('T')[0]} />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tipe</label>
                  <select name="type" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Masuk">Pemasukan (+)</option><option value="Keluar">Pengeluaran (-)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Nominal (Rp)</label>
                  <input name="amount" type="number" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black" />
               </div>
            </div>
            <Button type="submit" className="w-full py-4 shadow-xl">Simpan Ke Buku Kas Global</Button>
         </form>
      </Modal>

      {/* Modal: Aset Baru */}
      <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title="Daftarkan Aset / Inventaris OSIS">
         <form className="space-y-6" onSubmit={handleAddAsset}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Barang</label>
               <input name="name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Megaphone TOA / Handy Talky" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Jumlah (Qty)</label>
                  <input name="qty" type="number" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kondisi Fisik</label>
                  <select name="condition" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Baik">Sangat Baik</option><option value="Rusak">Butuh Perbaikan</option><option value="Hilang">Hilang / Tidak Ditemukan</option>
                  </select>
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Lokasi Penyimpanan</label>
               <input name="location" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Lemari Ruang OSIS" />
            </div>
            <Button type="submit" className="w-full py-4 shadow-xl">Konfirmasi Data Aset</Button>
         </form>
      </Modal>

      {/* Modal: Tambah Program Baru */}
      <Modal isOpen={isProkerModalOpen} onClose={() => setIsProkerModalOpen(false)} title="Rancang Program Kerja Baru">
         <form className="space-y-6" onSubmit={handleAddProgram}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Kegiatan</label>
               <input name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" placeholder="Contoh: Gebyar Seni & Olahraga" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Estimasi Anggaran</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input name="budget" type="number" required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black outline-none" placeholder="0" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal Pelaksanaan</label>
                  <input name="date" type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none" />
               </div>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20">Simpan Proker</Button>
         </form>
      </Modal>

      {/* Modal: Tambah Pengurus Baru */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Tambah Anggota OSIS/MPK">
         <form className="space-y-4" onSubmit={handleAddMember}>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Siswa</label>
               <input name="name" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Jabatan</label>
                  <input name="position" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="Ex: Ketua OSIS" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kelas</label>
                  <input name="class" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="Ex: XI RPL 2" />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400">Seksi Bidang (Sekbid)</label>
               <select name="section" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold">
                  {sections.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
               </select>
            </div>
            <Button type="submit" className="w-full py-3 mt-4">Daftarkan Pengurus</Button>
         </form>
      </Modal>

      {/* Modal: Member Profile Detail */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Profil Pengurus Organisasi">
         {selectedProfileMember && (
           <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-4">
                    {selectedProfileMember.name.charAt(0)}
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedProfileMember.name}</h3>
                 <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">{selectedProfileMember.position}</p>
                 <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase rounded-full border border-slate-200 dark:border-slate-700">{selectedProfileMember.section}</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase rounded-full border border-slate-200 dark:border-slate-700">{selectedProfileMember.class}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status Keanggotaan</p>
                    <div className="flex items-center gap-2">
                       <CheckCircle size={14} className="text-emerald-500" />
                       <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedProfileMember.status}</span>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ID Anggota</p>
                    <span className="text-sm font-mono font-bold">#OSIS-{selectedProfileMember.id.slice(-4)}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <h5 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                    <BookOpen size={14} /> Ringkasan Kontribusi
                 </h5>
                 <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Program Kerja Terlibat</span>
                       <span className="text-xs font-black text-indigo-600">3 Proker</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Poin Aktivitas</span>
                       <span className="text-xs font-black text-emerald-600">850 Pts</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <Button variant="secondary" className="flex-1" onClick={() => setIsProfileModalOpen(false)}>Tutup</Button>
                 <Button className="flex-[2]" onClick={() => alert('Fitur Kirim Pesan Segera Hadir!')}><Send size={16} /> Kirim Pesan</Button>
              </div>
           </div>
         )}
      </Modal>

      {/* Modal: Balas Aspirasi */}
      <Modal isOpen={isAspirationModalOpen} onClose={() => setIsAspirationModalOpen(false)} title="Respon Aspirasi Siswa">
         <div className="space-y-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
               <p className="text-[10px] font-black uppercase text-indigo-600 mb-2">Pesan Asli:</p>
               <p className="text-sm italic text-slate-700 dark:text-slate-300">"{selectedAspiration?.content}"</p>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Tanggapan Resmi Pengurus</label>
               <textarea 
                  rows={4} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500"
                  placeholder="Ketik tanggapan Anda di sini..."
                  value={aspirationResponse}
                  onChange={e => setAspirationResponse(e.target.value)}
               ></textarea>
            </div>
            <Button className="w-full py-4 shadow-xl shadow-indigo-500/20" onClick={handleRespondAspiration}>
               Kirim Tanggapan & Publikasikan
            </Button>
         </div>
      </Modal>
    </div>
  );
};
