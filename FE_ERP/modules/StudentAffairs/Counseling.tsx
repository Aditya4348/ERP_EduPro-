
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  ShieldAlert, Search, Filter, 
  TrendingDown, Heart, Briefcase,
  AlertCircle, CheckCircle2, MoreVertical,
  Plus, Printer, EyeOff, Eye, MessageSquare,
  Award, Target, History, Settings, ChevronRight,
  X, Trash2, GraduationCap, Edit, BookOpen
} from 'lucide-react';
import { ViolationRecord, CounselingLog, CareerPlan } from '../../types';

const INITIAL_VIOLATIONS: ViolationRecord[] = [
  { id: 'v1', studentId: '1', studentName: 'Ahmad Faisal', className: 'X RPL 1', category: 'Disiplin', description: 'Terlambat lebih dari 15 menit', points: 5, date: '2024-03-12', reportedBy: 'Guru Piket', status: 'Recorded' },
  { id: 'v2', studentId: '2', studentName: 'Budi Santoso', className: 'XI TKJ 2', category: 'Kerapihan', description: 'Rambut melebihi kerah baju', points: 10, date: '2024-03-11', reportedBy: 'Guru BK', status: 'Recorded' },
  { id: 'v3', studentId: '3', studentName: 'Citra Dewi', className: 'XII MM 1', category: 'Disiplin', description: 'Bolos jam pelajaran terakhir', points: 25, date: '2024-03-10', reportedBy: 'Wali Kelas', status: 'Resolved' },
  { id: 'v4', studentId: '4', studentName: 'Dedi Kurniawan', className: 'XII TKJ 1', category: 'Berat', description: 'Membawa rokok ke lingkungan sekolah', points: 75, date: '2024-03-09', reportedBy: 'Guru BK', status: 'SP1' },
];

const INITIAL_COUNSELING: CounselingLog[] = [
  { id: 'c1', studentId: '1', studentName: 'Ahmad Faisal', date: '2024-03-12', category: 'Pribadi', notes: 'Siswa merasa kesulitan membagi waktu antara eskul dan belajar.', isPrivate: true, followUp: 'Jadwalkan pertemuan dengan orang tua' },
];

const INITIAL_CAREER: CareerPlan[] = [
  { id: 'cp1', studentId: '3', studentName: 'Citra Dewi', plan: 'Kuliah', target: 'Institut Teknologi Bandung - DKV', notes: 'Sedang mempersiapkan portofolio untuk jalur SNBP.' },
  { id: 'cp2', studentId: '4', studentName: 'Dedi Kurniawan', plan: 'Kerja', target: 'PT Telkom Indonesia', notes: 'Ingin melamar melalui jalur rekrutmen industri sekolah.' },
];

const POINT_RULES = [
  { category: 'Disiplin', items: [
    { name: 'Terlambat', point: 5 },
    { name: 'Bolos Pelajaran', point: 15 },
    { name: 'Lari dari Sekolah', point: 25 }
  ]},
  { category: 'Kerapihan', items: [
    { name: 'Atribut Tidak Lengkap', point: 2 },
    { name: 'Rambut Tidak Rapi', point: 5 },
    { name: 'Baju Dikeluarkan', point: 5 }
  ]},
  { category: 'Pelanggaran Berat', items: [
    { name: 'Perkelahian/Tawuran', point: 75 },
    { name: 'Mengkonsumsi Miras/Narkoba', point: 150 },
    { name: 'Pelecehan Seksual', point: 150 }
  ]}
];

export const Counseling: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'violations' | 'counseling' | 'career' | 'config'>('violations');
  
  // Data State
  const [violations, setViolations] = useLocalStorage<ViolationRecord[]>('edupro_bk_violations_v2', INITIAL_VIOLATIONS);
  const [counselingLogs, setCounselingLogs] = useLocalStorage<CounselingLog[]>('edupro_bk_counseling_v2', INITIAL_COUNSELING);
  const [careerPlans, setCareerPlans] = useLocalStorage<CareerPlan[]>('edupro_bk_career_v2', INITIAL_CAREER);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [careerSearch, setCareerSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);

  // Form State
  const [violationForm, setViolationForm] = useState({
    studentName: '',
    className: '',
    category: 'Disiplin',
    points: 5,
    description: '',
    notifyParent: true
  });

  const [counselingForm, setCounselingForm] = useState({
    studentName: '',
    category: 'Pribadi',
    notes: '',
    followUp: '',
    isPrivate: true
  });

  const [careerForm, setCareerForm] = useState<Omit<CareerPlan, 'id' | 'studentId'>>({
    studentName: '',
    plan: 'Belum Tahu',
    target: '',
    notes: ''
  });

  // Statistics Calculation
  const stats = useMemo(() => {
    const criticalStudents = Array.from(new Set(violations.filter(v => v.points >= 50).map(v => v.studentId))).length;
    const careerStats = {
      kuliah: careerPlans.filter(p => p.plan === 'Kuliah').length,
      kerja: careerPlans.filter(p => p.plan === 'Kerja').length,
      usaha: careerPlans.filter(p => p.plan === 'Wirausaha').length,
    };
    return { criticalStudents, counselingCount: counselingLogs.length, careerStats };
  }, [violations, counselingLogs, careerPlans]);

  // Filtering Logic
  const filteredViolations = useMemo(() => {
    return violations.filter(v => {
      const matchesSearch = v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           v.className.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [violations, searchTerm, categoryFilter, statusFilter]);

  const filteredCareer = useMemo(() => {
    return careerPlans.filter(p => p.studentName.toLowerCase().includes(careerSearch.toLowerCase()));
  }, [careerPlans, careerSearch]);

  // Actions
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
  };

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const newViolation: ViolationRecord = {
      id: `v${Date.now()}`,
      studentId: `s${Date.now()}`,
      studentName: violationForm.studentName,
      className: violationForm.className || 'X RPL 1',
      category: violationForm.category as any,
      description: violationForm.description,
      points: Number(violationForm.points),
      date: new Date().toISOString().split('T')[0],
      reportedBy: user?.name || 'Guru BK',
      status: 'Recorded'
    };
    setViolations([newViolation, ...violations]);
    setIsViolationModalOpen(false);
    setViolationForm({ studentName: '', className: '', category: 'Disiplin', points: 5, description: '', notifyParent: true });
    alert('Pelanggaran berhasil dicatat dan poin telah diperbarui.');
  };

  const handleAddCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: CounselingLog = {
      id: `c${Date.now()}`,
      studentId: `s${Date.now()}`,
      studentName: counselingForm.studentName,
      date: new Date().toISOString().split('T')[0],
      category: counselingForm.category as any,
      notes: counselingForm.notes,
      isPrivate: counselingForm.isPrivate,
      followUp: counselingForm.followUp
    };
    setCounselingLogs([newLog, ...counselingLogs]);
    setIsCounselingModalOpen(false);
    setCounselingForm({ studentName: '', category: 'Pribadi', notes: '', followUp: '', isPrivate: true });
    alert('Log konseling telah disimpan ke arsip rahasia.');
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCareerId) {
      setCareerPlans(careerPlans.map(p => p.id === editingCareerId ? { ...p, ...careerForm } : p));
      alert('Perubahan rencana karir berhasil disimpan.');
    } else {
      const newPlan: CareerPlan = {
        id: `cp${Date.now()}`,
        studentId: `s${Date.now()}`,
        ...careerForm
      };
      setCareerPlans([newPlan, ...careerPlans]);
      alert('Data Perencanaan Karir (Tracer Study) berhasil ditambahkan.');
    }
    setIsCareerModalOpen(false);
    setEditingCareerId(null);
    setCareerForm({ studentName: '', plan: 'Belum Tahu', target: '', notes: '' });
  };

  const deleteViolation = (id: string) => {
    if(confirm('Batalkan catatan pelanggaran ini? Poin siswa akan dikembalikan.')) {
      setViolations(violations.filter(v => v.id !== id));
    }
  };

  const deleteCareer = (id: string) => {
    if(confirm('Hapus data perencanaan karir siswa ini?')) {
      setCareerPlans(careerPlans.filter(p => p.id !== id));
    }
  };

  const handleEditCareer = (plan: CareerPlan) => {
    setEditingCareerId(plan.id);
    setCareerForm({
      studentName: plan.studentName,
      plan: plan.plan,
      target: plan.target,
      notes: plan.notes
    });
    setIsCareerModalOpen(true);
  };

  const handlePrintSP = (v: ViolationRecord) => {
    alert(`Mencetak Dokumen Surat Peringatan untuk ${v.studentName}...\nStatus: ${v.points >= 75 ? 'SP2' : 'SP1'}\nTotal Poin: ${v.points}`);
  };

  const getPointsColor = (points: number) => {
    if (points >= 75) return 'text-rose-600';
    if (points >= 50) return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">BK & Kedisiplinan</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manajemen Perilaku, Pembinaan & Tracer Study Siswa</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="secondary" onClick={() => setShowSensitiveData(!showSensitiveData)}>
              {showSensitiveData ? <EyeOff size={18} /> : <Eye size={18} />} {showSensitiveData ? 'Sembunyikan' : 'Buka'} Data Privat
           </Button>
           <Button onClick={() => {
              if (activeTab === 'violations') setIsViolationModalOpen(true);
              else if (activeTab === 'counseling') setIsCounselingModalOpen(true);
              else { setEditingCareerId(null); setCareerForm({ studentName: '', plan: 'Belum Tahu', target: '', notes: '' }); setIsCareerModalOpen(true); }
           }}>
              <Plus size={18} /> {activeTab === 'violations' ? 'Catat Pelanggaran' : activeTab === 'counseling' ? 'Sesi Konseling' : 'Update Karir XII'}
           </Button>
        </div>
      </div>

      {/* Top Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-rose-600 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10"><AlertCircle size={100} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">Siswa Dalam Perhatian</p>
            <p className="text-4xl font-black mt-1">{stats.criticalStudents} Siswa</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-rose-100">
               <TrendingDown size={14} /> Poin {'>'} 50 (Ambang SP)
            </div>
         </Card>

         <Card className="flex flex-col justify-center text-center border-l-4 border-l-amber-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Sesi Konseling</p>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.counselingCount}</p>
            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Database Terarsip</p>
         </Card>

         <Card className="flex flex-col justify-center text-center border-l-4 border-l-indigo-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Poin Merit (Prestasi)</p>
            <p className="text-3xl font-black text-indigo-600">+450</p>
            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Penyeimbang Kedisiplinan</p>
         </Card>

         <Card className="bg-slate-900 text-white border-none flex flex-col justify-center text-center relative overflow-hidden">
            <Printer className="absolute -right-2 -bottom-2 opacity-10" size={60} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Otomasi Berkas SP</p>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-sm font-bold">SP-Generator Ready</span>
            </div>
         </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('violations')} className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${activeTab === 'violations' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500'}`}>
          <ShieldAlert size={16} /> Poin & Pelanggaran
        </button>
        <button onClick={() => setActiveTab('counseling')} className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${activeTab === 'counseling' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500'}`}>
          <Heart size={16} /> Konseling Privat
        </button>
        <button onClick={() => setActiveTab('career')} className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${activeTab === 'career' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500'}`}>
          <Briefcase size={16} /> Perencanaan Karir
        </button>
        <button onClick={() => setActiveTab('config')} className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500'}`}>
          <Settings size={16} /> Aturan Poin
        </button>
      </div>

      {/* VIEW: VIOLATIONS */}
      {activeTab === 'violations' && (
        <Card className="!p-0 border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari nama siswa atau kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
                />
             </div>
             
             <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                   <Filter size={14} className="text-slate-400" />
                   <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none text-slate-700 dark:text-slate-200 cursor-pointer">
                      <option value="All">Semua Kategori</option>
                      <option value="Disiplin">Disiplin</option>
                      <option value="Kerapihan">Kerapihan</option>
                      <option value="Etika">Etika</option>
                      <option value="Berat">Pelanggaran Berat</option>
                   </select>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                   <Target size={14} className="text-slate-400" />
                   <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none text-slate-700 dark:text-slate-200 cursor-pointer">
                      <option value="All">Semua Status</option>
                      <option value="Recorded">Recorded</option>
                      <option value="Resolved">Resolved</option>
                      <option value="SP1">SP1 Issued</option>
                      <option value="SP2">SP2 Issued</option>
                   </select>
                </div>

                {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All') && (
                  <button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all">
                    <X size={14} /> Reset
                  </button>
                )}
             </div>
          </div>
          
          <Table headers={['Waktu', 'Siswa & Rombel', 'Pelanggaran', 'Bobot Poin', 'Status', 'Aksi']}>
            {filteredViolations.length > 0 ? filteredViolations.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 text-[10px] font-mono text-slate-400">{v.date}</td>
                <td className="px-6 py-4">
                   <p className="text-sm font-black text-slate-800 dark:text-slate-100">{v.studentName}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.className}</p>
                </td>
                <td className="px-6 py-4">
                   <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-1 inline-block ${
                     v.category === 'Berat' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                   }`}>{v.category}</span>
                   <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{v.description}</p>
                </td>
                <td className="px-6 py-4">
                   <span className={`text-sm font-black ${getPointsColor(v.points)}`}>{v.points} Pts</span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                     v.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                     v.status.startsWith('SP') ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                   }`}>{v.status}</span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex gap-1">
                      {v.points >= 50 && (
                        <button onClick={() => handlePrintSP(v)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Generate Dokumen SP">
                           <Printer size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteViolation(v.id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                   <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={32} strokeWidth={1.5} />
                      <p className="text-sm font-bold">Tidak ada data pelanggaran yang ditemukan.</p>
                   </div>
                </td>
              </tr>
            )}
          </Table>
        </Card>
      )}

      {/* VIEW: COUNSELING LOGS */}
      {activeTab === 'counseling' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-8 space-y-4">
              {counselingLogs.map(log => (
                <Card key={log.id} className="hover:border-indigo-400 transition-all border-2 border-transparent">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center">
                            <MessageSquare size={24} />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-800 dark:text-slate-100">{log.studentName}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.category} • {log.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {log.isPrivate && <span className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1"><EyeOff size={10} /> Konfidensial</span>}
                         <button onClick={() => confirm('Hapus log konseling ini?') && setCounselingLogs(counselingLogs.filter(l => l.id !== log.id))} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   
                   <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hasil Pertemuan:</p>
                      <p className={`text-sm leading-relaxed ${!showSensitiveData && log.isPrivate ? 'blur-sm select-none' : ''}`}>
                         {log.notes}
                      </p>
                      {!showSensitiveData && log.isPrivate && (
                        <div className="mt-2 text-[10px] text-rose-500 font-black flex items-center gap-1">
                           <AlertCircle size={10} /> Gunakan tombol 'Buka Data Privat' di atas untuk melihat isi.
                        </div>
                      )}
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase">
                         <History size={14} /> Follow Up: <span className="text-slate-700 dark:text-slate-300">{log.followUp}</span>
                      </div>
                      <Button variant="ghost" className="!p-1 text-[10px] font-black uppercase group">Detail Sesi <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                   </div>
                </Card>
              ))}
              {counselingLogs.length === 0 && (
                <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold">Belum ada riwayat konseling.</p>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-6">
              <Card title="Jadwal Konseling Minggu Ini">
                 <div className="space-y-4">
                    <div className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                       <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-sm">Sen</div>
                       <div className="flex-1">
                          <p className="text-sm font-black">Evaluasi Poin XII TKJ</p>
                          <p className="text-[10px] text-slate-400">09:00 - 10:30 • R. BK</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                       <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-sm">Sel</div>
                       <div className="flex-1">
                          <p className="text-sm font-black">Home Visit XI RPL</p>
                          <p className="text-[10px] text-slate-400">14:00 - Selesai</p>
                       </div>
                    </div>
                 </div>
                 <Button 
                    variant="secondary" 
                    className="w-full mt-4 text-[10px] font-black uppercase tracking-widest"
                    onClick={() => navigate('/academic/calendar')}
                 >
                    Lihat Kalender BK
                 </Button>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl relative overflow-hidden">
                 <Heart className="absolute -top-4 -right-4 w-24 h-24 opacity-10" />
                 <h4 className="font-black text-sm mb-4">Etika Konseling</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-6">Pastikan seluruh data konseling yang bersifat pribadi dijaga kerahasiaannya sesuai kode etik profesi Bimbingan & Konseling.</p>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Data Privacy</span>
                 </div>
              </Card>
           </div>
        </div>
      )}

      {/* VIEW: CAREER PLAN / TRACER STUDY */}
      {activeTab === 'career' && (
        <div className="space-y-6">
           <Card className="!p-0 border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Tracer Study & Minat Siswa (Kelas XII)</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Pemetaan Alumni & Penyaluran Lulusan</p>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                       <input 
                         type="text" 
                         placeholder="Cari siswa..." 
                         value={careerSearch}
                         onChange={(e) => setCareerSearch(e.target.value)}
                         className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" 
                       />
                    </div>
                    <Button variant="secondary" className="!py-2 !px-3" onClick={() => alert('Menyiapkan Laporan Tracer Study PDF...')}><Printer size={16} /></Button>
                 </div>
              </div>
              <Table headers={['Siswa', 'Rencana Lulus', 'Target / Instansi', 'Aksi']}>
                 {filteredCareer.length > 0 ? filteredCareer.map(plan => (
                   <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <td className="px-6 py-4">
                         <p className="text-sm font-black text-slate-800 dark:text-slate-100">{plan.studentName}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XII MULTIMEDIA 1</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                           plan.plan === 'Kuliah' ? 'bg-indigo-100 text-indigo-700' :
                           plan.plan === 'Kerja' ? 'bg-emerald-100 text-emerald-700' : 
                           plan.plan === 'Wirausaha' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                         }`}>
                           {plan.plan}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                         {plan.target || '-'}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex gap-2">
                            <button 
                                onClick={() => alert(`Detail Target: ${plan.target}\nCatatan: ${plan.notes}`)}
                                className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:scale-110 transition-transform" 
                                title="Lihat Detail Target"
                            >
                                <Target size={14} />
                            </button>
                            <button 
                                onClick={() => handleEditCareer(plan)}
                                className="p-2 text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg hover:text-indigo-600"
                                title="Edit Rencana"
                            >
                                <Edit size={14} />
                            </button>
                            <button 
                                onClick={() => deleteCareer(plan.id)}
                                className="p-2 text-slate-300 hover:text-rose-500"
                                title="Hapus"
                            >
                                <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-bold italic">Belum ada data perencanaan karir.</td>
                   </tr>
                 )}
              </Table>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Ingin Kuliah', count: stats.careerStats.kuliah, icon: <GraduationCap size={24}/>, color: 'indigo' },
                { label: 'Ingin Kerja', count: stats.careerStats.kerja, icon: <Briefcase size={24}/>, color: 'emerald' },
                { label: 'Ingin Wirausaha', count: stats.careerStats.usaha, icon: <Award size={24}/>, color: 'amber' },
              ].map(stat => (
                <Card key={stat.label} className="text-center group hover:border-indigo-500 transition-all border-2 border-transparent">
                   <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                   </div>
                   <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</h5>
                   <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">{stat.count}</p>
                </Card>
              ))}
           </div>
        </div>
      )}

      {/* VIEW: POINT RULES (CONFIG) */}
      {activeTab === 'config' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {POINT_RULES.map(cat => (
                <Card key={cat.category} title={cat.category} className="h-fit">
                   <div className="space-y-3">
                      {cat.items.map(item => (
                        <div key={item.name} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                           <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                           <span className="text-xs font-black text-rose-500">-{item.point} Poin</span>
                        </div>
                      ))}
                      <button className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all">Tambah Aturan</button>
                   </div>
                </Card>
              ))}
           </div>

           <Card className="bg-slate-900 text-white border-none p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                    <BookOpen size={40} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black mb-2 tracking-tight">Butuh Standar Buku Saku Kedisiplinan?</h4>
                    <p className="text-slate-400 text-sm max-w-xl">Seluruh poin di atas dikonfigurasi berdasarkan Peraturan Sekolah Tahun 2024. Anda dapat mengunduh dokumen resmi sebagai referensi fisik bagi guru dan orang tua.</p>
                 </div>
                 <Button variant="primary" className="!bg-white !text-slate-900 whitespace-nowrap"><Printer size={18} /> Cetak Buku Saku</Button>
              </div>
           </Card>
        </div>
      )}

      {/* MODAL: ADD VIOLATION */}
      <Modal isOpen={isViolationModalOpen} onClose={() => setIsViolationModalOpen(false)} title="Catat Pelanggaran Siswa">
         <form className="space-y-6" onSubmit={handleAddViolation}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Siswa & Rombel</label>
               <div className="grid grid-cols-2 gap-4">
                  <input required value={violationForm.studentName} onChange={e => setViolationForm({...violationForm, studentName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Nama Lengkap..." />
                  <input required value={violationForm.className} onChange={e => setViolationForm({...violationForm, className: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Kelas (Ex: X RPL 1)..." />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kategori Pelanggaran</label>
                  <select value={violationForm.category} onChange={e => setViolationForm({...violationForm, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold">
                     <option value="Disiplin">Disiplin (Waktu/Kehadiran)</option>
                     <option value="Kerapihan">Kerapihan (Seragam/Rambut)</option>
                     <option value="Etika">Etika (Sikap/Ucap)</option>
                     <option value="Berat">Pelanggaran Berat</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Bobot Poin</label>
                  <input type="number" value={violationForm.points} onChange={e => setViolationForm({...violationForm, points: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-rose-600" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Kronologi & Keterangan</label>
               <textarea required value={violationForm.description} onChange={e => setViolationForm({...violationForm, description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" placeholder="Tuliskan detail kejadian..."></textarea>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><AlertCircle size={18} /></div>
                  <div className="flex flex-col">
                     <span className="text-xs font-black uppercase">Push Notifikasi</span>
                     <span className="text-[9px] text-slate-400 font-bold">Kirim real-time ke aplikasi Orang Tua</span>
                  </div>
               </div>
               <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={violationForm.notifyParent} onChange={e => setViolationForm({...violationForm, notifyParent: e.target.checked})} />
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-700">Publikasikan & Kurangi Poin</Button>
         </form>
      </Modal>

      {/* MODAL: ADD COUNSELING */}
      <Modal isOpen={isCounselingModalOpen} onClose={() => setIsCounselingModalOpen(false)} title="Sesi Bimbingan & Konseling">
         <form className="space-y-6" onSubmit={handleAddCounseling}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Siswa</label>
               <input required value={counselingForm.studentName} onChange={e => setCounselingForm({...counselingForm, studentName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ketik nama siswa..." />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Kategori Bimbingan</label>
               <div className="grid grid-cols-4 gap-2">
                  {['Pribadi', 'Sosial', 'Belajar', 'Karir'].map(cat => (
                    <button 
                      type="button" 
                      key={cat} 
                      onClick={() => setCounselingForm({...counselingForm, category: cat})}
                      className={`py-2 text-[10px] font-black uppercase border rounded-xl transition-all ${
                        counselingForm.category === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-indigo-50 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Hasil Pembicaraan (Confidential)</label>
               <textarea required value={counselingForm.notes} onChange={e => setCounselingForm({...counselingForm, notes: e.target.value})} rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" placeholder="Tulis isi sesi konseling..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Rencana Tindak Lanjut</label>
                  <input required value={counselingForm.followUp} onChange={e => setCounselingForm({...counselingForm, followUp: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Panggilan Orang Tua" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Level Privasi</label>
                  <div className="flex items-center gap-4 h-full pt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-indigo-600" checked={counselingForm.isPrivate} onChange={e => setCounselingForm({...counselingForm, isPrivate: e.target.checked})} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Data Konfidensial</span>
                     </label>
                  </div>
               </div>
            </div>
            <Button type="submit" className="w-full py-4 shadow-xl shadow-indigo-500/10">Simpan Catatan BK Terenkripsi</Button>
         </form>
      </Modal>

      {/* MODAL: CAREER / TRACER STUDY */}
      <Modal isOpen={isCareerModalOpen} onClose={() => setIsCareerModalOpen(false)} title={editingCareerId ? "Edit Rencana Karir Siswa" : "Input Tracer Study / Rencana Karir"}>
         <form className="space-y-6" onSubmit={handleCareerSubmit}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Siswa XII</label>
               <input 
                  required 
                  value={careerForm.studentName} 
                  onChange={e => setCareerForm({...careerForm, studentName: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" 
                  placeholder="Ketik nama siswa..." 
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Rencana Setelah Lulus</label>
               <div className="grid grid-cols-4 gap-2">
                  {['Kuliah', 'Kerja', 'Wirausaha', 'Belum Tahu'].map(p => (
                    <button 
                      type="button" 
                      key={p} 
                      onClick={() => setCareerForm({...careerForm, plan: p as any})}
                      className={`py-2 text-[10px] font-black uppercase border rounded-xl transition-all ${
                        careerForm.plan === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-indigo-50 text-slate-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Instansi Target / Bidang</label>
               <input 
                  required 
                  value={careerForm.target} 
                  onChange={e => setCareerForm({...careerForm, target: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" 
                  placeholder="Ex: Universitas Gadjah Mada / PT. Shopee Indonesia" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Catatan & Kesiapan</label>
               <textarea 
                  rows={3} 
                  value={careerForm.notes} 
                  onChange={e => setCareerForm({...careerForm, notes: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" 
                  placeholder="Tulis detail persiapan atau kendala siswa..."
               ></textarea>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-indigo-500/10">
               {editingCareerId ? "Update Data Perencanaan" : "Simpan Data Tracer Study"}
            </Button>
         </form>
      </Modal>
    </div>
  );
};
