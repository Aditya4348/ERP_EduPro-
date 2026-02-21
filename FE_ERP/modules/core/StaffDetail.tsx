
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_STAFF } from '../../constants';
import { Phone, Building, Shield, ChevronLeft } from 'lucide-react';

export const StaffDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffList] = useLocalStorage<any[]>('edupro_staff', INITIAL_STAFF);
  const staff = staffList.find(s => s.id === id);

  if (!staff) return (
    <div className="p-8 text-center animate-fade-in">
      <Breadcrumbs />
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">Data karyawan tidak ditemukan.</p>
        <Button onClick={() => navigate('/core/staff')} className="mt-4 mx-auto">Kembali</Button>
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
        <h2 className="text-2xl font-bold text-slate-900">Detail Data Karyawan</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-slate-100 rounded-[40px] mx-auto flex items-center justify-center text-slate-400 font-black text-4xl mb-6 border-2 border-dashed border-slate-200">
              {staff.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{staff.name}</h3>
            <p className="text-slate-400 font-mono text-sm mt-1">NIP: {staff.nip}</p>
            <div className="mt-4">
              <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                {staff.role}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Building size={16} className="text-slate-400" /> {staff.department}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" /> {staff.phone}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Shield size={16} className="text-slate-400" /> Akses Sistem: Terbatas
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card title="Tugas & Tanggung Jawab">
            <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
              <p>Mengelola operasional harian di departemen <strong>{staff.department}</strong>. Bertanggung jawab langsung kepada Kepala Tata Usaha dalam hal pelaporan administrasi dan pemeliharaan fasilitas sekolah.</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Melakukan koordinasi teknis antar unit kerja.</li>
                <li>Menyusun laporan ketersediaan inventaris bulanan.</li>
                <li>Memastikan standar operasional prosedur (SOP) dijalankan dengan baik.</li>
              </ul>
            </div>
          </Card>

          <Card title="Log Kehadiran Bulan Ini">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Hadir', value: '20', color: 'emerald' },
                { label: 'Sakit', value: '1', color: 'amber' },
                { label: 'Izin', value: '0', color: 'blue' },
                { label: 'Alpa', value: '0', color: 'rose' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 text-center`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest text-${item.color}-600 mb-1`}>{item.label}</p>
                  <p className={`text-2xl font-black text-${item.color}-700`}>{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
