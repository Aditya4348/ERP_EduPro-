import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  HeartHandshake,
  Layers,
  Star,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const SubMenuStudentAffairs: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
  {
    title: "Counseling",
    icon: <HeartHandshake size={26} />,
    path: "/student-affairs/counseling",
    color: "bg-rose-500",
  },
  {
    title: "OSIS",
    icon: <Users size={26} />,
    path: "/student-affairs/osis",
    color: "bg-indigo-500",
  },
  {
    title: "OSIS Sections",
    icon: <Layers size={26} />,
    path: "/student-affairs/osis/sections",
    color: "bg-blue-500",
  },
  {
    title: "Extracurricular",
    icon: <Star size={26} />,
    path: "/student-affairs/extracurricular",
    color: "bg-emerald-500",
  }
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
