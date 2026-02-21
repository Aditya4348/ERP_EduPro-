
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button, Modal, Table } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { 
  ArrowLeft, Calendar, DollarSign, ListTodo, Users, 
  Clock, TrendingUp, CheckCircle2, Plus, Trash2, 
  Edit3, FileText, ChevronRight, PieChart, Info,
  AlertCircle, ArrowUpRight, ArrowDownRight, UserPlus,
  Target, Eye, Receipt, Tag, FileUp, X
} from 'lucide-react';
import { OSISProgram, OSISTask, OSISBudgetLog, OSISCommittee } from '../../types';

export const OSISProgramDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'finance' | 'team'>('overview');
  
  // Data State
  const [programs, setPrograms] = useLocalStorage<OSISProgram[]>('edupro_osis_programs', []);
  const program = useMemo(() => programs.find(p => p.id === id), [programs, id]);

  // UI States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isBudgetDetailOpen, setIsBudgetDetailOpen] = useState(false);
  const [selectedBudgetLog, setSelectedBudgetLog] = useState<OSISBudgetLog | null>(null);

  if (!program) return (
    <div className="p-8 text-center animate-fade-in">
      <Breadcrumbs />
      <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 font-medium italic">Program kerja tidak ditemukan atau telah dihapus.</p>
        <Button onClick={() => navigate('/student-affairs/osis')} className="mt-6 mx-auto">Kembali ke Dashboard OSIS</Button>
      </div>
    </div>
  );

  // Stats Logic
  const tasks = program.tasks || [];
  const budgetLogs = program.budgetLogs || [];
  const committee = program.committee || [];
  
  const totalExpense = budgetLogs.filter(l => l.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const budgetRemaining = program.budget - totalExpense;
  const taskProgress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) 
    : 0;

  // Handlers
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: OSISTask = {
      id: `t${Date.now()}`,
      title: formData.get('title') as string,
      assignee: formData.get('assignee') as string,
      status: 'Todo'
    };
    updateProgram({ ...program, tasks: [...tasks, newTask] });
    setIsTaskModalOpen(false);
  };

  const handleAddBudgetLog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: OSISBudgetLog = {
      id: `b${Date.now()}`,
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      type: formData.get('type') as any,
      date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
      category: formData.get('category') as string,
      receiptUrl: 'nota_mock_up.png' // Simulasi upload
    };
    updateProgram({ ...program, budgetLogs: [...budgetLogs, newLog] });
    setIsBudgetModalOpen(false);
  };

  const handleAddTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMember: OSISCommittee = {
      id: `c${Date.now()}`,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      jobdesk: formData.get('jobdesk') as string,
    };
    updateProgram({ ...program, committee: [...committee, newMember] });
    setIsTeamModalOpen(false);
  };

  const updateProgram = (updated: OSISProgram) => {
    setPrograms(programs.map(p => p.id === id ? updated : p));
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus: OSISTask['status'] = t.status === 'Todo' ? 'In Progress' : t.status === 'In Progress' ? 'Done' : 'Todo';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateProgram({ ...program, tasks: updatedTasks });
  };

  const openBudgetDetail = (log: OSISBudgetLog) => {
    setSelectedBudgetLog(log);
    setIsBudgetDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                 program.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                 program.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
               }`}>
                 {program.status}
               </span>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">ID: {program.id}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{program.title}</h2>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => alert('Fitur Cetak LPJ Segera Hadir!')}>
              <FileText size={18} /> Cetak Laporan
           </Button>
           <Button onClick={() => setIsTaskModalOpen(true)}>
              <Plus size={18} /> Tambah Tugas
           </Button>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Ringkasan Proyek', icon: <TrendingUp size={16} /> },
          { id: 'tasks', label: 'Manajemen Tugas', icon: <ListTodo size={16} /> },
          { id: 'finance', label: 'Keuangan & Nota', icon: <DollarSign size={16} /> },
          { id: 'team', label: 'Struktur Panitia', icon: <Users size={16} /> },
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

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
               <Card title="Deskripsi Kegiatan">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                     "{program.description || 'Program ini bertujuan untuk meningkatkan kreativitas dan kebersamaan antar siswa melalui kegiatan-kegiatan inovatif yang mendukung karakter Profil Pelajar Pancasila.'}"
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <Calendar className="mx-auto text-indigo-500 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Target Hari-H</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{program.date}</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <Clock className="mx-auto text-amber-500 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Waktu Persiapan</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">14 Hari Lagi</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <PieChart className="mx-auto text-emerald-500 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Status Persetujuan</p>
                        <p className="text-sm font-bold text-emerald-600 mt-1">Sudah Disetujui</p>
                     </div>
                  </div>
               </Card>

               <Card title="Peta Alur Kerja (Milestones)">
                  <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                     {[
                       { label: 'Perencanaan & Proposal', status: 'Done', desc: 'Penyusunan konsep dan pengajuan dana.' },
                       { label: 'Pembentukan Panitia', status: 'Done', desc: 'Pemilihan penanggung jawab divisi.' },
                       { label: 'Persiapan Teknis', status: 'In Progress', desc: 'Penyediaan sarana, prasarana, dan vendor.' },
                       { label: 'Pelaksanaan Kegiatan', status: 'Pending', desc: 'Hari pelaksanaan acara utama.' },
                     ].map((item, idx) => (
                       <div key={idx} className="relative pl-10">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 z-10 ${
                            item.status === 'Done' ? 'bg-emerald-500' : item.status === 'In Progress' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200 dark:bg-slate-700'
                          }`}>
                             {item.status === 'Done' && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                             <h5 className="text-sm font-black text-slate-800 dark:text-white">{item.label}</h5>
                             <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Todo', 'In Progress', 'Done'].map(status => (
                    <div key={status} className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{status}</h4>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                             {tasks.filter(t => t.status === status).length}
                          </span>
                       </div>
                       <div className="space-y-3">
                          {tasks.filter(t => t.status === status).map(task => (
                            <div key={task.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all group cursor-pointer" onClick={() => toggleTaskStatus(task.id)}>
                               <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">{task.title}</p>
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black uppercase">
                                        {task.assignee.charAt(0)}
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-500">{task.assignee}</span>
                                  </div>
                                  <button className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); updateProgram({...program, tasks: tasks.filter(t => t.id !== task.id)}) }}>
                                     <Trash2 size={12} />
                                  </button>
                               </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => setIsTaskModalOpen(true)}
                            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                          >
                             <Plus size={14} /> Tambah Item
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <Card className="!p-0 overflow-hidden shadow-xl border-2 border-slate-100 dark:border-slate-800">
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-lg">Alokasi & Penggunaan Dana</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Laporan Real-Time Bendahara Pelaksana</p>
                  </div>
                  <Button onClick={() => setIsBudgetModalOpen(true)} className="!py-2 !px-6 text-xs font-black shadow-lg shadow-indigo-500/20">
                    <Receipt size={14} /> Catat Transaksi
                  </Button>
               </div>
               <Table headers={['Deskripsi & Kategori', 'Tanggal', 'Nominal', 'Status', 'Aksi']}>
                  {budgetLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                       <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{log.description}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                             <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[9px] font-black uppercase rounded-md flex items-center gap-1">
                                <Tag size={8} /> {log.category || 'Lainnya'}
                             </span>
                             <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                               log.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                             }`}>
                                {log.type}
                             </span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-xs text-slate-500 font-mono">{log.date}</td>
                       <td className="px-6 py-4">
                          <span className={`text-sm font-black ${log.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {log.type === 'Income' ? '+' : '-'} Rp {log.amount.toLocaleString()}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          {log.receiptUrl ? (
                            <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase">
                               <CheckCircle2 size={12} /> Nota Terlampir
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                               <X size={12} /> No Nota
                            </div>
                          )}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex gap-2">
                             <button 
                               onClick={() => openBudgetDetail(log)}
                               className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                               title="Lihat Detail Transaksi"
                             >
                                <Eye size={16} />
                             </button>
                             <button 
                                onClick={() => updateProgram({...program, budgetLogs: budgetLogs.filter(l => l.id !== log.id)})}
                                className="p-2 text-slate-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {budgetLogs.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada catatan keuangan harian.</td></tr>
                  )}
               </Table>
            </Card>
          )}

          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {committee.map(person => (
                 <Card key={person.id} className="flex flex-col group h-full">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">
                          {person.name.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-800 dark:text-slate-100 truncate">{person.name}</h5>
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{person.role}</p>
                       </div>
                       <button onClick={() => updateProgram({...program, committee: committee.filter(p => p.id !== person.id)})} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                       </button>
                    </div>
                    {person.jobdesk && (
                       <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                             <Target size={10} /> Deskripsi Tugas:
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-3">
                             "{person.jobdesk}"
                          </p>
                       </div>
                    )}
                 </Card>
               ))}
               <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center py-10 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer group" onClick={() => setIsTeamModalOpen(true)}>
                  <UserPlus size={20} className="group-hover:scale-110 transition-transform mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tambah Panitia</span>
               </Card>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar Stats) */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden">
              <TrendingUp className="absolute -right-4 -bottom-4 opacity-10" size={120} />
              <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                 <CheckCircle2 size={20} /> Kesehatan Proyek
              </h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-indigo-200 mb-2">
                       <span>Penyelesaian Tugas</span>
                       <span>{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                       <div className="bg-white h-full transition-all duration-1000" style={{width: `${taskProgress}%`}}></div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                       <p className="text-[8px] font-black uppercase text-indigo-200">Dana Terpakai</p>
                       <p className="text-sm font-black mt-1">Rp {totalExpense.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                       <p className="text-[8px] font-black uppercase text-indigo-200">Sisa Anggaran</p>
                       <p className="text-sm font-black mt-1">Rp {budgetRemaining.toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card title="Informasi Penting">
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg h-fit"><AlertCircle size={16} /></div>
                    <div>
                       <p className="text-xs font-bold text-slate-800">LPJ Deadline</p>
                       <p className="text-[10px] text-slate-500">Maksimal 7 hari setelah acara selesai ({program.date}).</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg h-fit"><Info size={16} /></div>
                    <div>
                       <p className="text-xs font-bold text-slate-800">Koordinasi Divisi</p>
                       <p className="text-[10px] text-slate-500">Pastikan setiap ketua divisi mengisi progres tugas setiap hari.</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card title="Dokumen Pendukung" className="shadow-lg">
              <div className="space-y-2">
                 {[
                   { name: 'Proposal_Kegiatan.pdf', type: 'PDF' },
                   { name: 'Flyer_Promotion.png', type: 'IMG' },
                   { name: 'RAB_Final.xlsx', type: 'XLS' },
                 ].map(doc => (
                   <div key={doc.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group hover:bg-indigo-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <FileText size={14} className="text-slate-400" />
                         <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{doc.name}</span>
                      </div>
                      <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                   </div>
                 ))}
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest mt-2 border-2 border-dashed border-slate-200">Unggah Berkas Baru</Button>
              </div>
           </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Tambah Tugas Panitia">
         <form className="space-y-6" onSubmit={handleAddTask}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Deskripsi Tugas</label>
               <input name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Menyiapkan konsumsi pemateri" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Penanggung Jawab (Nama Panitia)</label>
               <input name="assignee" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ketik nama anggota..." />
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-indigo-500/20">Delegasikan Tugas</Button>
         </form>
      </Modal>

      <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Catat Penggunaan Anggaran">
         <form className="space-y-6" onSubmit={handleAddBudgetLog}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Deskripsi Transaksi</label>
               <input name="description" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black outline-none focus:border-indigo-500 transition-all" placeholder="Ex: Sewa tenda dan panggung" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kategori</label>
                  <select name="category" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none">
                     <option value="Konsumsi">Konsumsi</option>
                     <option value="Perlengkapan">Perlengkapan</option>
                     <option value="Humas & Publikasi">Humas & Publikasi</option>
                     <option value="Transportasi">Transportasi</option>
                     <option value="Kesekretariatan">Kesekretariatan</option>
                     <option value="Lainnya">Lainnya</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal Transaksi</label>
                  <input name="date" type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipe Aliran</label>
                  <select name="type" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none">
                     <option value="Expense">Pengeluaran (Expense)</option>
                     <option value="Income">Pemasukan / Dana Tambahan (Income)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nominal (Rp)</label>
                  <input name="amount" type="number" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black outline-none" placeholder="0" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upload Nota / Kuitansi</label>
               <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group">
                  <FileUp size={32} className="mx-auto text-slate-300 group-hover:text-indigo-600 transition-colors mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih berkas nota</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, PDF (Maks 2MB)</p>
               </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-indigo-500/20">Simpan Log Keuangan</Button>
         </form>
      </Modal>

      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Daftarkan Panitia Pelaksana">
         <form className="space-y-6" onSubmit={handleAddTeam}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Anggota OSIS</label>
               <input name="name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ketik nama anggota..." />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Jabatan Panitia</label>
               <input name="role" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold" placeholder="Ex: Ketua Pelaksana / Seksi Humas" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Jobdesk / Deskripsi Tugas</label>
               <textarea name="jobdesk" rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500" placeholder="Jelaskan apa saja tugas dari jabatan ini secara spesifik..."></textarea>
            </div>
            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-indigo-500/20">Tambahkan ke Struktur</Button>
         </form>
      </Modal>

      {/* Modal: Detail Transaksi Anggaran */}
      <Modal isOpen={isBudgetDetailOpen} onClose={() => setIsBudgetDetailOpen(false)} title="Rincian Transaksi Anggaran">
         {selectedBudgetLog && (
           <div className="space-y-6">
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${selectedBudgetLog.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {selectedBudgetLog.type === 'Income' ? <ArrowDownRight size={32} /> : <ArrowUpRight size={32} />}
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white">Rp {selectedBudgetLog.amount.toLocaleString()}</h3>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedBudgetLog.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Kategori</p>
                    <p className="text-sm font-bold text-indigo-600 uppercase">{selectedBudgetLog.category || 'Lainnya'}</p>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Waktu Catat</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedBudgetLog.date}</p>
                 </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Deskripsi Transaksi</p>
                 <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">"{selectedBudgetLog.description}"</p>
              </div>

              <div className="space-y-3">
                 <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Receipt size={14} /> Bukti Nota Digital
                 </h5>
                 <div className="aspect-video bg-slate-100 dark:bg-slate-950 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Simulasi Pratinjau Nota */}
                    <ImageIcon size={48} className="text-slate-300 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400">Pratinjau Nota ({selectedBudgetLog.receiptUrl})</p>
                    <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors"></div>
                 </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <Button variant="secondary" className="flex-1" onClick={() => setIsBudgetDetailOpen(false)}>Tutup</Button>
                 <Button className="flex-[2]" onClick={() => alert('Membuka file nota asli...')}>Unduh Bukti Asli</Button>
              </div>
           </div>
         )}
      </Modal>
    </div>
  );
};

// Mock Icon
const ImageIcon: React.FC<{size: number, className?: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
