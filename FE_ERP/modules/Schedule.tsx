
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Button, Modal } from '../components/UI';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HelpGuide } from '../components/HelpGuide';
import { INITIAL_CLASSES } from '../constants';
import { 
  Printer, Download, Clock, BookOpen, 
  MapPin, Edit3, Save, X, Plus, Calendar as CalendarIcon,
  Settings2, Trash2, Info, ChevronDown
} from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

interface ScheduleSlot {
  subject?: string;
  teacher?: string;
  room?: string;
  type: 'lesson' | 'break' | 'empty';
}

interface TimeSlotDefinition {
  id: string;
  time: string;
  label: string;
  isBreak?: boolean;
}

const INITIAL_TIME_SLOTS: TimeSlotDefinition[] = [
  { id: '1', time: '07:00 - 07:45', label: 'Jam 1' },
  { id: '2', time: '07:45 - 08:30', label: 'Jam 2' },
  { id: '3', time: '08:30 - 09:15', label: 'Jam 3' },
  { id: '4', time: '09:15 - 10:00', label: 'Jam 4' },
  { id: 'b1', time: '10:00 - 10:15', label: 'Istirahat 1', isBreak: true },
  { id: '5', time: '10:15 - 11:00', label: 'Jam 5' },
  { id: '6', time: '11:00 - 11:45', label: 'Jam 6' },
  { id: '7', time: '11:45 - 12:30', label: 'Jam 7' },
  { id: 'b2', time: '12:30 - 13:30', label: 'ISHOMA', isBreak: true },
  { id: '8', time: '13:30 - 14:15', label: 'Jam 8' },
  { id: '9', time: '14:15 - 15:00', label: 'Jam 9' },
  { id: '10', time: '15:00 - 15:45', label: 'Jam 10' },
  { id: '11', time: '15:45 - 16:30', label: 'Jam 11' },
  { id: '12', time: '16:30 - 17:00', label: 'Sesi Sore / Eskul' },
];

// Struktur data sekarang mendukung multi-kelas: Record<classId, Record<day, Record<slotId, ScheduleSlot>>>
const INITIAL_MULTI_CLASS_SCHEDULE: Record<string, Record<string, Record<string, ScheduleSlot>>> = {
  '1': { // X RPL 1
    'Senin': {
      '1': { subject: 'Upacara Bendera', teacher: 'Tim Kesiswaan', room: 'Lapangan', type: 'lesson' },
      '2': { subject: 'Pendidikan Agama', teacher: 'H. Syukron, S.Ag', room: 'R. 102', type: 'lesson' },
      '4': { subject: 'Matematika', teacher: 'Dr. Iwan Setiawan', room: 'R. 102', type: 'lesson' },
    },
    'Selasa': {
      '1': { subject: 'Pemrograman Dasar', teacher: 'Bambang S, S.Kom', room: 'Lab RPL 1', type: 'lesson' },
    }
  },
  '2': { // XI TKJ 2
    'Senin': {
      '1': { subject: 'Upacara Bendera', teacher: 'Tim Kesiswaan', room: 'Lapangan', type: 'lesson' },
      '2': { subject: 'Administrasi Infrastruktur Jaringan', teacher: 'Heri Susanto', room: 'Lab TKJ', type: 'lesson' },
    }
  }
};

export const Schedule: React.FC = () => {
  // State untuk kelas yang sedang dipilih
  const [selectedClassId, setSelectedClassId] = useState(INITIAL_CLASSES[0].id);

  // Persistence menggunakan local storage
  const [scheduleData, setScheduleData] = useLocalStorage<Record<string, Record<string, Record<string, ScheduleSlot>>>>('edupro_schedule_multi_class', INITIAL_MULTI_CLASS_SCHEDULE);
  const [timeSlots, setTimeSlots] = useLocalStorage<TimeSlotDefinition[]>('edupro_schedule_slots', INITIAL_TIME_SLOTS);
  
  // States untuk Modals
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ day: string; slotId: string } | null>(null);
  const [lessonForm, setLessonForm] = useState<ScheduleSlot>({ type: 'lesson' });

  // Ambil nama kelas yang sedang dipilih
  const selectedClassName = useMemo(() => {
    return INITIAL_CLASSES.find(c => c.id === selectedClassId)?.name || 'Pilih Kelas';
  }, [selectedClassId]);

  // Data jadwal untuk kelas yang aktif saja
  const currentClassSchedule = scheduleData[selectedClassId] || {};

  // Handle Lesson Editing
  const handleOpenLessonEdit = (day: string, slotId: string) => {
    setEditingLesson({ day, slotId });
    const current = currentClassSchedule[day]?.[slotId] || { type: 'lesson', subject: '', teacher: '', room: '' };
    setLessonForm(current);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const { day, slotId } = editingLesson;
    
    setScheduleData(prev => {
      const newClassSchedule = { ...(prev[selectedClassId] || {}) };
      const newDayData = { ...(newClassSchedule[day] || {}) };
      newDayData[slotId] = lessonForm;
      newClassSchedule[day] = newDayData;
      
      return {
        ...prev,
        [selectedClassId]: newClassSchedule
      };
    });
    
    setIsLessonModalOpen(false);
  };

  // Handle Session/Time Slot Management
  const updateTimeSlot = (index: number, field: keyof TimeSlotDefinition, value: any) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
  };

  const addTimeSlot = () => {
    const newId = Date.now().toString();
    setTimeSlots([...timeSlots, { id: newId, time: '17:00 - 17:45', label: 'Sesi Tambahan' }]);
  };

  const removeTimeSlot = (id: string) => {
    if (confirm('Hapus sesi ini? Seluruh data pelajaran pada jam ini di semua hari dan SEMUA KELAS akan hilang.')) {
      setTimeSlots(timeSlots.filter(s => s.id !== id));
      // Cleanup schedule data for this slot across all classes and days
      setScheduleData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(classId => {
          DAYS.forEach(day => {
            if (newData[classId][day]) {
              const newDayData = { ...newData[classId][day] };
              delete newDayData[id];
              newData[classId][day] = newDayData;
            }
          });
        });
        return newData;
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
            <CalendarIcon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Jadwal Pelajaran</h2>
              <div className="relative group">
                <select 
                  className="appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-3 pr-8 py-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  {INITIAL_CLASSES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Tapel 2024/2025 • {selectedClassName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="secondary" onClick={() => setIsSessionModalOpen(true)} title="Atur struktur waktu harian">
              <Settings2 size={16} /> Edit Sesi & Waktu
           </Button>
           <Button variant="secondary">
              <Printer size={16} /> Cetak
           </Button>
           <Button>
              <Download size={16} /> Export
           </Button>
        </div>
      </div>

      {/* Main Schedule Table */}
      <Card className="!p-0 overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-left text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 w-48 sticky left-0 bg-slate-50 dark:bg-slate-900 z-20">
                  Waktu & Sesi
                </th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 text-center text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest bg-slate-50 dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800 last:border-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {timeSlots.map(slot => (
                <tr key={slot.id} className={`${slot.isBreak ? 'bg-slate-50/50 dark:bg-slate-900/30' : 'hover:bg-slate-50/20 dark:hover:bg-slate-800/5'} transition-colors`}>
                  <td className="p-4 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-950 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.03)]">
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{slot.time}</span>
                       <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-tighter mt-1">{slot.label}</span>
                    </div>
                  </td>
                  
                  {DAYS.map(day => {
                    const lesson = currentClassSchedule[day]?.[slot.id];
                    
                    if (slot.isBreak) {
                      return (
                        <td key={day} className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
                           <div className="h-full w-full bg-slate-50/50 dark:bg-slate-800/10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center py-4">
                              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">{slot.label}</span>
                           </div>
                        </td>
                      );
                    }

                    return (
                      <td key={day} className="p-2 align-top border-r border-slate-100 dark:border-slate-800 last:border-0">
                        <div 
                          onClick={() => handleOpenLessonEdit(day, slot.id)}
                          className={`h-full min-h-[100px] w-full rounded-2xl p-3 relative group transition-all cursor-pointer border-2 ${
                            lesson?.subject 
                            ? 'bg-indigo-50/20 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/30 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10' 
                            : 'bg-slate-50/30 dark:bg-slate-900/20 border-transparent hover:border-slate-300 dark:hover:border-slate-700 border-dashed border-2'
                          }`}
                        >
                          {lesson?.subject ? (
                            <>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 text-indigo-600">
                                    <Edit3 size={12} />
                                 </div>
                              </div>
                              <p className="font-black text-indigo-900 dark:text-indigo-200 text-xs leading-tight mb-3">
                                {lesson.subject}
                              </p>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                                   <BookOpen size={10} className="shrink-0 text-indigo-400" />
                                   <span className="truncate">{lesson.teacher}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
                                   <MapPin size={10} className="shrink-0" />
                                   <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 font-mono tracking-tighter">{lesson.room}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 transition-colors">
                               <Plus size={16} />
                               <span className="text-[8px] font-black uppercase mt-1">Isi Jam</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-slate-900 text-white overflow-hidden relative border-none shadow-xl">
            <Clock className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
               <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Multi-Kelas
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">Anda sedang mengelola jadwal untuk <strong>{selectedClassName}</strong>. Gunakan dropdown di atas untuk pindah kelas.</p>
         </Card>
         <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
               <Info size={16} className="text-amber-500" /> Fleksibilitas Waktu
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">Tombol <strong>Edit Rentang Waktu</strong> akan mengubah struktur waktu untuk SEMUA kelas secara global.</p>
         </Card>
         <Card className="flex items-center gap-4 hover:border-indigo-500 cursor-pointer transition-colors group">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <Settings2 size={24} />
            </div>
            <div>
               <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Kustomisasi Sesi</h4>
               <p className="text-xs text-slate-500">Ubah label sesi atau tambah jam istirahat baru dengan mudah.</p>
            </div>
         </Card>
      </div>

      {/* Modal: Edit Session Structure (Times & Labels) */}
      <Modal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)} 
        title="Manajemen Sesi & Rentang Waktu (Global)"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-4">
             <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">Perubahan di sini akan mengubah baris waktu pada seluruh tabel jadwal UNTUK SEMUA KELAS. Pastikan rentang waktu tidak tumpang tindih.</p>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {timeSlots.map((slot, index) => (
              <div key={slot.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-end md:items-center animate-fade-in">
                <div className="flex-[2] space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400">Rentang Waktu</label>
                  <div className="relative">
                    <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold outline-none focus:border-indigo-500"
                      value={slot.time}
                      onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-[2] space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400">Nama Sesi</label>
                  <input 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold outline-none focus:border-indigo-500"
                    value={slot.label}
                    onChange={(e) => updateTimeSlot(index, 'label', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center justify-between gap-4 w-full md:w-auto pt-2 md:pt-0">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id={`break-${slot.id}`}
                      checked={slot.isBreak}
                      onChange={(e) => updateTimeSlot(index, 'isBreak', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor={`break-${slot.id}`} className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 uppercase cursor-pointer">Libur</label>
                  </div>
                  <button 
                    onClick={() => removeTimeSlot(slot.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={addTimeSlot}>
               <Plus size={16} /> Tambah Jam Baru
            </Button>
            <Button className="flex-1" onClick={() => setIsSessionModalOpen(false)}>
               Selesai & Terapkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Edit Lesson Content */}
      <Modal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        title={`Edit Pelajaran: ${editingLesson?.day} (${selectedClassName})`}
      >
        <form onSubmit={handleSaveLesson} className="space-y-5">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mata Pelajaran</label>
              <div className="relative">
                 <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                 <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                    placeholder="Contoh: Pemrograman Web"
                    value={lessonForm.subject || ''}
                    onChange={e => setLessonForm({...lessonForm, subject: e.target.value})}
                    required
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Guru</label>
                 <input 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                    placeholder="Contoh: Bambang S, S.Kom"
                    value={lessonForm.teacher || ''}
                    onChange={e => setLessonForm({...lessonForm, teacher: e.target.value})}
                    required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ruangan / Lab</label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                       placeholder="Contoh: Lab RPL 2"
                       value={lessonForm.room || ''}
                       onChange={e => setLessonForm({...lessonForm, room: e.target.value})}
                       required
                    />
                 </div>
              </div>
           </div>

           <div className="pt-6 flex gap-3">
              <button 
                 type="button"
                 onClick={() => {
                    if (editingLesson) {
                       setScheduleData(prev => {
                          const newMulti = { ...prev };
                          const newClassSchedule = { ...(newMulti[selectedClassId] || {}) };
                          const newDay = { ...newClassSchedule[editingLesson.day] };
                          delete newDay[editingLesson.slotId];
                          newClassSchedule[editingLesson.day] = newDay;
                          newMulti[selectedClassId] = newClassSchedule;
                          return newMulti;
                       });
                       setIsLessonModalOpen(false);
                    }
                 }}
                 className="flex-1 py-3 px-4 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
              >
                 <Trash2 size={14} /> Hapus Isian
              </button>
              <Button type="submit" className="flex-[2] py-4 shadow-xl shadow-indigo-200">
                 <Save size={18} /> Simpan Jadwal
              </Button>
           </div>
        </form>
      </Modal>

      <HelpGuide guideId="academic-schedule" />
    </div>
  );
};
