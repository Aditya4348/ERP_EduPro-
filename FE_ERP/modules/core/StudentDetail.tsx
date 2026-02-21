
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button, Modal, Table } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_STUDENTS } from '../../constants';
import { Mail, Phone, MapPin, Award, BookOpen, CreditCard, ChevronLeft, FileText, Download, Plus, Trash2 } from 'lucide-react';

export const StudentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students] = useLocalStorage<any[]>('edupro_students', INITIAL_STUDENTS);
  const student = students.find(s => s.id === id);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  if (!student) return (
    <div className="p-8 text-center animate-fade-in">
      <Breadcrumbs />
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">Data siswa dengan ID {id} tidak ditemukan.</p>
        <Button onClick={() => navigate('/core/students')} className="mt-4 mx-auto">Kembali ke Daftar</Button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)} className="p-2 rounded-full">
            <ChevronLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-slate-900">Profil Lengkap Siswa</h2>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" className="text-xs">Ubah Password Akun</Button>
           <Button className="text-xs">Edit Profil</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="w-32 h-32 bg-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 font-black text-4xl mb-6 shadow-lg shadow-indigo-100 relative">
              {student.name.charAt(0)}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white" title="Status Aktif">
                 <UserCheck size={14} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
            <p className="text-slate-400 font-mono text-sm mt-1">{student.nis}</p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">Kelas {student.grade}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">{student.major}</span>
            </div>
          </Card>

          <Card title="Kontak & Alamat">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" /> {student.name.toLowerCase().replace(' ', '.')}@school.id
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" /> +62 812 3456 7890
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400 mt-1 shrink-0" /> Jl. Pendidikan No. 123, Jakarta Selatan, 12710
              </div>
            </div>
          </Card>

          <Card title="Custom Fields (E-Data)">
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Ukuran Seragam</span>
                   <span className="font-bold">L</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Golongan Darah</span>
                   <span className="font-bold">O</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Hobi</span>
                   <span className="font-bold">Coding, Musik</span>
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Informasi Akademik" className="flex flex-col gap-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-400 text-sm">Status Akademik</span>
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-1 rounded">Aktif</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-400 text-sm">Rata-rata Nilai</span>
                  <span className="text-slate-900 font-bold text-sm">84.2</span>
               </div>
               <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">Kehadiran (Semester Ini)</span>
                  <span className="text-slate-900 font-bold text-sm">98.5%</span>
               </div>
            </Card>

            <Card title="Status Keuangan" className="flex flex-col gap-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-400 text-sm">Tunggakan SPP</span>
                  <span className="text-rose-600 font-bold text-sm">Rp 0</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-400 text-sm">Total Terbayar</span>
                  <span className="text-emerald-600 font-bold text-sm">Rp 4.500.000</span>
               </div>
               <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">Beasiswa</span>
                  <span className="text-indigo-600 font-bold text-sm">Tidak Ada</span>
               </div>
            </Card>
          </div>

          <Card title="Arsip Dokumen Digital">
             <div className="mb-4 flex justify-end">
                <Button variant="secondary" onClick={() => setIsDocModalOpen(true)} className="text-xs">
                   <Plus size={14} /> Upload Dokumen
                </Button>
             </div>
             <Table headers={['Nama Dokumen', 'Format', 'Tgl Upload', 'Aksi']}>
                <tr>
                   <td className="px-6 py-4 flex items-center gap-3">
                      <FileText size={18} className="text-rose-500" />
                      <span className="text-sm font-bold">Kartu Keluarga.pdf</span>
                   </td>
                   <td className="px-6 py-4 text-xs text-slate-500">PDF (1.2 MB)</td>
                   <td className="px-6 py-4 text-xs text-slate-400">12 Feb 2024</td>
                   <td className="px-6 py-4">
                      <div className="flex gap-2">
                         <button className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"><Download size={14} /></button>
                         <button className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                   </td>
                </tr>
                <tr>
                   <td className="px-6 py-4 flex items-center gap-3">
                      <FileText size={18} className="text-blue-500" />
                      <span className="text-sm font-bold">Ijazah SMP.pdf</span>
                   </td>
                   <td className="px-6 py-4 text-xs text-slate-500">PDF (2.4 MB)</td>
                   <td className="px-6 py-4 text-xs text-slate-400">12 Feb 2024</td>
                   <td className="px-6 py-4">
                      <div className="flex gap-2">
                         <button className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"><Download size={14} /></button>
                         <button className="p-1.5 bg-slate-100 rounded text-slate-600 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                   </td>
                </tr>
             </Table>
          </Card>

          <Card title="Aktivitas Terbaru">
            <div className="space-y-6">
              {[
                { icon: <BookOpen />, title: 'Mengunggah tugas Matematika', time: '2 jam yang lalu', color: 'indigo' },
                { icon: <Award />, title: 'Menerima Sertifikat Lomba Web Design', time: '1 hari yang lalu', color: 'amber' },
                { icon: <CreditCard />, title: 'Pembayaran SPP Bulan Maret Terkonfirmasi', time: '3 hari yang lalu', color: 'emerald' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`p-2 bg-${act.color}-50 text-${act.color}-600 rounded-xl`}>{act.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{act.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title="Unggah Dokumen Baru">
         <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Jenis Dokumen</label>
               <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>Akta Kelahiran</option>
                  <option>Kartu Keluarga</option>
                  <option>Ijazah Terakhir</option>
                  <option>Sertifikat Kompetensi</option>
                  <option>Dokumen Lainnya</option>
               </select>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
               <p className="font-bold text-slate-700">Pilih file scan dokumen</p>
               <p className="text-xs text-slate-400 mt-1">PDF, JPG, atau PNG (Maks 5MB)</p>
            </div>
            <Button onClick={() => setIsDocModalOpen(false)} className="w-full">Upload & Simpan</Button>
         </div>
      </Modal>
    </div>
  );
};

// Internal sub-component
const UserCheck: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
