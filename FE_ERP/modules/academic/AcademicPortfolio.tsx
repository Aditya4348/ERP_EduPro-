
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, Button, Modal, Table } from '@/components/UI';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StudentProject, UserRole, ProjectAsset } from '@/types';
import { 
  Award, Star, ExternalLink, Image as ImageIcon, 
  Briefcase, TrendingUp, Github, Youtube, 
  Figma, Globe, FileText, Video, Plus, 
  CheckCircle2, XCircle, Clock, Filter, Search,
  Tag, MessageSquare, ChevronRight, MoreVertical
} from 'lucide-react';

const INITIAL_PROJECTS: StudentProject[] = [
  { 
    id: '1', 
    title: 'EduPro ERP UI Kit', 
    studentName: 'Ahmad Faisal', 
    studentId: 'stud-1',
    category: 'Design', 
    date: '2024-03-10',
    description: 'Sistem desain komprehensif untuk aplikasi ERP sekolah menggunakan Figma.',
    status: 'Approved', 
    score: 95,
    tags: ['UI/UX', 'Figma', 'SaaS'],
    links: { behance: 'https://behance.net/faisal', other: 'https://figma.com/file/123' },
    assets: [
      { id: 'a1', type: 'IMAGE', name: 'Preview 1', url: '#' },
      { id: 'a2', type: 'PDF', name: 'Design Documentation', url: '#' }
    ]
  },
  { 
    id: '2', 
    title: 'Aplikasi Kasir Berbasis Java', 
    studentName: 'Budi Santoso', 
    studentId: 'stud-2',
    category: 'Desktop', 
    date: '2024-03-05',
    description: 'Aplikasi manajemen stok dan kasir untuk UMKM.',
    status: 'Pending', 
    score: 88,
    tags: ['Java', 'MySQL', 'Desktop'],
    links: { github: 'https://github.com/budi/kasir-java' },
    assets: [
      { id: 'a3', type: 'VIDEO', name: 'Demo Video', url: '#' }
    ]
  },
  { 
    id: '3', 
    title: 'Landing Page Desa Wisata', 
    studentName: 'Citra Dewi', 
    studentId: 'stud-3',
    category: 'Web Development', 
    date: '2024-02-28',
    description: 'Website promosi potensi wisata desa menggunakan React dan Tailwind.',
    status: 'Approved', 
    score: 92,
    tags: ['React', 'Tailwind', 'Vite'],
    links: { github: 'https://github.com/citra/desa-wisata', youtube: 'https://youtube.com/watch?v=123' },
    assets: [
      { id: 'a4', type: 'IMAGE', name: 'Hero Section', url: '#' }
    ]
  },
];

export const AcademicPortfolio: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useLocalStorage<StudentProject[]>('edupro_student_projects_v2', INITIAL_PROJECTS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [activeView, setActiveView] = useState<'all' | 'pending' | 'my-projects'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const isTeacher = user?.role === UserRole.GURU || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.WAKASEK;

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeView === 'pending') return p.status === 'Pending' && matchesSearch;
      if (activeView === 'my-projects') return p.studentId === 'stud-1' && matchesSearch; // Mock student id
      if (activeView === 'all') return p.status === 'Approved' && matchesSearch;
      
      return matchesSearch;
    });
  }, [projects, activeView, searchTerm]);

  const handleStatusUpdate = (id: string, newStatus: 'Approved' | 'Rejected', feedback: string = '') => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, status: newStatus, teacherFeedback: feedback } : p
    ));
    setIsDetailModalOpen(false);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified upload logic for demo
    alert('Karya Anda telah diunggah dan menunggu verifikasi guru.');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
            <Award size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Portofolio & Karya Siswa</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Etalase Kompetensi & Bukti Belajar Digital</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           {isTeacher && (
              <Button 
                variant={activeView === 'pending' ? 'primary' : 'secondary'}
                onClick={() => setActiveView(activeView === 'pending' ? 'all' : 'pending')}
                className="relative"
              >
                <Clock size={16} /> Verifikasi
                {projects.filter(p => p.status === 'Pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                    {projects.filter(p => p.status === 'Pending').length}
                  </span>
                )}
              </Button>
           )}
           <Button onClick={() => setIsUploadModalOpen(true)}>
             <Plus size={18} /> Unggah Karya
           </Button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Showcase</p>
            <p className="text-4xl font-black mt-1">{projects.filter(p => p.status === 'Approved').length}</p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs">
               <CheckCircle2 size={14} /> Terverifikasi Global
            </div>
         </Card>

         <Card className="flex flex-col items-center text-center justify-center p-8 group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all bg-white dark:bg-slate-900" onClick={() => setIsUploadModalOpen(true)}>
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:rotate-12 transition-all mb-4">
               <Plus size={32} />
            </div>
            <h4 className="font-black text-slate-800 dark:text-slate-200">Submit Baru</h4>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Digital Question Asset</p>
         </Card>

         <Card className="flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Top Skill Tag</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {['ReactJS', 'UI/UX', 'Python', 'IoT'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black rounded-md">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-600 font-black">
               Lihat Matriks Kompetensi <ChevronRight size={12} />
            </div>
         </Card>

         <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-center text-center">
            <Award size={32} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">98%</p>
            <p className="text-[9px] font-black uppercase text-emerald-600/60">Quality Approval Rate</p>
         </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari judul karya atau nama siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary" className="!p-2.5"><Filter size={18} /></Button>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             <button 
              onClick={() => setActiveView('all')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
             >
              Publik
             </button>
             <button 
              onClick={() => setActiveView('my-projects')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'my-projects' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
             >
              Milik Saya
             </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredProjects.length > 0 ? filteredProjects.map(p => (
           <Card 
            key={p.id} 
            onClick={() => { setSelectedProject(p); setIsDetailModalOpen(true); }}
            className="group hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative border-2 border-transparent hover:border-indigo-500 shadow-xl"
           >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                 <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                   p.status === 'Approved' ? 'bg-emerald-500 text-white' :
                   p.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                 }`}>
                   {p.status}
                 </span>
              </div>

              <div className="h-44 bg-slate-100 dark:bg-slate-800 mb-4 rounded-xl flex items-center justify-center relative overflow-hidden">
                 <ImageIcon size={48} className="text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                       {p.links.github && <div className="p-2 bg-white rounded-lg text-slate-900"><Github size={16} /></div>}
                       {p.links.behance && <div className="p-2 bg-white rounded-lg text-indigo-600"><Figma size={16} /></div>}
                       {p.links.youtube && <div className="p-2 bg-white rounded-lg text-rose-600"><Youtube size={16} /></div>}
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-start">
                    <div className="flex-1">
                       <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md mb-2 inline-block">
                        {p.category}
                       </span>
                       <h5 className="font-black text-slate-800 dark:text-slate-100 text-lg line-clamp-1">{p.title}</h5>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Oleh: {p.studentName}</p>
                    </div>
                    {p.score && (
                      <div className="text-right">
                         <p className="text-xl font-black text-emerald-600">{p.score}</p>
                         <p className="text-[8px] text-slate-400 font-bold uppercase">Skor Profesi</p>
                      </div>
                    )}
                 </div>

                 <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                   {p.description}
                 </p>

                 <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                 </div>
              </div>
           </Card>
         )) : (
           <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-300">
                 <Search size={40} />
              </div>
              <div>
                 <p className="text-lg font-black text-slate-800 dark:text-slate-200">Belum Ada Karya Ditemukan</p>
                 <p className="text-sm text-slate-500">Jadilah yang pertama untuk memamerkan kreativitasmu!</p>
              </div>
              <Button onClick={() => setIsUploadModalOpen(true)}>Unggah Karya Pertama Anda</Button>
           </div>
         )}
      </div>

      {/* MODAL: UPLOAD (ENHANCED WITH SPECIFIC LINKS & TAGS) */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Unggah Karya & Portofolio">
         <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Judul Project</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Nama karya anda..." />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kategori</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                     <option>Web Development</option>
                     <option>Mobile App</option>
                     <option>UI/UX Design</option>
                     <option>IoT / Hardware</option>
                     <option>Graphic Design</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Deskripsi Singkat</label>
               <textarea required rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Jelaskan tentang apa project ini dan masalah apa yang diselesaikan..."></textarea>
            </div>

            {/* SKILL TAGGING */}
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Skill Tags (Keahlian)</label>
               <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {['React', 'NodeJS', 'Tailwind'].map(t => (
                    <span key={t} className="px-3 py-1 bg-white dark:bg-slate-900 text-[10px] font-black text-indigo-600 rounded-lg flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                      {t} <XCircle size={12} className="cursor-pointer text-slate-300 hover:text-rose-500" />
                    </span>
                  ))}
                  <input className="bg-transparent outline-none text-xs font-bold text-slate-500 min-w-[100px]" placeholder="Tambah tag..." />
               </div>
            </div>

            {/* SPECIFIC PLATFORM LINKS */}
            <div className="p-5 bg-slate-900 rounded-3xl space-y-4 border border-indigo-500/20 shadow-2xl">
               <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                  <ExternalLink size={14} /> Link Platform Profesional
               </h5>
               <div className="space-y-3">
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="GitHub Repository URL" />
                  </div>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-rose-500" placeholder="Demo Video URL (Youtube)" />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-500" placeholder="Live Preview / Behance URL" />
                  </div>
               </div>
            </div>

            {/* MULTI ASSET UPLOAD */}
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Dokumentasi & Aset (Multi-File)</label>
               <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group">
                     <FileText size={24} className="mx-auto text-slate-300 group-hover:text-indigo-600 mb-2" />
                     <p className="text-[9px] font-black uppercase text-slate-500">Laporan (PDF)</p>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group">
                     <ImageIcon size={24} className="mx-auto text-slate-300 group-hover:text-rose-600 mb-2" />
                     <p className="text-[9px] font-black uppercase text-slate-500">Galeri Foto</p>
                  </div>
               </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-black shadow-xl shadow-indigo-500/20">Submit Karya Untuk Review</Button>
         </form>
      </Modal>

      {/* MODAL: DETAIL & APPROVAL */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Pratinjau Karya Siswa">
         {selectedProject && (
           <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-4">
                    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                       <ImageIcon size={64} className="text-slate-300" />
                    </div>
                    <div className="flex gap-2">
                       {selectedProject.links.github && (
                         <a href={selectedProject.links.github} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black">
                            <Github size={16} /> GitHub
                         </a>
                       )}
                       {selectedProject.links.youtube && (
                         <a href={selectedProject.links.youtube} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black">
                            <Youtube size={16} /> YouTube
                         </a>
                       )}
                    </div>
                 </div>
                 <div className="flex-[1.5] space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedProject.title}</h3>
                          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Oleh {selectedProject.studentName}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         selectedProject.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                       }`}>
                         {selectedProject.status}
                       </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{selectedProject.description}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {selectedProject.tags.map(t => (
                         <span key={t} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black text-slate-500 rounded-lg">
                           #{t}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              {/* ASSETS LIST */}
              <div className="space-y-3">
                 <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Aset Pendukung & Dokumentasi</h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.assets.map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group border border-transparent hover:border-indigo-500 transition-all">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${
                             asset.type === 'PDF' ? 'text-rose-500' : 
                             asset.type === 'VIDEO' ? 'text-indigo-500' : 'text-emerald-500'
                           }`}>
                             {asset.type === 'PDF' ? <FileText size={16} /> : asset.type === 'VIDEO' ? <Video size={16} /> : <ImageIcon size={16} />}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-200">{asset.name}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">{asset.type} Format</p>
                           </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-500" />
                      </div>
                    ))}
                 </div>
              </div>

              {/* TEACHER VERIFICATION ACTION */}
              {isTeacher && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-800">
                      <h5 className="text-[10px] font-black uppercase text-indigo-600 mb-4 flex items-center gap-2">
                         <ShieldCheck size={14} /> Panel Verifikasi Guru Pembimbing
                      </h5>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Feedback Akademik</label>
                            <textarea className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:border-indigo-500" placeholder="Tulis masukan untuk siswa..."></textarea>
                         </div>
                         <div className="flex gap-3">
                            <button 
                              onClick={() => handleStatusUpdate(selectedProject.id, 'Rejected')}
                              className="flex-1 py-3 px-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                            >
                               <XCircle size={16} /> Tolak Karya
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(selectedProject.id, 'Approved')}
                              className="flex-[2] py-4 px-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                               <CheckCircle2 size={18} /> Approve & Publish
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
         )}
      </Modal>
    </div>
  );
};

// Mock Icons for missing references
const ShieldCheck: React.FC<{size: number, className?: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
);
