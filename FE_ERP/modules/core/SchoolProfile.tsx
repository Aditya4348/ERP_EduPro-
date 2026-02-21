
import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Button } from '../../components/UI';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_SCHOOL_PROFILE } from '../../constants';
import { Building2, Save, Globe, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const SchoolProfile: React.FC = () => {
  const [profile, setProfile] = useLocalStorage('edupro_school_profile', INITIAL_SCHOOL_PROFILE);

  const handleSave = () => {
    alert('Profil Sekolah berhasil diperbarui!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="text-indigo-600" /> Profil Sekolah
          </h2>
          <p className="text-slate-500">Konfigurasi identitas institusi dan legalitas.</p>
        </div>
        <Button onClick={handleSave}>
          <Save size={18} /> Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="w-32 h-32 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center text-slate-400 mb-4 border-2 border-dashed border-slate-200 group cursor-pointer hover:border-indigo-400 transition-colors">
              <Building2 size={48} className="group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <p className="text-sm text-slate-500">NPSN: {profile.npsn}</p>
            <div className="mt-4 flex justify-center">
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                 <ShieldCheck size={12} /> Terakreditasi {profile.accreditation}
               </span>
            </div>
          </Card>

          <Card title="Kontak Resmi">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Globe size={16} className="text-slate-400" /> {profile.website}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" /> {profile.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" /> {profile.email}
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400 mt-1" /> {profile.address}
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Detail Informasi">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Nama Sekolah</label>
                  <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Kepala Sekolah</label>
                  <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={profile.principalName} onChange={e => setProfile({...profile, principalName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">NPSN</label>
                  <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={profile.npsn} onChange={e => setProfile({...profile, npsn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Akreditasi</label>
                  <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={profile.accreditation} onChange={e => setProfile({...profile, accreditation: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Alamat Lengkap</label>
                  <textarea rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
