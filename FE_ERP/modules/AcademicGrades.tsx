
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { INITIAL_CLASSES } from '../constants';
// Added Edit3 to the imports
import { 
  FileSpreadsheet, Save, Download, FileUp, 
  Printer, AlertCircle, CheckCircle2, ChevronRight, 
  Settings, User, Star, BookOpen, Calculator,
  Filter, ArrowUpDown, Lock, Unlock, History,
  LayoutGrid, Share2, QrCode, ClipboardCheck, Sparkles,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Edit3
} from 'lucide-react';

interface GradeEntry {
  studentId: string;
  name: string;
  nis: string;
  tugas: number;
  uts: number;
  uas: number;
  attitude: 'A' | 'B' | 'C' | 'D';
  note?: string;
  absensi?: { s: number; i: number; a: number };
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

interface P5Project {
  studentId: string;
  dimension: string;
  subElement: string;
  achievement: 'Mulai Berkembang' | 'Sedang Berkembang' | 'Berkembang Sesuai Harapan' | 'Sangat Berkembang';
}

const MOCK_GRADES: GradeEntry[] = [
  { studentId: '1', name: 'Ahmad Faisal', nis: '2024001', tugas: 85, uts: 80, uas: 88, attitude: 'A', note: 'Sangat baik dalam logika pemrograman', absensi: { s: 0, i: 1, a: 0 } },
  { studentId: '2', name: 'Budi Santoso', nis: '2024002', tugas: 65, uts: 72, uas: 60, attitude: 'B', note: 'Perlu bimbingan ekstra pada struktur data', absensi: { s: 2, i: 0, a: 1 } },
  { studentId: '3', name: 'Citra Dewi', nis: '2024003', tugas: 92, uts: 95, uas: 90, attitude: 'A', note: 'Konsisten dan kreatif', absensi: { s: 0, i: 0, a: 0 } },
];

export const AcademicGrades: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState(INITIAL_CLASSES[0].id);
  const [selectedSubject, setSelectedSubject] = useState('PROG');
  const [activeTab, setActiveTab] = useState<'academic' | 'non-academic' | 'p5' | 'summary'>('academic');
  const [grades, setGrades] = useLocalStorage<GradeEntry[]>('edupro_grades_entry', MOCK_GRADES);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'Draft' | 'Submitted' | 'Locked'>('Draft');
  
  // Peraturan Bobot & KKM
  const [config, setConfig] = useState({
    kkm: 75,
    weightTugas: 30,
    weightUTS: 30,
    weightUAS: 40
  });

  // Audit Logs State
  const [auditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: '2024-03-12 10:00', user: 'Guru Produktif', action: 'Update Nilai', details: 'Mengubah nilai UAS Ahmad Faisal (85 -> 88)' },
    { id: '2', timestamp: '2024-03-12 09:15', user: 'Guru Produktif', action: 'Bulk Import', details: 'Import 36 data dari Excel' }
  ]);

  const calculateFinal = (t: number, uts: number, uas: number) => {
    return ((t * config.weightTugas) + (uts * config.weightUTS) + (uas * config.weightUAS)) / 100;
  };

  const handleUpdateGrade = (id: string, field: keyof GradeEntry, value: any) => {
    if (approvalStatus === 'Locked') return;
    setGrades(prev => prev.map(g => g.studentId === id ? { ...g, [field]: value } : g));
  };

  // AI-Powered Narrative Generator
  const generateAINarrative = (student: GradeEntry) => {
    const final = calculateFinal(student.tugas, student.uts, student.uas);
    let narrative = `Ananda ${student.name.split(' ')[0]} menunjukkan pemahaman `;
    
    if (final >= 90) narrative += "yang sangat luar biasa dalam menguasai seluruh elemen mata pelajaran ini. Kemampuan analisis dan kreativitas pengerjaan tugas sangat menonjol.";
    else if (final >= 80) narrative += "yang baik dan konsisten dalam pengerjaan proyek. Mampu berkolaborasi dan memahami konsep dasar dengan matang.";
    else if (final >= config.kkm) narrative += "yang cukup. Telah mencapai kriteria ketuntasan minimal, namun perlu meningkatkan ketelitian pada pengerjaan ujian.";
    else narrative += "yang masih perlu bimbingan intensif, terutama pada pemahaman logika dasar dan disiplin pengumpulan tugas.";

    handleUpdateGrade(student.studentId, 'note', narrative);
  };

  // Excel-like Navigation Logic
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    const inputs = document.querySelectorAll('.grade-input');
    const cols = 3; // tugas, uts, uas
    let nextIndex = -1;

    if (e.key === 'ArrowRight') nextIndex = rowIndex * cols + colIndex + 1;
    if (e.key === 'ArrowLeft') nextIndex = rowIndex * cols + colIndex - 1;
    if (e.key === 'ArrowDown') nextIndex = (rowIndex + 1) * cols + colIndex;
    if (e.key === 'ArrowUp') nextIndex = (rowIndex - 1) * cols + colIndex;

    if (nextIndex >= 0 && nextIndex < inputs.length) {
      e.preventDefault();
      (inputs[nextIndex] as HTMLInputElement).focus();
      (inputs[nextIndex] as HTMLInputElement).select();
    }
  };

  const selectedClassName = INITIAL_CLASSES.find(c => c.id === selectedClassId)?.name || '';

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      {/* Workflow Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${
            approvalStatus === 'Locked' ? 'bg-rose-100 text-rose-600' : 
            approvalStatus === 'Submitted' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {approvalStatus === 'Locked' ? <Lock size={24} /> : <FileSpreadsheet size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              E-Raport & Penilaian 
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                approvalStatus === 'Locked' ? 'bg-rose-500 text-white' : 
                approvalStatus === 'Submitted' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {approvalStatus}
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Tapel 2024/2025 • {selectedClassName} • {selectedSubject}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="secondary" onClick={() => setIsHistoryOpen(true)}>
              <History size={16} /> Logs
           </Button>
           <Button variant="secondary" onClick={() => setIsSettingOpen(true)}>
              <Settings size={16} /> KKM & Bobot
           </Button>
           
           {approvalStatus === 'Draft' && (
             <Button onClick={() => setApprovalStatus('Submitted')} className="bg-indigo-600 hover:bg-indigo-700">
               <Share2 size={16} /> Ajukan Ke Wakasek
             </Button>
           )}

           {approvalStatus === 'Submitted' && (
             <Button onClick={() => setApprovalStatus('Locked')} className="bg-rose-600 hover:bg-rose-700">
               <Lock size={16} /> Kunci Nilai
             </Button>
           )}

           {approvalStatus === 'Locked' && (
             <Button variant="secondary" onClick={() => setApprovalStatus('Draft')} className="text-rose-600 border-rose-200">
               <Unlock size={16} /> Buka Kunci
             </Button>
           )}
        </div>
      </div>

      {/* Control Filters */}
      <Card className="!p-4 bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
           <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Pilih Kelas</label>
              <select 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {INITIAL_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
           </div>
           <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Mata Pelajaran</label>
              <select 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="PROG">Produktif RPL</option>
                <option value="MTK">Matematika</option>
                <option value="BIN">Bahasa Indonesia</option>
                <option value="P5">Projek P5 (Lintas Mapel)</option>
              </select>
           </div>
           <div className="flex gap-2 self-end">
              <Button variant="secondary" className="!p-2.5" title="Import dari Excel"><FileUp size={18} /></Button>
              <Button variant="secondary" className="!p-2.5" title="Download Format Excel"><Download size={18} /></Button>
           </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button onClick={() => setActiveTab('academic')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'academic' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Penilaian Akademik
        </button>
        <button onClick={() => setActiveTab('non-academic')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'non-academic' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Sikap & Catatan
        </button>
        <button onClick={() => setActiveTab('p5')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'p5' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Projek P5
        </button>
        <button onClick={() => setActiveTab('summary')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'summary' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Ringkasan & Analisis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <Card className="!p-0 overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl relative">
            {approvalStatus === 'Locked' && (
              <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] z-10 cursor-not-allowed flex items-center justify-center">
                 <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <Lock size={20} className="text-rose-500" />
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">Data telah dikunci. Buka kunci untuk mengubah.</span>
                 </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <Table headers={['NIS & Siswa', `Tugas (${config.weightTugas}%)`, `UTS (${config.weightUTS}%)`, `UAS (${config.weightUAS}%)`, 'Nilai Akhir', 'Status']}>
                {grades.map((g, rowIndex) => {
                  const final = calculateFinal(g.tugas, g.uts, g.uas);
                  const isFailed = final < config.kkm;
                  return (
                    <tr key={g.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] text-slate-500">
                             {g.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{g.name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{g.nis}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          className="grade-input w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" 
                          value={g.tugas}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                          onChange={(e) => handleUpdateGrade(g.studentId, 'tugas', parseInt(e.target.value) || 0)}
                          disabled={approvalStatus === 'Locked'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          className="grade-input w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" 
                          value={g.uts}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                          onChange={(e) => handleUpdateGrade(g.studentId, 'uts', parseInt(e.target.value) || 0)}
                          disabled={approvalStatus === 'Locked'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          className="grade-input w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" 
                          value={g.uas}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                          onChange={(e) => handleUpdateGrade(g.studentId, 'uas', parseInt(e.target.value) || 0)}
                          disabled={approvalStatus === 'Locked'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-black ${isFailed ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {final.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {isFailed ? (
                             <div className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 bg-rose-50 dark:bg-rose-900/10 px-2 py-1 rounded-md">
                               <AlertCircle size={10} /> Remedial
                             </div>
                           ) : (
                             <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-md">
                               <CheckCircle2 size={10} /> Tuntas
                             </div>
                           )}
                           <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-all">
                              <History size={14} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            )}

            {activeTab === 'non-academic' && (
              <Table headers={['NIS & Siswa', 'Absensi', 'Predikat Sikap', 'AI Narrative / Catatan Capaian', 'Aksi']}>
                {grades.map(g => (
                  <tr key={g.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] text-slate-500">
                             {g.name.charAt(0)}
                           </div>
                           <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{g.name}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex gap-1 text-[10px] font-bold">
                          <span className="text-amber-600" title="Sakit">S:{g.absensi?.s}</span>
                          <span className="text-blue-600" title="Izin">I:{g.absensi?.i}</span>
                          <span className="text-rose-600" title="Alpa">A:{g.absensi?.a}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <select 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-black text-xs text-indigo-600"
                        value={g.attitude}
                        onChange={(e) => handleUpdateGrade(g.studentId, 'attitude', e.target.value)}
                        disabled={approvalStatus === 'Locked'}
                       >
                         <option>A</option><option>B</option><option>C</option><option>D</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 min-w-[300px]">
                       <div className="relative group/note">
                          <textarea 
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[11px] leading-relaxed outline-none focus:border-indigo-500"
                            rows={3}
                            value={g.note || ''}
                            onChange={(e) => handleUpdateGrade(g.studentId, 'note', e.target.value)}
                            disabled={approvalStatus === 'Locked'}
                          />
                          <button 
                            onClick={() => generateAINarrative(g)}
                            className="absolute top-2 right-2 p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg opacity-0 group-hover/note:opacity-100 transition-opacity hover:scale-110"
                            title="Generate AI Narrative"
                          >
                             <Sparkles size={12} />
                          </button>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <Button variant="ghost" className="!p-2"><Save size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </Table>
            )}

            {activeTab === 'p5' && (
              <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Projek Penguatan Profil Pelajar Pancasila</h3>
                       <p className="text-xs text-slate-500">Penilaian Lintas Mata Pelajaran Berdasarkan Dimensi Profil Pelajar.</p>
                    </div>
                    <Button variant="secondary" className="text-xs"><Settings size={14} /> Atur Dimensi</Button>
                 </div>
                 <Table headers={['Siswa', 'Dimensi', 'Elemen', 'Capaian Projek', 'Aksi']}>
                    {grades.map(g => (
                      <tr key={g.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                         <td className="px-6 py-4 font-bold text-sm">{g.name}</td>
                         <td className="px-6 py-4 text-xs">Bergotong Royong</td>
                         <td className="px-6 py-4 text-xs">Kolaborasi</td>
                         <td className="px-6 py-4">
                            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-[10px] font-bold text-indigo-600">
                               <option>Mulai Berkembang</option>
                               <option>Sedang Berkembang</option>
                               <option selected>Berkembang Sesuai Harapan</option>
                               <option>Sangat Berkembang</option>
                            </select>
                         </td>
                         <td className="px-6 py-4"><Button variant="ghost" className="!p-1"><Edit3 size={12} /></Button></td>
                      </tr>
                    ))}
                 </Table>
              </div>
            )}
            
            {activeTab === 'summary' && (
              <div className="p-12 text-center space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-50 dark:bg-slate-800 border-none">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Tertinggi</p>
                       <p className="text-3xl font-black text-emerald-600">92.5</p>
                       <p className="text-[10px] text-slate-500 mt-1">Citra Dewi</p>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-800 border-none">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Terendah</p>
                       <p className="text-3xl font-black text-rose-600">64.0</p>
                       <p className="text-[10px] text-slate-500 mt-1">Budi Santoso</p>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-800 border-none">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Standar Deviasi</p>
                       <p className="text-3xl font-black text-indigo-600">4.2</p>
                       <p className="text-[10px] text-slate-500 mt-1">Variansi Cukup Rendah</p>
                    </Card>
                 </div>
                 <Calculator size={48} className="mx-auto text-slate-300" />
                 <h3 className="text-lg font-bold text-slate-800">Analisis Ketercapaian Kelas</h3>
                 <p className="text-sm text-slate-500 max-w-md mx-auto">Sistem mendeteksi 1 siswa membutuhkan bimbingan intensif pada materi {selectedSubject}.</p>
                 <Button className="mx-auto"><LayoutGrid size={16} /> Buka Laporan Lengkap</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
             <Calculator className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
             <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-indigo-400">
                <ClipboardCheck size={16} /> Statistik Kelas
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Rata-rata Kelas</span>
                   <span className="text-lg font-black">81.5</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Ketuntasan (KKM)</span>
                   <span className="text-lg font-black text-emerald-400">88%</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Input Data</span>
                   <span className="text-lg font-black text-indigo-400">36/36</span>
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aksi Cepat</p>
                   <button className="w-full text-left text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-2 group">
                      <Sparkles size={12} className="group-hover:rotate-12 transition-transform" /> Mass AI Narrative Generator
                   </button>
                   <button className="w-full text-left text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group">
                      <Calculator size={12} className="group-hover:scale-110 transition-transform" /> Hitung Ulang Bobot
                   </button>
                </div>
             </div>
          </Card>

          <Card title="Pintasan Raport" className="!p-4">
             <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-indigo-600 shadow-sm"><Printer size={14} /></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cetak Draft Raport</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-rose-600 shadow-sm"><QrCode size={14} /></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cek Keaslian (QR)</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-600" />
                </button>
             </div>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
             <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Navigasi Input</h4>
             <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                   <span className="p-1 bg-slate-100 rounded">Arrows</span> Pindah Cell
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                   <span className="p-1 bg-slate-100 rounded">Enter</span> Simpan Cell
                </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Modal: Setting Bobot & KKM */}
      <Modal isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} title="Konfigurasi Parameter Penilaian">
         <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-xl">
               <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium flex items-center gap-2">
                  <AlertCircle size={14} /> Perubahan di sini akan mempengaruhi perhitungan nilai akhir di seluruh tabel secara real-time.
               </p>
            </div>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">KKM (Minimal)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black"
                        value={config.kkm}
                        onChange={(e) => setConfig({...config, kkm: parseInt(e.target.value) || 0})}
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">Bobot Tugas (%)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black"
                        value={config.weightTugas}
                        onChange={(e) => setConfig({...config, weightTugas: parseInt(e.target.value) || 0})}
                     />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">Bobot UTS (%)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black"
                        value={config.weightUTS}
                        onChange={(e) => setConfig({...config, weightUTS: parseInt(e.target.value) || 0})}
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-slate-400">Bobot UAS (%)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black"
                        value={config.weightUAS}
                        onChange={(e) => setConfig({...config, weightUAS: parseInt(e.target.value) || 0})}
                     />
                  </div>
               </div>
               <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Total Persentase:</span>
                  <span className={`text-lg font-black ${config.weightTugas + config.weightUTS + config.weightUAS === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {config.weightTugas + config.weightUTS + config.weightUAS}%
                  </span>
               </div>
            </div>

            <Button className="w-full py-4 shadow-lg shadow-indigo-100" onClick={() => setIsSettingOpen(false)} disabled={config.weightTugas + config.weightUTS + config.weightUAS !== 100}>
               Terapkan Konfigurasi
            </Button>
         </div>
      </Modal>

      {/* Modal: Audit History Logs */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Histori Perubahan Nilai (Audit Trail)">
         <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               <Table headers={['Waktu', 'User', 'Aksi', 'Detail']}>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="text-[11px]">
                       <td className="px-4 py-3 font-mono text-slate-400">{log.timestamp}</td>
                       <td className="px-4 py-3 font-bold">{log.user}</td>
                       <td className="px-4 py-3"><span className="px-1.5 py-0.5 bg-slate-100 rounded font-black">{log.action}</span></td>
                       <td className="px-4 py-3 text-slate-500">{log.details}</td>
                    </tr>
                  ))}
               </Table>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setIsHistoryOpen(false)}>Tutup</Button>
         </div>
      </Modal>

      {/* Modal: Preview Print */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Print Preview Raport Digital Terintegrasi">
         <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner min-h-[500px] relative">
               {/* Digital Verification Element */}
               <div className="absolute top-8 right-8 flex flex-col items-center gap-1">
                  <div className="w-16 h-16 bg-white p-1 rounded shadow-sm">
                     <QrCode size={56} className="text-slate-800" />
                  </div>
                  <span className="text-[6px] font-black uppercase text-slate-400">Verifikasi QR-Code</span>
               </div>

               <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6">
                  <h3 className="font-black text-lg uppercase tracking-widest">Laporan Hasil Belajar (Raport)</h3>
                  <p className="text-[10px] font-bold">SMK INFORMATIKA UTAMA JAKARTA</p>
               </div>

               <div className="grid grid-cols-2 gap-4 text-[9px] font-medium mb-8">
                  <div className="space-y-1">
                    <div>Nama Peserta Didik: <strong>Ahmad Faisal</strong></div>
                    <div>Nomor Induk / NISN: <strong>2024001 / 0012345678</strong></div>
                    <div>Sekolah: <strong>SMK Informatika Utama</strong></div>
                  </div>
                  <div className="text-right space-y-1">
                    <div>Kelas: <strong>{selectedClassName}</strong></div>
                    <div>Fase / Semester: <strong>E / Ganjil</strong></div>
                    <div>Tahun Pelajaran: <strong>2024/2025</strong></div>
                  </div>
               </div>

               <div className="border border-slate-900 dark:border-slate-100 rounded">
                  <div className="grid grid-cols-12 bg-slate-200 dark:bg-slate-700 text-[8px] font-black uppercase p-2 border-b border-slate-900">
                     <div className="col-span-6">Mata Pelajaran</div>
                     <div className="col-span-2 text-center">Nilai</div>
                     <div className="col-span-4 text-center">Capaian Kompetensi</div>
                  </div>
                  <div className="grid grid-cols-12 text-[8px] p-2 border-b border-slate-100 dark:border-slate-800">
                     <div className="col-span-6">1. Matematika</div>
                     <div className="col-span-2 text-center font-bold">84.2 (B)</div>
                     <div className="col-span-4 text-[7px] italic">Menunjukkan pemahaman yang baik pada elemen Aljabar dan Geometri...</div>
                  </div>
                  <div className="grid grid-cols-12 text-[8px] p-2">
                     <div className="col-span-6">2. Produktif RPL</div>
                     <div className="col-span-2 text-center font-bold">88.0 (A)</div>
                     <div className="col-span-4 text-[7px] italic">Sangat menonjol dalam pengembangan aplikasi berbasis web...</div>
                  </div>
               </div>

               <div className="mt-6 border border-slate-900 rounded p-2">
                  <p className="text-[8px] font-black uppercase mb-2">Absensi & Kehadiran</p>
                  <div className="grid grid-cols-3 text-[8px] text-center font-bold">
                     <div>Sakit: 0 hari</div>
                     <div>Izin: 1 hari</div>
                     <div>Tanpa Ket: 0 hari</div>
                  </div>
               </div>

               <div className="mt-16 flex justify-between px-10 text-[8px] font-bold">
                  <div className="text-center">Mengetahui,<br/>Orang Tua/Wali<br/><br/><br/><br/>(........................)</div>
                  <div className="text-center relative">
                     {/* Signature Mock */}
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-10">
                        <CheckCircle2 size={40} className="text-indigo-600" />
                     </div>
                     Jakarta, {new Date().toLocaleDateString('id-ID')}<br/>Wali Kelas<br/><br/><br/><br/>(<strong>{selectedClassName === 'X RPL 1' ? 'Iwan Setiawan' : 'Wali Kelas'}</strong>)
                  </div>
               </div>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary" className="flex-1" onClick={() => setIsPrintModalOpen(false)}>Batal</Button>
               <Button className="flex-1" onClick={() => { alert('Mencetak ke PDF...'); setIsPrintModalOpen(false); }}>
                  <Printer size={16} /> Mulai Cetak Dokumen Resmi
               </Button>
            </div>
         </div>
      </Modal>

      <HelpGuide guideId="academic-grades" />
    </div>
  );
};
