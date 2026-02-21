
import React from 'react';
import { Card, Table, Button } from '../components/UI';
import { HelpGuide } from '../components/HelpGuide';

export const Inventory: React.FC = () => {
  const assets = [
    { name: 'Laptop ASUS ExpertBook', category: 'Elektronik', room: 'Lab Komputer 1', condition: 'Baik' },
    { name: 'Proyektor Epson EB-X05', category: 'Elektronik', room: 'Kelas X-A', condition: 'Butuh Perawatan' },
    { name: 'Meja Siswa Kayu Jati', category: 'Mebel', room: 'Kelas XII-B', condition: 'Baik' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Inventaris Barang</h2>
        <Button>Tambah Aset</Button>
      </div>
      <Card className="!p-0">
        <Table headers={['Nama Barang', 'Kategori', 'Lokasi/Ruang', 'Kondisi']}>
          {assets.map((a, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold">{a.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{a.category}</td>
              <td className="px-6 py-4 text-sm">{a.room}</td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  a.condition === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>{a.condition}</span>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <HelpGuide guideId="assets-inventory" />
    </div>
  );
};
