
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_CLASSES, INITIAL_STUDENTS } from '../../constants';
import { DoorOpen, Users, UserCheck, ChevronLeft, Eye } from 'lucide-react';

export const ClassDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classes] = useLocalStorage<any[]>('edupro_classes', INITIAL_CLASSES);
  const [students] = useLocalStorage<any[]>('edupro_students', INITIAL_STUDENTS);
  
  const classData = classes.find(c => c.id === id);
  
  // Filter students based on matching grade AND major code (e.g. RPL, TKJ, MM)
  const classStudents = students.filter(s => 
    s.grade === classData?.grade && 
    (classData?.majorCode ? s.major === classData.majorCode : true)
  );

  if (!classData) return (
    <div className="p-8 text-center animate-fade-in">
      <Breadcrumbs />
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">Data kelas tidak ditemukan.</p>
        <Button onClick={() => navigate('/core/classes')} className="mt-4 mx-auto">Kembali</Button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" onClick={() => navigate(-1)} className="p-2 rounded-full">
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Rincian Rombongan Belajar</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-indigo-600 text-white relative overflow-hidden">
             <DoorOpen className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Tingkat {classData.grade}</p>
             <h3 className="text-3xl font-black">{classData.name}</h3>
             <p className="text-indigo-100 mt-2 text-sm">{classData.major}</p>
             <div className="mt-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <UserCheck size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase">Wali Kelas</p>
                  <p className="text-sm font-bold">{classData.homeroomTeacher}</p>
                </div>
             </div>
          </Card>

          <Card title="Rekapitulasi">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Siswa Terdeteksi</span>
                <span className="font-bold text-slate-800">{classStudents.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Kapasitas Maksimal</span>
                <span className="font-bold text-slate-800">{classData.studentCount}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" /> Daftar Siswa Terdaftar
            </h4>
            <Button variant="secondary" className="text-xs">Export PDF</Button>
          </div>
          
          <Card className="!p-0 overflow-hidden">
            <Table headers={['NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Aksi']}>
              {classStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{s.nis}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">N/A</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/core/students/${s.id}`)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {classStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada siswa yang dimapping ke kelas ini</td>
                </tr>
              )}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};
