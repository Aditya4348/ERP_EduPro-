
import React from 'react';
import { Card } from '../components/UI';
import { HELP_GUIDES } from '../helpData';

export const HelpCenter: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Pusat Bantuan EduPro</h2>
        <p className="text-slate-500 mt-2">Temukan panduan lengkap penggunaan sistem ERP Sekolah.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.values(HELP_GUIDES).map((guide) => (
          <Card key={guide.id} title={guide.title} className="hover:shadow-md transition-shadow">
            <p className="text-slate-600 mb-4">{guide.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
               {guide.roles.map(r => (
                 <span key={r} className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded uppercase">
                   {r.replace('_', ' ')}
                 </span>
               ))}
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-800">Langkah Penggunaan:</h5>
              <ul className="text-sm text-slate-500 list-disc list-inside">
                {guide.steps.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                <li className="list-none text-indigo-600 font-medium mt-1 cursor-pointer hover:underline">Baca selengkapnya...</li>
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
