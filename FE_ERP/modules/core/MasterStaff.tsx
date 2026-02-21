
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../../components/UI';
import { HelpGuide } from '../../components/HelpGuide';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { INITIAL_STAFF } from '../../constants';
import { Search, Plus, Trash2, Contact, Eye } from 'lucide-react';

interface Staff {
  id: string;
  nip: string;
  name: string;
  role: string;
  phone: string;
  department: string;
}

export const MasterStaff: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useLocalStorage<Staff[]>('edupro_staff', INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ nip: '', name: '', role: '', phone: '', department: 'Tata Usaha' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: Staff = { id: Date.now().toString(), ...formData };
    setStaffList([newStaff, ...staffList]);
    setIsModalOpen(false);
    setFormData({ nip: '', name: '', role: '', phone: '', department: 'Tata Usaha' });
  };

  const deleteStaff = (id: string) => {
    if (confirm('Hapus data staff ini?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const filtered = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nip.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Contact className="text-indigo-600" /> Master Data Staff
          </h2>
          <p className="text-slate-500">Manajemen seluruh karyawan non-guru dan operasional.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari staff..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Tambah Staff
          </Button>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <Table headers={['NIP', 'Nama Lengkap', 'Jabatan', 'Departemen', 'Telepon', 'Aksi']}>
          {filtered.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{s.nip}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{s.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{s.role}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{s.department}</span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{s.phone}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => navigate(`/core/staff/${s.id}`)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button onClick={() => deleteStaff(s.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Staff Baru">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">NIP</label>
              <input 
                required 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                value={formData.nip} 
                onChange={e => setFormData({...formData, nip: e.target.value})} 
                placeholder="Ex: 19901010"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Departemen</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option>Tata Usaha</option>
                <option>Keamanan</option>
                <option>Kebersihan</option>
                <option>Laboran</option>
                <option>Perpustakaan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nama Lengkap</label>
            <input 
              required 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Maya Indah Sari"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Jabatan</label>
                <input required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Admin TU" />
             </div>
             <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">No. Telepon</label>
                <input required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0812..." />
             </div>
          </div>
          <div className="pt-4 flex gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
             <Button type="submit" className="flex-1 shadow-lg shadow-indigo-200">Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
