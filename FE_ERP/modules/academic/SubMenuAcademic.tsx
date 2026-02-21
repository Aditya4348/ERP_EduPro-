import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  Laptop,
  FileText,
  MonitorCheck,
  Library,
  FolderOpen,
  CalendarDays,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const SubMenuAcademic: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
  {
    title: "Attendance",
    icon: <ClipboardCheck size={26} />,
    path: "/academic/attendance",
    color: "bg-blue-500",
  },
  {
    title: "Journal",
    icon: <BookOpen size={26} />,
    path: "/academic/journal",
    color: "bg-emerald-500",
  },
  {
    title: "Schedule",
    icon: <Calendar size={26} />,
    path: "/academic/schedule",
    color: "bg-orange-500",
  },
  {
    title: "LMS",
    icon: <Laptop size={26} />,
    path: "/academic/lms",
    color: "bg-indigo-500",
  },
  {
    title: "Grades",
    icon: <FileText size={26} />,
    path: "/academic/grades",
    color: "bg-purple-500",
  },
  {
    title: "CBT",
    icon: <MonitorCheck size={26} />,
    path: "/academic/cbt",
    color: "bg-rose-500",
  },
  {
    title: "Curriculum",
    icon: <Library size={26} />,
    path: "/academic/curriculum",
    color: "bg-teal-500",
  },
  {
    title: "Portfolio",
    icon: <FolderOpen size={26} />,
    path: "/academic/portfolio",
    color: "bg-yellow-500",
  },
  {
    title: "Calendar",
    icon: <CalendarDays size={26} />,
    path: "/academic/calendar",
    color: "bg-slate-500",
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
