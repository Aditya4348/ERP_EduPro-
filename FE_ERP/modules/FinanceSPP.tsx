
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Table, Button, Modal } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';

interface Transaction {
  id: string;
  studentName: string;
  month: string;
  amount: number;
  date: string;
  status: 'Lunas' | 'Pending' | 'Gagal';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', studentName: 'Ahmad Faisal', month: 'Januari 2024', amount: 500000, date: '2024-01-15', status: 'Lunas' },
  { id: '2', studentName: 'Budi Santoso', month: 'Januari 2024', amount: 500000, date: '2024-01-18', status: 'Pending' },
  { id: '3', studentName: 'Citra Dewi', month: 'Januari 2024', amount: 500000, date: '2024-01-20', status: 'Lunas' },
];

export const FinanceSPP: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('edupro_transactions', INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', month: '', amount: 500000 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Lunas'
    };
    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setFormData({ studentName: '', month: '', amount: 500000 });
  };

  const deleteTx = (id: string) => {
    if (confirm('Hapus transaksi ini?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen SPP</h2>
          <p className="text-slate-500">Rekapitulasi pembayaran iuran sekolah siswa.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Catat Pembayaran Baru
        </Button>
      </div>

      <Card className="!p-0">
        <Table headers={['ID', 'Nama Siswa', 'Bulan', 'Nominal', 'Tanggal', 'Status', 'Aksi']}>
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">#{tx.id.slice(-4)}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{tx.studentName}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{tx.month}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">Rp {tx.amount.toLocaleString('id-ID')}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tx.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 
                  tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                   <button onClick={() => deleteTx(tx.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Pembayaran SPP">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Siswa</label>
            <input 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={formData.studentName}
              onChange={e => setFormData({...formData, studentName: e.target.value})}
              placeholder="Contoh: Ahmad Faisal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bulan Tagihan</label>
            <input 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={formData.month}
              onChange={e => setFormData({...formData, month: e.target.value})}
              placeholder="Contoh: Januari 2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
            <input 
              required
              type="number"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})}
            />
          </div>
          <div className="pt-4 flex gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
             <Button type="submit" className="flex-1">Simpan Pembayaran</Button>
          </div>
        </form>
      </Modal>

      <HelpGuide guideId="finance-spp" />
    </div>
  );
};
