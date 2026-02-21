
import React from 'react';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  KEPALA_SEKOLAH = 'KEPALA_SEKOLAH',
  WAKASEK = 'WAKASEK',
  GURU = 'GURU',
  WALI_KELAS = 'WALI_KELAS',
  BK = 'BK',
  TATA_USAHA = 'TATA_USAHA',
  BENDA_HARA = 'BENDAHARA',
  SISWA = 'SISWA',
  ORANG_TUA = 'ORANG_TUA',
  OSIS = 'OSIS',
  PEMBINA_ESKUL = 'PEMBINA_ESKUL',
  ALUMNI = 'ALUMNI',
  MITRA_INDUSTRI = 'MITRA_INDUSTRI',
  YAYASAN = 'YAYASAN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
}

// OSIS Specific Types
export interface OSISMember {
  id: string;
  name: string;
  position: string;
  section: string;
  class: string;
  status: 'Aktif' | 'Demisioner';
}

export interface OSISSection {
  id: string;
  name: string;
  description: string;
  jobdesk: string[];
}

export interface OSISTask {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignee: string;
}

export interface OSISBudgetLog {
  id: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  category?: string;
  receiptUrl?: string;
}

export interface OSISGlobalFinanceLog {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Masuk' | 'Keluar';
  category: string;
}

export interface OSISAsset {
  id: string;
  name: string;
  qty: number;
  condition: 'Baik' | 'Rusak' | 'Hilang';
  location: string;
}

export interface OSISCommittee {
  id: string;
  name: string;
  role: string;
  jobdesk?: string;
}

export interface OSISProgram {
  id: string;
  title: string;
  date: string;
  budget: number;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  progress: number;
  description?: string;
  tasks?: OSISTask[];
  budgetLogs?: OSISBudgetLog[];
  committee?: OSISCommittee[];
}

export interface OSISProposal {
  id: string;
  title: string;
  submittedBy: string;
  date: string;
  status: 'Draft' | 'Checking' | 'Pembina_Approved' | 'Wakasek_Approved' | 'Final_Approved' | 'Rejected';
  category: 'Kegiatan' | 'Anggaran' | 'Saran';
}

export interface OSISAspiration {
  id: string;
  sender: string; // Bisa 'Anonymous'
  date: string;
  subject: string;
  content: string;
  status: 'New' | 'Read' | 'Responded';
  response?: string;
}

// Extracurricular Types
export interface Extracurricular {
  id: string;
  name: string;
  category: 'Olahraga' | 'Seni' | 'Sains' | 'Sosial' | 'Wajib';
  coach: string; // Nama Pembina
  schedule: string;
  location: string;
  memberCount: number;
  description: string;
  status: 'Aktif' | 'Vakum';
  icon?: string;
}

export interface EskulMember {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  joinDate: string;
  role: 'Ketua' | 'Sekretaris' | 'Bendahara' | 'Anggota';
  grade?: 'A' | 'B' | 'C' | 'D'; // Nilai untuk rapor
  note?: string;
}

export interface EskulSession {
  id: string;
  date: string;
  topic: string;
  attendanceCount: number;
  coachNote?: string;
}

export interface EskulAchievement {
  id: string;
  title: string;
  eskulName: string;
  rank: string; // Juara 1, Harapan 2, dll
  level: 'Kecamatan' | 'Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  date: string;
  certificateUrl?: string;
}

export interface EskulProgram {
  id: string;
  title: string;
  date: string;
  status: 'Rencana' | 'Berjalan' | 'Selesai';
  description: string;
}

export interface EskulFinanceLog {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Masuk' | 'Keluar';
}

export interface EskulAsset {
  id: string;
  name: string;
  qty: number;
  condition: 'Baik' | 'Rusak' | 'Hilang';
}

export type EventCategory = 'Academic' | 'Holiday' | 'Admin' | 'Vocational' | 'Extra';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; 
  endDate?: string;  
  category: EventCategory;
  description?: string;
  location?: string;
  isGlobal: boolean;
  targetRoles?: UserRole[];
}

export interface ViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  category: 'Disiplin' | 'Kerapihan' | 'Etika' | 'Berat';
  description: string;
  points: number;
  date: string;
  reportedBy: string;
  status: 'Recorded' | 'Resolved' | 'SP1' | 'SP2' | 'SP3';
}

export interface AchievementPoint {
  id: string;
  studentId: string;
  title: string;
  points: number;
  date: string;
}

export interface CounselingLog {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  category: 'Pribadi' | 'Sosial' | 'Belajar' | 'Karir';
  notes: string;
  isPrivate: boolean;
  followUp: string;
}

export interface CareerPlan {
  id: string;
  studentId: string;
  studentName: string;
  plan: 'Kuliah' | 'Kerja' | 'Wirausaha' | 'Belum Tahu';
  target: string; // Nama Univ / Nama Perusahaan / Bidang Usaha
  notes: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'H' | 'S' | 'I' | 'A';
  note?: string;
}

export interface ClassJournal {
  id: string;
  date: string;
  className: string;
  subject: string;
  material: string;
  notes: string;
  teacherId: string;
}

export interface ProjectAsset {
  id: string;
  type: 'PDF' | 'IMAGE' | 'VIDEO' | 'LINK';
  name: string;
  url: string;
}

export interface StudentProject {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  date: string;
  thumbnail?: string;
  description: string;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  tags: string[];
  links: {
    github?: string;
    behance?: string;
    youtube?: string;
    other?: string;
  };
  assets: ProjectAsset[];
  score?: number;
  teacherFeedback?: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  logo?: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date';
  value: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  grade: string;
  major: string;
  customFields?: CustomField[];
  documents?: StudentDocument[];
}

export interface HelpContent {
  id: string;
  title: string;
  description: string;
  purpose: string;
  steps: string[];
  fields?: Record<string, string>;
  workflow: string;
  roles: UserRole[];
  notes?: string[];
}

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  submenu?: MenuItem[];
}
