
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../components/UI';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HelpGuide } from '../components/HelpGuide';
import { 
  ClipboardList, Plus, Search, BookOpen, 
  Clock, Users, Trash2, Edit3, CheckCircle2, 
  HelpCircle, LayoutGrid, ListTodo, FileUp, 
  FileDown, Shuffle, ShieldAlert, Monitor, 
  Key, Save, Share2, BarChart3, AlertTriangle,
  Image as ImageIcon, Volume2, Calculator,
  ExternalLink, Maximize2, Zap, Calendar as CalendarIcon,
  Folder, ChevronRight, ArrowLeft, Filter, Layers
} from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  subject: string;
  grade: string;
  type: 'Pilihan Ganda' | 'Essay';
  text: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  media?: {
    image?: string;
    audio?: string;
    formula?: string;
  };
  options?: QuestionOption[];
  correctAnswer?: string;
  analytics?: {
    totalAnswered: number;
    correctRate: number;
  };
}

interface Participant {
  id: string;
  name: string;
  nis: string;
  status: 'Online' | 'Offline' | 'Tab Switch Alert';
  progress: number;
  lastActivity: string;
}

interface ExamSession {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  status: 'Scheduled' | 'Ongoing' | 'Finished';
  participantsCount: number;
  config: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    token: string;
    fullScreenRequired: boolean;
    autoSave: boolean;
  };
}

const INITIAL_QUESTIONS: Question[] = [
  { 
    id: '1', 
    subject: 'Matematika', 
    grade: 'X',
    type: 'Pilihan Ganda', 
    text: 'Berapakah hasil dari 15 x 12?', 
    difficulty: 'Mudah',
    options: [
      { id: 'a', text: '180', isCorrect: true },
      { id: 'b', text: '170', isCorrect: false },
      { id: 'c', text: '190', isCorrect: false },
      { id: 'd', text: '160', isCorrect: false },
    ],
    analytics: { totalAnswered: 120, correctRate: 85 }
  },
  { 
    id: '2', 
    subject: 'Bahasa Indonesia', 
    grade: 'XI',
    type: 'Essay', 
    text: 'Jelaskan pengertian dari majas metafora!', 
    difficulty: 'Sedang',
    media: { audio: 'listening_sample.mp3' },
    analytics: { totalAnswered: 115, correctRate: 45 }
  },
  { 
    id: '3', 
    subject: 'Informatika', 
    grade: 'X',
    type: 'Pilihan Ganda', 
    text: 'Manakah yang merupakan bahasa pemrograman berorientasi objek?', 
    difficulty: 'Sulit',
    media: { image: 'oop_diagram.png' },
    options: [
      { id: 'a', text: 'Java', isCorrect: true },
      { id: 'b', text: 'C', isCorrect: false },
      { id: 'c', text: 'Assembly', isCorrect: false },
      { id: 'd', text: 'HTML', isCorrect: false },
    ],
    analytics: { totalAnswered: 120, correctRate: 30 }
  },
];

const INITIAL_EXAMS: ExamSession[] = [
  { 
    id: 'EX-001', 
    title: 'UTS Ganjil 2024', 
    subject: 'Matematika', 
    date: '2024-03-20', 
    duration: 90, 
    status: 'Scheduled', 
    participantsCount: 120,
    config: { shuffleQuestions: true, shuffleOptions: true, token: 'B7A2X', fullScreenRequired: true, autoSave: true }
  },
  { 
    id: 'EX-002', 
    title: 'Kuis Harian 1', 
    subject: 'Informatika', 
    date: '2024-03-12', 
    duration: 30, 
    status: 'Ongoing', 
    participantsCount: 36,
    config: { shuffleQuestions: false, shuffleOptions: false, token: 'Z9K1M', fullScreenRequired: false, autoSave: true }
  },
];

const MOCK_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Ahmad Faisal', nis: '2024001', status: 'Online', progress: 85, lastActivity: '2m ago' },
  { id: '2', name: 'Budi Santoso', nis: '2024002', status: 'Tab Switch Alert', progress: 45, lastActivity: 'Just now' },
  { id: '3', name: 'Citra Dewi', nis: '2024003', status: 'Online', progress: 100, lastActivity: 'Finished' },
  { id: '4', name: 'Dedi Kurniawan', nis: '2024004', status: 'Offline', progress: 10, lastActivity: '15m ago' },
];

export const AcademicCBT: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bank' | 'exams' | 'proctoring' | 'analytics'>('exams');
  const [questions, setQuestions] = useLocalStorage<Question[]>('edupro_cbt_questions_v2', INITIAL_QUESTIONS);
  const [exams, setExams] = useLocalStorage<ExamSession[]>('edupro_cbt_exams_v2', INITIAL_EXAMS);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  
  // Refined Bank Soal View State
  const [selectedBankSubject, setSelectedBankSubject] = useState<string | null>(null);
  const [selectedBankGrade, setSelectedBankGrade] = useState<string>('X');
  const [bankSearchTerm, setBankSearchTerm] = useState('');

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const selectedExam = useMemo(() => exams.find(e => e.id === selectedExamId), [exams, selectedExamId]);

  const deleteQuestion = (id: string) => {
    if(confirm('Hapus pertanyaan ini dari bank soal?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const deleteExam = (id: string) => {
    if(confirm('Batalkan jadwal ujian ini?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const startProctoring = (id: string) => {
    setSelectedExamId(id);
    setActiveTab('proctoring');
  };

  // Helper logic for grouping
  const uniqueSubjects = useMemo(() => Array.from(new Set(questions.map(q => q.subject))), [questions]);
  const grades = ['X', 'XI', 'XII'];

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSubject = selectedBankSubject ? q.subject === selectedBankSubject : true;
      const matchGrade = q.grade === selectedBankGrade;
      const matchSearch = q.text.toLowerCase().includes(bankSearchTerm.toLowerCase());
      return matchSubject && matchGrade && matchSearch;
    });
  }, [questions, selectedBankSubject, selectedBankGrade, bankSearchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
            <ClipboardList size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">CBT & Bank Soal</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Sistem Ujian Terintegrasi & Digital Question Assets</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'bank' && (
            <>
              <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}><FileUp size={16} /> Bulk Import</Button>
              <Button onClick={() => setIsQuestionModalOpen(true)}><Plus size={18} /> Tambah Soal</Button>
            </>
          )}
          {activeTab === 'exams' && (
            <Button onClick={() => setIsExamModalOpen(true)}><Plus size={18} /> Jadwalkan Ujian</Button>
          )}
          {activeTab === 'proctoring' && (
             <Button variant="secondary" className="text-rose-600" onClick={() => alert('Ujian Dihentikan Paksa')}>
                <ShieldAlert size={16} /> Hentikan Ujian
             </Button>
          )}
        </div>
      </div>

      {/* Primary Tabs Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
        {[
          { id: 'exams', label: 'Jadwal Ujian', icon: <LayoutGrid size={16} /> },
          { id: 'bank', label: 'Bank Soal', icon: <ListTodo size={16} /> },
          { id: 'proctoring', label: 'Proctoring', icon: <Monitor size={16} />, disabled: !selectedExamId },
          { id: 'analytics', label: 'Analisis Soal', icon: <BarChart3 size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${
              activeTab === tab.id 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl shadow-indigo-500/10' 
              : tab.disabled ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW: EXAM SCHEDULE */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="relative overflow-hidden group hover:border-indigo-500 transition-all border-2 border-transparent shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  exam.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 
                  exam.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {exam.status === 'Ongoing' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                  {exam.status}
                </div>
                <div className="flex gap-1">
                   <button className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 size={16} /></button>
                   <button onClick={() => deleteExam(exam.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{exam.title}</h3>
              <p className="text-xs text-indigo-500 font-black uppercase mt-1 tracking-widest">{exam.subject}</p>
              
              <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-2"><Clock size={14} /> Durasi</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{exam.duration} Menit</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-2"><Users size={14} /> Peserta</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{exam.participantsCount} Siswa</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-2"><Key size={14} /> Token Akses</span>
                    <span className="font-mono font-black text-indigo-600 tracking-widest">{exam.config.token}</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><CalendarIcon size={12} /> {exam.date}</span>
                <Button 
                  onClick={() => startProctoring(exam.id)}
                  variant={exam.status === 'Ongoing' ? 'primary' : 'secondary'} 
                  className="!px-4 !py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                   {exam.status === 'Ongoing' ? <Monitor size={14} /> : <ClipboardList size={14} />}
                   {exam.status === 'Ongoing' ? 'Proctoring' : 'Lihat Detail'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW: PROCTORING DASHBOARD */}
      {activeTab === 'proctoring' && selectedExam && (
        <div className="space-y-6">
           <Card className="bg-slate-900 text-white border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldAlert size={120} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">Live Proctoring</span>
                       <span className="text-slate-400 text-sm font-bold">Token: <span className="text-white font-mono tracking-widest">{selectedExam.config.token}</span></span>
                    </div>
                    <h3 className="text-3xl font-black">{selectedExam.title}</h3>
                    <p className="text-slate-400 mt-1">{selectedExam.subject} • Sesi Aktif</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Hadir</p>
                       <p className="text-2xl font-black text-emerald-400">32/36</p>
                    </div>
                    <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pelanggaran</p>
                       <p className="text-2xl font-black text-rose-400">1</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {MOCK_PARTICIPANTS.map(p => (
                   <Card key={p.id} className={`!p-4 border-2 transition-all ${
                     p.status === 'Tab Switch Alert' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 
                     p.status === 'Offline' ? 'border-slate-200 opacity-50' : 'border-emerald-100 dark:border-emerald-900/30'
                   }`}>
                      <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                               {p.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800 dark:text-slate-100">{p.name}</p>
                               <p className="text-[10px] font-mono text-slate-400">{p.nis}</p>
                            </div>
                         </div>
                         <div className={`p-1.5 rounded-lg ${
                           p.status === 'Tab Switch Alert' ? 'bg-rose-500 text-white animate-bounce' :
                           p.status === 'Online' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                         }`}>
                            {p.status === 'Tab Switch Alert' ? <ShieldAlert size={14} /> : p.status === 'Online' ? <Zap size={14} /> : <Clock size={14} />}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                            <span>Progres</span>
                            <span className="text-indigo-600">{p.progress}%</span>
                         </div>
                         <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{width: `${p.progress}%`}}></div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] text-slate-400 italic">
                            <span>Status: {p.status}</span>
                            <span>{p.lastActivity}</span>
                         </div>
                      </div>

                      {p.status === 'Tab Switch Alert' && (
                        <Button variant="danger" className="w-full mt-4 !py-2 text-[10px] uppercase font-black">
                           Force Logout
                        </Button>
                      )}
                   </Card>
                 ))}
              </div>

              <div className="lg:col-span-1 space-y-6">
                 <Card title="Peta Navigasi Soal" className="!p-4">
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed italic">Representasi visual pengisian soal siswa terpilih (Preview Mode).</p>
                    <div className="grid grid-cols-5 gap-2">
                       {Array.from({length: 40}).map((_, i) => {
                         const status = i < 15 ? 'filled' : i === 15 ? 'active' : i < 20 ? 'doubt' : 'empty';
                         return (
                           <div 
                            key={i} 
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                              status === 'filled' ? 'bg-emerald-500 text-white' :
                              status === 'active' ? 'bg-indigo-600 text-white scale-110 shadow-lg' :
                              status === 'doubt' ? 'bg-amber-400 text-white animate-pulse' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                           >
                             {i + 1}
                           </div>
                         );
                       })}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Terjawab
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div> Ragu-ragu
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <div className="w-2 h-2 bg-slate-200 rounded-full"></div> Belum
                       </div>
                    </div>
                 </Card>

                 <Card title="Pengaturan Cepat" className="!p-4">
                    <div className="space-y-2">
                       <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-indigo-600 shadow-sm"><Shuffle size={14} /></div>
                             <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Acak Soal Sekarang</span>
                          </div>
                          <Zap size={12} className="text-slate-300" />
                       </button>
                       <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-rose-600 shadow-sm"><Maximize2 size={14} /></div>
                             <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Force Fullscreen All</span>
                          </div>
                          <ShieldAlert size={12} className="text-slate-300" />
                       </button>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      )}

      {/* VIEW: BANK SOAL (REFACTORED FOR SUBJECT & GRADE GROUPING) */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {!selectedBankSubject ? (
            /* LEVEL 1: Subject Gallery (Folders) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {uniqueSubjects.map(subject => {
                const count = questions.filter(q => q.subject === subject).length;
                return (
                  <Card 
                    key={subject}
                    onClick={() => setSelectedBankSubject(subject)}
                    className="cursor-pointer group hover:border-indigo-500 hover:shadow-2xl transition-all border-2 border-transparent relative overflow-hidden"
                  >
                    <div className="absolute -top-4 -right-4 text-indigo-100 dark:text-indigo-900/20 group-hover:scale-125 transition-transform duration-500">
                      <Folder size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:rotate-12 transition-transform">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{subject}</h4>
                      <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">{count} Butir Soal</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Card>
                );
              })}
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center py-12 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer group">
                 <Plus size={32} className="group-hover:scale-110 transition-transform mb-2" />
                 <span className="text-xs font-black uppercase tracking-widest">Mata Pelajaran Baru</span>
              </Card>
            </div>
          ) : (
            /* LEVEL 2: Grade Tabs & Question List */
            <div className="space-y-6 animate-fade-in">
              {/* Context Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedBankSubject(null)}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedBankSubject}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kategori: Bank Soal Digital</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="!p-2.5" onClick={() => setIsImportModalOpen(true)}><FileUp size={18} /></Button>
                  <Button onClick={() => setIsQuestionModalOpen(true)}><Plus size={18} /> Tambah Soal</Button>
                </div>
              </div>

              {/* Grade Sub-Tabs */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 overflow-x-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 shrink-0">
                  <Layers size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pilih Kelas:</span>
                </div>
                {grades.map(grade => (
                  <button
                    key={grade}
                    onClick={() => setSelectedBankGrade(grade)}
                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                      selectedBankGrade === grade 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 border border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    Kelas {grade}
                  </button>
                ))}
              </div>

              {/* Filterable Table */}
              <Card className="!p-0 overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                   <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={`Cari soal ${selectedBankSubject} kelas ${selectedBankGrade}...`}
                        value={bankSearchTerm}
                        onChange={(e) => setBankSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm"
                      />
                   </div>
                   <div className="flex gap-2">
                      <Button variant="secondary" className="!p-2.5" title="Download Excel Template"><FileDown size={18} /></Button>
                   </div>
                </div>
                <Table headers={['Pratinjau Soal & Media', 'Tipe', 'Kesulitan', 'Analisis', 'Aksi']}>
                  {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 max-w-sm">
                        <div className="flex flex-col gap-2">
                           <p className="text-sm text-slate-800 dark:text-slate-200 font-bold line-clamp-2 leading-relaxed">{q.text}</p>
                           <div className="flex gap-2">
                              {q.media?.image && <span className="flex items-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md"><ImageIcon size={10} /> Image</span>}
                              {q.media?.audio && <span className="flex items-center gap-1 text-[9px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md"><Volume2 size={10} /> Audio</span>}
                              {q.media?.formula && <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md"><Calculator size={10} /> LaTeX</span>}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">{q.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          q.difficulty === 'Mudah' ? 'text-emerald-500' :
                          q.difficulty === 'Sedang' ? 'text-amber-500' : 'text-rose-500'
                        }`}>{q.difficulty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                           <div className="flex justify-between text-[9px] font-black text-slate-400">
                              <span>Success</span>
                              <span className={q.analytics && q.analytics.correctRate > 70 ? 'text-emerald-500' : 'text-rose-500'}>
                                 {q.analytics?.correctRate}%
                              </span>
                           </div>
                           <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${q.analytics && q.analytics.correctRate > 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                style={{width: `${q.analytics?.correctRate}%`}}
                              ></div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => deleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Filter size={32} />
                          <p className="text-sm font-bold">Belum ada soal untuk {selectedBankSubject} Kelas {selectedBankGrade}.</p>
                          <Button variant="secondary" onClick={() => setIsQuestionModalOpen(true)}>Buat Soal Pertama</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Table>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* VIEW: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-indigo-600 text-white border-none shadow-xl relative overflow-hidden">
                 <Zap className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Soal Paling Sulit</p>
                 <p className="text-xl font-black">"Manakah yang merupakan..."</p>
                 <div className="mt-4 flex items-center justify-between text-xs">
                    <span>Tingkat Kelulusan</span>
                    <span className="font-black text-rose-300">12%</span>
                 </div>
              </Card>
              <Card className="bg-emerald-600 text-white border-none shadow-xl relative overflow-hidden">
                 <CheckCircle2 className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2">Soal Paling Mudah</p>
                 <p className="text-xl font-black">"Berapakah hasil dari..."</p>
                 <div className="mt-4 flex items-center justify-between text-xs">
                    <span>Tingkat Kelulusan</span>
                    <span className="font-black text-emerald-300">98%</span>
                 </div>
              </Card>
              <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                 <BarChart3 className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Efektivitas Bank Soal</p>
                 <p className="text-xl font-black">Distribusi Normal</p>
                 <div className="mt-4 flex items-center justify-between text-xs">
                    <span>Validitas Data</span>
                    <span className="font-black text-indigo-400 underline cursor-pointer">Lihat Laporan</span>
                 </div>
              </Card>
           </div>
           
           <Card title="Analisis Butir Soal Detail">
              <div className="text-center py-12 space-y-4">
                 <Calculator size={48} className="mx-auto text-slate-300" />
                 <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">Analisis Kualitas Instrumen Ujian</h4>
                 <p className="text-sm text-slate-500 max-w-md mx-auto">Sistem sedang mengumpulkan data dari ujian-ujian terbaru untuk memberikan rekomendasi validitas soal (Reliability & Item Difficulty Index).</p>
                 <Button className="mx-auto">Generate Laporan Analisis Lengkap</Button>
              </div>
           </Card>
        </div>
      )}

      {/* MODAL: ADD QUESTION (CONTEXT SENSITIVE) */}
      <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Tambah Item Bank Soal">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsQuestionModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                defaultValue={selectedBankSubject || 'Matematika'}
              >
                <option>Matematika</option>
                <option>Informatika</option>
                <option>Bahasa Indonesia</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Tingkat Kelas</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                defaultValue={selectedBankGrade}
              >
                <option>X</option>
                <option>XI</option>
                <option>XII</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Butir Pertanyaan (Rich Text / LaTeX Support)</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Tuliskan pertanyaan anda di sini..."></textarea>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800">
             <div className="flex justify-between items-center mb-4">
                <h5 className="text-[10px] font-black uppercase text-indigo-600">Multimedia & Asset</h5>
                <Button variant="ghost" className="!p-1 text-[10px] uppercase font-black"><Plus size={12} /> Tambah Media</Button>
             </div>
             <div className="flex gap-4">
                <button type="button" className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group">
                   <ImageIcon size={20} className="text-slate-400 group-hover:text-indigo-600" />
                   <span className="text-[10px] font-bold text-slate-500">Unggah Gambar</span>
                </button>
                <button type="button" className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group">
                   <Volume2 size={20} className="text-slate-400 group-hover:text-rose-600" />
                   <span className="text-[10px] font-bold text-slate-500">Unggah Audio</span>
                </button>
                <button type="button" className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group">
                   <Calculator size={20} className="text-slate-400 group-hover:text-emerald-600" />
                   <span className="text-[10px] font-bold text-slate-500">Insert Formula</span>
                </button>
             </div>
          </div>

          <div className="space-y-4">
             <h5 className="text-[10px] font-black uppercase text-slate-400">Pilihan Jawaban (Multiple Choice)</h5>
             <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div key={opt} className="flex gap-3 items-center">
                     <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500">{opt}</span>
                     <input className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500" placeholder={`Isi pilihan ${opt}...`} />
                     <input type="radio" name="correct" className="w-5 h-5 accent-emerald-500" />
                  </div>
                ))}
             </div>
          </div>

          <Button type="submit" className="w-full py-4 shadow-xl shadow-indigo-500/10">Simpan ke Bank Soal Digital</Button>
        </form>
      </Modal>

      {/* MODAL: BULK IMPORT */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Bulk Import Soal via Excel">
         <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-xl">
               <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-bold flex items-center gap-2">
                  <AlertTriangle size={14} /> Pastikan format Excel mengikuti template resmi kami untuk menghindari kegagalan validasi.
               </p>
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group">
               <FileUp size={48} className="mx-auto text-slate-300 group-hover:text-indigo-600 transition-colors mb-4" />
               <p className="font-black text-slate-700 dark:text-slate-200">Tarik File Template Anda Ke Sini</p>
               <p className="text-xs text-slate-400 mt-2">Hanya mendukung format .xlsx, .csv (Maks 20MB)</p>
            </div>
            <div className="flex gap-4">
               <Button variant="secondary" className="flex-1 !py-3 text-[10px] font-black uppercase tracking-widest"><FileDown size={16} /> Unduh Template</Button>
               <Button className="flex-1 !py-3 text-[10px] font-black uppercase tracking-widest" onClick={() => setIsImportModalOpen(false)}>Eksekusi Import Data</Button>
            </div>
         </div>
      </Modal>

      {/* MODAL: SCHEDULE EXAM (SECURITY CONFIG) */}
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Jadwalkan Sesi Ujian Baru">
         <form className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Judul Ujian / Sesi</label>
               <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none" placeholder="Ex: Penilaian Akhir Semester Ganjil" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none">
                     <option>Matematika</option>
                     <option>Informatika</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Waktu Pelaksanaan</label>
                  <input type="datetime-local" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none" />
               </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl space-y-4">
               <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-4">Konfigurasi Keamanan & Integritas</h5>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">Acak Nomor Soal</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">Question Shuffle</p>
                     </div>
                     <input type="checkbox" className="w-5 h-5 accent-indigo-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">Acak Jawaban</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">Option Shuffle</p>
                     </div>
                     <input type="checkbox" className="w-5 h-5 accent-indigo-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">Mode Fullscreen</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">Exam Mode API</p>
                     </div>
                     <input type="checkbox" className="w-5 h-5 accent-indigo-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">Simpan Otomatis</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">Cloud Auto-Save</p>
                     </div>
                     <input type="checkbox" className="w-5 h-5 accent-indigo-500" defaultChecked />
                  </div>
               </div>
            </div>

            <Button className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20" onClick={() => setIsExamModalOpen(false)}>Rilis Jadwal Ujian</Button>
         </form>
      </Modal>

      <HelpGuide guideId="academic-cbt" />
    </div>
  );
};
