
import { HelpContent, UserRole } from './types';

export const HELP_GUIDES: Record<string, HelpContent> = {
  'dashboard': {
    id: 'dashboard',
    title: 'Ringkasan Dashboard',
    description: 'Pusat kontrol seluruh aktivitas sekolah dalam satu layar.',
    purpose: 'Memberikan pandangan 360 derajat terhadap data operasional sekolah.',
    steps: [
      'Pantau widget statistik real-time.',
      'Analisis tren keuangan dan kehadiran siswa.',
      'Gunakan filter role untuk melihat data spesifik.'
    ],
    workflow: 'Login -> Pantau KPI -> Klik Detail Modul -> Eksekusi Tugas.',
    roles: Object.values(UserRole),
  },
  'master students': {
    id: 'master-students',
    title: 'Master Data Siswa',
    description: 'Database pusat seluruh identitas dan rekam jejak siswa.',
    purpose: 'Mengelola siklus hidup siswa dari pendaftaran hingga kelulusan.',
    steps: [
      'Tambah siswa baru dengan menekan tombol biru di pojok kanan.',
      'Gunakan kolom pencarian untuk filter cepat.',
      'Update atau hapus data jika diperlukan.'
    ],
    fields: {
      'NIS': 'Nomor Induk Siswa unik.',
      'NISN': 'Nomor Induk Siswa Nasional.',
      'Kelas/Jurusan': 'Assign siswa ke kelompok belajar.'
    },
    workflow: 'Input Data -> Verifikasi -> Mapping Kelas -> Aktif.',
    roles: [UserRole.SUPER_ADMIN, UserRole.TATA_USAHA, UserRole.KEPALA_SEKOLAH],
  },
  'finance-spp': {
    id: 'finance-spp',
    title: 'Manajemen Keuangan SPP',
    description: 'Modul penagihan dan rekonsiliasi pembayaran iuran siswa.',
    purpose: 'Mengotomatisasi proses penagihan bulanan dan pelaporan kas.',
    steps: [
      'Pilih siswa yang melakukan pembayaran.',
      'Input nominal dan bulan tagihan.',
      'Sistem akan otomatis menerbitkan kuitansi digital.'
    ],
    workflow: 'Tagihan Terbit -> Pembayaran -> Verifikasi -> Update Jurnal Umum.',
    // Fix: Changed UserRole.BENDAHARA to UserRole.BENDA_HARA to match types.ts
    roles: [UserRole.BENDA_HARA, UserRole.SUPER_ADMIN, UserRole.YAYASAN],
  },
  'academic-cbt': {
    id: 'academic-cbt',
    title: 'CBT & Bank Soal',
    description: 'Sistem ujian online dan manajemen kumpulan soal mata pelajaran.',
    purpose: 'Memudahkan pelaksanaan ujian terpusat dan digitalisasi aset soal.',
    steps: [
      'Pilih tab "Bank Soal" untuk mengelola daftar pertanyaan.',
      'Gunakan tab "Jadwal Ujian" untuk membuat sesi ujian baru.',
      'Pantau status ujian (Scheduled, Ongoing, Finished) secara real-time.'
    ],
    workflow: 'Buat Soal -> Susun Jadwal -> Pantau Ujian -> Lihat Hasil.',
    roles: [UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.WAKASEK],
  }
};
