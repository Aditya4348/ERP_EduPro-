
import React from 'react';
import { UserRole, MenuItem, SchoolProfile } from './types';
import { 
  LayoutDashboard, Database, BookOpen, GraduationCap, Wallet, 
  Package, Megaphone, Briefcase, UsersRound, FolderTree, 
  LineChart, HelpCircle, Users, UserSquare, Contact, DoorOpen,
  Calendar, MonitorPlay, FileSpreadsheet, ClipboardList, ShieldAlert,
  Users2, Dribbble, CreditCard, Book, Banknote, Archive, Key,
  Bell, Newspaper, Factory, Search, Building2, Rocket, FileUp, 
  ShieldCheck, UserCheck, BookMarked, History, Award
} from 'lucide-react';

export const COLORS = {
  primary: 'indigo-600',
  secondary: 'slate-600',
  accent: 'emerald-500',
  danger: 'rose-500',
  warning: 'amber-500',
  bg: 'slate-50',
  sidebar: 'slate-900',
};

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  name: 'SMK Informatika Utama',
  npsn: '12345678',
  accreditation: 'A (Unggul)',
  address: 'Jl. Tekno No. 10, Jakarta Selatan',
  phone: '(021) 555-0123',
  email: 'info@smkutama.sch.id',
  website: 'www.smkutama.sch.id',
  principalName: 'Dr. Iwan Setiawan, M.Kom'
};

export const INITIAL_STUDENTS = [
  { id: '1', nis: '2024001', name: 'Ahmad Faisal', grade: 'X', major: 'RPL' },
  { id: '2', nis: '2024002', name: 'Budi Santoso', grade: 'XI', major: 'TKJ' },
  { id: '3', nis: '2024003', name: 'Citra Dewi', grade: 'XII', major: 'MM' },
];

export const INITIAL_TEACHERS = [
  { id: '1', nip: '198801012010011001', name: 'Dr. Iwan Setiawan', subject: 'Matematika', status: 'Aktif' },
  { id: '2', nip: '199005122015022002', name: 'Siti Aminah, M.Pd', subject: 'Bahasa Indonesia', status: 'Aktif' },
  { id: '3', nip: '198503202008011003', name: 'Bambang Subianto, S.Kom', subject: 'Informatika', status: 'Cuti' },
];

export const INITIAL_STAFF = [
  { id: '1', nip: '19920101', name: 'Heri Susanto', role: 'Security', phone: '08123456789', department: 'Operasional' },
  { id: '2', nip: '19950510', name: 'Maya Indah', role: 'Staff TU', phone: '08129876543', department: 'Tata Usaha' },
  { id: '3', nip: '19891220', name: 'Dedi Kurniawan', role: 'Laboran', phone: '08134455667', department: 'Sarana' },
];

export const INITIAL_CLASSES = [
  { id: '1', name: 'X RPL 1', major: 'Rekayasa Perangkat Lunak', grade: 'X', homeroomTeacher: 'Iwan Setiawan', studentCount: 36, majorCode: 'RPL' },
  { id: '2', name: 'XI TKJ 2', major: 'Teknik Komputer Jaringan', grade: 'XI', homeroomTeacher: 'Maya Indah', studentCount: 32, majorCode: 'TKJ' },
  { id: '3', name: 'XII MM 1', major: 'Multimedia', grade: 'XII', homeroomTeacher: 'Dedi Kurniawan', studentCount: 34, majorCode: 'MM' },
];

const ALL_ROLES = Object.values(UserRole);

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />,
    roles: ALL_ROLES,
  },
  {
    title: 'Core Management',
    path: '/core',
    icon: <Database size={20} />,
    roles: [UserRole.SUPER_ADMIN, UserRole.TATA_USAHA, UserRole.KEPALA_SEKOLAH],
    submenu: [
      { title: 'Master Insights', path: '/core/insights', roles: ALL_ROLES, icon: <LineChart size={16} /> },
      { title: 'Profil Sekolah', path: '/core/profile', roles: [UserRole.SUPER_ADMIN], icon: <Building2 size={16} /> },
      { title: 'Master Siswa', path: '/core/students', roles: ALL_ROLES, icon: <Users size={16} /> },
      { title: 'Master Guru', path: '/core/teachers', roles: ALL_ROLES, icon: <UserSquare size={16} /> },
      { title: 'Promotion Engine', path: '/core/promotion', roles: [UserRole.SUPER_ADMIN, UserRole.TATA_USAHA], icon: <Rocket size={16} /> },
      { title: 'Data Staff', path: '/core/staff', roles: ALL_ROLES, icon: <Contact size={16} /> },
      { title: 'Kelas & Jurusan', path: '/core/classes', roles: ALL_ROLES, icon: <DoorOpen size={16} /> },
    ]
  },
  {
    title: 'Akademik',
    path: '/academic',
    icon: <BookOpen size={20} />,
    roles: [UserRole.GURU, UserRole.SISWA, UserRole.WAKASEK, UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH],
    submenu: [
      { title: 'Absensi Digital', path: '/academic/attendance', roles: [UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.WAKASEK], icon: <UserCheck size={16} /> },
      { title: 'Jurnal Mengajar', path: '/academic/journal', roles: [UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH], icon: <History size={16} /> },
      { title: 'Jadwal Pelajaran', path: '/academic/schedule', roles: ALL_ROLES, icon: <Calendar size={16} /> },
      { title: 'LMS / E-Learning', path: '/academic/lms', roles: ALL_ROLES, icon: <MonitorPlay size={16} /> },
      { title: 'Nilai & E-Raport', path: '/academic/grades', roles: [UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.WAKASEK], icon: <FileSpreadsheet size={16} /> },
      { title: 'Bank Soal & CBT', path: '/academic/cbt', roles: [UserRole.GURU, UserRole.SUPER_ADMIN], icon: <ClipboardList size={16} /> },
      { title: 'Manajemen Kurikulum', path: '/academic/curriculum', roles: [UserRole.SUPER_ADMIN, UserRole.WAKASEK, UserRole.KEPALA_SEKOLAH], icon: <BookMarked size={16} /> },
      { title: 'Portofolio Siswa', path: '/academic/portfolio', roles: ALL_ROLES, icon: <Award size={16} /> },
      { title: 'Kalender Akademik', path: '/academic/calendar', roles: ALL_ROLES, icon: <Calendar size={16} /> },
    ]
  },
  {
    title: 'Kesiswaan',
    path: '/student-affairs',
    icon: <GraduationCap size={20} />,
    roles: [UserRole.BK, UserRole.WAKASEK, UserRole.SUPER_ADMIN, UserRole.OSIS],
    submenu: [
      { title: 'BK & Pelanggaran', path: '/student-affairs/counseling', roles: ALL_ROLES, icon: <ShieldAlert size={16} /> },
      { title: 'OSIS & MPK', path: '/student-affairs/osis', roles: ALL_ROLES, icon: <Users2 size={16} /> },
      { title: 'Ekstrakurikuler', path: '/student-affairs/extracurricular', roles: ALL_ROLES, icon: <Dribbble size={16} /> },
    ]
  },
  {
    title: 'Keuangan',
    path: '/finance',
    icon: <Wallet size={20} />,
    // Fix: Changed UserRole.BENDAHARA to UserRole.BENDA_HARA to match types.ts
    roles: [UserRole.BENDA_HARA, UserRole.SUPER_ADMIN, UserRole.YAYASAN],
    submenu: [
      { title: 'Tagihan SPP', path: '/finance/spp', roles: ALL_ROLES, icon: <CreditCard size={16} /> },
      // Fix: Changed UserRole.BENDAHARA to UserRole.BENDA_HARA to match types.ts
      { title: 'Buku Kas & Jurnal', path: '/finance/accounting', roles: [UserRole.BENDA_HARA], icon: <Book size={16} /> },
      // Fix: Changed UserRole.BENDAHARA to UserRole.BENDA_HARA to match types.ts
      { title: 'Payroll / Gaji', path: '/finance/payroll', roles: [UserRole.BENDA_HARA], icon: <Banknote size={16} /> },
    ]
  },
  {
    title: 'Humas & Komunikasi',
    path: '/comms',
    icon: <Megaphone size={20} />,
    roles: ALL_ROLES,
    submenu: [
      { title: 'Pengumuman', path: '/comms/announcements', roles: ALL_ROLES, icon: <Bell size={16} /> },
      { title: 'Portal Berita', path: '/comms/news', roles: ALL_ROLES, icon: <Newspaper size={16} /> },
    ]
  },
  {
    title: 'SMK Khusus',
    path: '/vocational',
    icon: <Briefcase size={20} />,
    roles: [UserRole.MITRA_INDUSTRI, UserRole.WAKASEK, UserRole.SUPER_ADMIN],
    submenu: [
      { title: 'PKL / Prakerin', path: '/vocational/internship', roles: ALL_ROLES, icon: <Factory size={16} /> },
      { title: 'BKK / Karir', path: '/vocational/career', roles: ALL_ROLES, icon: <Search size={16} /> },
    ]
  },
  {
    title: 'Pusat Bantuan',
    path: '/help-center',
    icon: <HelpCircle size={20} />,
    roles: ALL_ROLES,
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.KEPALA_SEKOLAH]: 'Kepala Sekolah',
  [UserRole.WAKASEK]: 'Wakasek',
  [UserRole.GURU]: 'Guru',
  [UserRole.WALI_KELAS]: 'Wali Kelas',
  [UserRole.BK]: 'Guru BK',
  [UserRole.TATA_USAHA]: 'Tata Usaha',
  // Fix: Changed UserRole.BENDAHARA to UserRole.BENDA_HARA to match types.ts
  [UserRole.BENDA_HARA]: 'Bendahara',
  [UserRole.SISWA]: 'Siswa',
  [UserRole.ORANG_TUA]: 'Orang Tua',
  [UserRole.OSIS]: 'Pengurus OSIS',
  [UserRole.PEMBINA_ESKUL]: 'Pembina Eskul',
  [UserRole.ALUMNI]: 'Alumni',
  [UserRole.MITRA_INDUSTRI]: 'Mitra Industri',
  [UserRole.YAYASAN]: 'Yayasan',
};
