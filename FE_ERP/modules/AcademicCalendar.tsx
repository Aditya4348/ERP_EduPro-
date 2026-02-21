
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Button, Modal } from '../components/UI';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Bell, Clock, Download, Plus, Filter, 
  CheckCircle2, AlertCircle, Briefcase, Info,
  Search, Share2, Printer, MapPin, Tag, Layers
} from 'lucide-react';
import { CalendarEvent, EventCategory, UserRole } from '../types';

const INITIAL_EVENTS: CalendarEvent[] = [
  { 
    id: 'e1', 
    title: 'UTS Ganjil 2024', 
    startDate: '2024-03-20', 
    endDate: '2024-03-25',
    category: 'Academic', 
    isGlobal: true,
    description: 'Ujian Tengah Semester serentak untuk seluruh tingkat.'
  },
  { 
    id: 'e2', 
    title: 'Blok Praktik RPL X', 
    startDate: '2024-03-04', 
    endDate: '2024-03-08',
    category: 'Vocational', 
    isGlobal: false,
    targetRoles: [UserRole.SISWA, UserRole.GURU],
    description: 'Sesi fokus praktik pemrograman web di Lab.'
  },
  { 
    id: 'e3', 
    title: 'Libur Hari Nyepi', 
    startDate: '2024-03-11', 
    category: 'Holiday', 
    isGlobal: true,
    description: 'Libur Nasional.'
  },
  { 
    id: 'e4', 
    title: 'Rapat Wali Murid XII', 
    startDate: '2024-03-15', 
    category: 'Admin', 
    isGlobal: false,
    targetRoles: [UserRole.ORANG_TUA, UserRole.KEPALA_SEKOLAH],
    description: 'Sosialisasi persiapan kelulusan.'
  },
  { 
    id: 'e5', 
    title: 'Workshop Cloud Computing', 
    startDate: '2024-03-28', 
    category: 'Vocational', 
    isGlobal: true,
    description: 'Kunjungan industri dari AWS Indonesia.'
  }
];

export const AcademicCalendar: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('edupro_calendar_events_v2', INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // Mock ke Maret 2024
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Helper: Month Data
  const monthName = currentDate.toLocaleString('id-ID', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay(); // 0 = Sunday

  // Perhitungan Hari Efektif
  const academicStats = useMemo(() => {
    let effectiveDays = 0;
    let holidays = 0;
    let weekends = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, currentDate.getMonth(), i);
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];
      
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const holidayEvent = events.find(e => e.category === 'Holiday' && e.startDate === dateStr);

      if (isWeekend) {
        weekends++;
      } else if (holidayEvent) {
        holidays++;
      } else {
        effectiveDays++;
      }
    }

    const weeks = Math.ceil(effectiveDays / 5);
    return { effectiveDays, holidays, weekends, weeks };
  }, [currentDate, events, daysInMonth, year]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const isCorrectMonth = new Date(e.startDate).getMonth() === currentDate.getMonth();
      const isCorrectCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const hasAccess = e.isGlobal || (user && e.targetRoles?.includes(user.role));
      return isCorrectMonth && isCorrectCategory && hasAccess;
    });
  }, [events, currentDate, selectedCategory, user]);

  const getCategoryColor = (cat: EventCategory) => {
    switch(cat) {
      case 'Academic': return 'bg-indigo-500';
      case 'Holiday': return 'bg-rose-500';
      case 'Vocational': return 'bg-emerald-500';
      case 'Admin': return 'bg-amber-500';
      case 'Extra': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryLightColor = (cat: EventCategory) => {
    switch(cat) {
      case 'Academic': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600';
      case 'Holiday': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600';
      case 'Vocational': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600';
      case 'Admin': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600';
      case 'Extra': return 'bg-violet-50 dark:bg-violet-900/20 text-violet-600';
      default: return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const handleExport = () => {
    alert('Simulasi: File Academic_Calendar_2024.ics berhasil diunduh.');
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
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kalender Akademik Operasional</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Time-Map Seluruh Aktivitas & Target Pendidikan</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="secondary" onClick={handleExport}><Download size={18} /> Export iCal</Button>
           <Button onClick={() => setIsAddModalOpen(true)}><Plus size={18} /> Tambah Agenda</Button>
        </div>
      </div>

      {/* Statistics & Filter Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <Card className="bg-indigo-600 text-white border-none shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-4 -bottom-4 opacity-10">
               <Clock size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Hari Efektif KBM</p>
            <p className="text-4xl font-black mt-1">{academicStats.effectiveDays} Hari</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-100">
               <Layers size={14} /> {academicStats.weeks} Minggu Efektif
            </div>
         </Card>

         <Card className="flex flex-col justify-center text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Hari Libur & Cuti</p>
            <p className="text-3xl font-black text-rose-500">{academicStats.holidays}</p>
            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Bulan {monthName}</p>
         </Card>

         <Card className="lg:col-span-2 flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Filter Kategori Agenda</p>
               <div className="flex flex-wrap gap-2">
                  {['All', 'Academic', 'Holiday', 'Vocational', 'Admin'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-600 font-black">
               <Info size={14} /> Menampilkan agenda sesuai peran: <strong>{user?.role}</strong>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar View */}
        <div className="lg:col-span-8">
           <Card className="!p-0 border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                       <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">{monthName}</h3>
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{year}</span>
                    </div>
                    <div className="flex gap-1 ml-4">
                       <button onClick={handlePrevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"><ChevronLeft size={18} /></button>
                       <button onClick={handleNextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"><ChevronRight size={18} /></button>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={14} /> Sinkronisasi Aktif
                    </div>
                 </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                 {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, idx) => (
                   <div key={day} className={`py-3 text-center text-[9px] font-black uppercase tracking-widest ${idx === 0 || idx === 6 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {day}
                   </div>
                 ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 min-h-[600px] bg-slate-50/20 dark:bg-slate-900/10">
                 {/* Empty slots for start of month */}
                 {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                   <div key={`empty-${i}`} className="bg-slate-50/30 dark:bg-slate-900/5 border-r border-b border-slate-100 dark:border-slate-800"></div>
                 ))}

                 {/* Day slots */}
                 {Array.from({ length: daysInMonth }).map((_, i) => {
                   const day = i + 1;
                   const d = new Date(year, currentDate.getMonth(), day);
                   const dateStr = d.toISOString().split('T')[0];
                   const isToday = new Date().toISOString().split('T')[0] === dateStr;
                   const dayOfWeek = d.getDay();
                   const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                   const dayEvents = filteredEvents.filter(e => {
                     const start = e.startDate;
                     const end = e.endDate || e.startDate;
                     return dateStr >= start && dateStr <= end;
                   });

                   return (
                     <div 
                      key={day} 
                      className={`min-h-[100px] p-2 border-r border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 relative group cursor-pointer ${isWeekend ? 'bg-slate-50/50 dark:bg-slate-950/20' : 'bg-white dark:bg-slate-950'}`}
                     >
                        <span className={`text-xs font-black transition-all ${
                          isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-xl shadow-lg shadow-indigo-500/30 -mt-1 -ml-1' : 
                          isWeekend ? 'text-rose-300' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}>
                          {day}
                        </span>

                        <div className="mt-2 space-y-1">
                           {dayEvents.map(event => {
                             const isRangeStart = event.startDate === dateStr;
                             const isRange = event.endDate && event.endDate !== event.startDate;
                             
                             return (
                               <div 
                                key={event.id} 
                                className={`text-[8px] font-black uppercase py-1 px-1.5 rounded-md truncate transition-all flex items-center gap-1 shadow-sm ${getCategoryColor(event.category)} text-white ${isRange ? 'rounded-none first:rounded-l-md last:rounded-r-md' : ''}`}
                                title={event.title}
                               >
                                  {isRangeStart && <span className="shrink-0"><Layers size={8} /></span>}
                                  {isRangeStart ? event.title : <span className="opacity-0">.</span>}
                               </div>
                             );
                           })}
                        </div>
                        
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg border border-indigo-100 dark:border-indigo-800"><Plus size={10} /></button>
                        </div>
                     </div>
                   );
                 })}

                 {/* Fill empty slots for end of month grid */}
                 {Array.from({ length: (42 - (daysInMonth + firstDayOfMonth)) % 7 }).map((_, i) => (
                   <div key={`empty-end-${i}`} className="bg-slate-50/30 dark:bg-slate-900/5 border-r border-b border-slate-100 dark:border-slate-800"></div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Sidebar: Details & Upcoming */}
        <div className="lg:col-span-4 space-y-6">
           <Card title="Agenda Mendatang" className="shadow-xl">
              <div className="space-y-4">
                 {filteredEvents.length > 0 ? filteredEvents.slice(0, 5).map((e, idx) => (
                   <div key={idx} className="flex gap-4 items-start group relative p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer">
                      <div className={`w-1.5 h-10 rounded-full ${getCategoryColor(e.category)} shrink-0 mt-1`}></div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(e.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${getCategoryLightColor(e.category)}`}>{e.category}</span>
                         </div>
                         <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors line-clamp-1">{e.title}</h4>
                         <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                               <MapPin size={10} /> {e.location || 'Kampus Utama'}
                            </div>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 self-center" />
                   </div>
                 )) : (
                   <div className="py-8 text-center">
                      <Info className="mx-auto text-slate-200 mb-2" size={32} />
                      <p className="text-xs text-slate-400">Tidak ada agenda ditemukan.</p>
                   </div>
                 )}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">Lihat Seluruh Agenda <ChevronRight size={12} /></Button>
           </Card>

           <Card className="bg-slate-900 text-white overflow-hidden relative border-none shadow-2xl">
              <Bell className="absolute -top-4 -right-4 w-24 h-24 opacity-10 animate-pulse" />
              <h4 className="font-black text-sm mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span> Sync Berlangganan
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Hubungkan kalender akademik EduPro dengan ponsel pribadi Anda (Google, Outlook, iCal) agar tidak ketinggalan momen penting.</p>
              <Button variant="primary" className="w-full !bg-indigo-600 !text-white shadow-xl shadow-indigo-500/20">
                 Dapatkan Link Sinkronisasi
              </Button>
           </Card>

           <Card title="Legenda Kategori" className="!p-4">
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'Akademik', cat: 'Academic' as EventCategory },
                   { label: 'Libur Nasional', cat: 'Holiday' as EventCategory },
                   { label: 'Vokasional', cat: 'Vocational' as EventCategory },
                   { label: 'Administrasi', cat: 'Admin' as EventCategory },
                   { label: 'Ekstrakurikuler', cat: 'Extra' as EventCategory },
                 ].map(item => (
                   <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-md ${getCategoryColor(item.cat)}`}></div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>

      {/* MODAL: ADD EVENT */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Agenda Baru">
         <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Nama Agenda / Kegiatan</label>
               <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Contoh: Ujian Kompetensi Keahlian" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Kategori</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                     <option value="Academic">Akademik</option>
                     <option value="Vocational">Vokasional / Praktik</option>
                     <option value="Holiday">Libur / Cuti</option>
                     <option value="Admin">Administrasi</option>
                     <option value="Extra">Ekstrakurikuler</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Lokasi</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Contoh: Lab RPL" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tanggal Mulai</label>
                  <input type="date" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tanggal Selesai (Opsional)</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Keterangan Tambahan</label>
               <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Detail informasi kegiatan..."></textarea>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Bell size={18} /></div>
                  <div className="flex flex-col">
                     <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase">Broadcast Notifikasi</span>
                     <span className="text-[9px] text-slate-400 font-bold">Kirim email & push ke seluruh target</span>
                  </div>
               </div>
               <input type="checkbox" className="w-5 h-5 accent-indigo-600" defaultChecked />
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-black shadow-2xl shadow-indigo-500/20">Publikasikan Agenda</Button>
         </form>
      </Modal>
    </div>
  );
};
