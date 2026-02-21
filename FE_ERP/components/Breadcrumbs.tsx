
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 overflow-x-auto pb-2 whitespace-nowrap">
      <Link to="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
        <Home size={14} /> Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} className="shrink-0" />
            {last ? (
              <span className="text-slate-800 font-bold">{capitalize(value)}</span>
            ) : (
              <Link to={to} className="hover:text-indigo-600 transition-colors">
                {capitalize(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
