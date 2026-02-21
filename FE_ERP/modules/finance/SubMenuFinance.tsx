// d:\ADITYA\KERJA\CODE\Pribadi\ERP_EduPro-\FE_ERP\modules\finance\SubMenuFinance.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Book,
  Banknote,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const SubMenuFinance: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      title: "Tagihan SPP",
      icon: <CreditCard size={26} />,
      path: "/finance/spp",
      color: "bg-indigo-500",
    },
    {
      title: "Buku Kas & Jurnal",
      icon: <Book size={26} />,
      path: "/finance/accounting",
      color: "bg-emerald-500",
    },
    {
      title: "Payroll / Gaji",
      icon: <Banknote size={26} />,
      path: "/finance/payroll",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <div
            className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white mb-3 ${item.color} shadow-lg group-hover:scale-110 transition-transform`}
          >
            {item.icon}
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </p>
        </button>
      ))}
    </div>
  );
};
