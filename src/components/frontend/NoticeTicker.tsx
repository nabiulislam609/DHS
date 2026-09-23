import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Bell } from 'lucide-react';

export const NoticeTicker: React.FC = () => {
  const { notices } = useSchool();

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'জরুরি':
        return 'bg-emerald-600 text-white';
      case 'ভর্তি':
        return 'bg-amber-600 text-white';
      case 'পরীক্ষা':
        return 'bg-rose-600 text-white';
      case 'ক্রীড়া':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-emerald-700 text-white';
    }
  };

  return (
    <div className="w-full bg-emerald-900/90 border-b border-emerald-800 text-white py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Ticker Title Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-800 text-amber-300 px-3 py-1 rounded-full text-xs font-bold shrink-0 shadow-xs">
          <Bell className="w-3.5 h-3.5 animate-bounce text-amber-300" />
          <span>সর্বশেষ নোটিশ:</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden relative w-full whitespace-nowrap">
          <div className="inline-flex items-center gap-6 animate-marquee">
            {notices.map((notice) => (
              <a
                key={notice.id}
                href="#notices"
                className="inline-flex items-center gap-2 hover:text-amber-300 transition text-xs sm:text-sm font-medium"
              >
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getBadgeColor(notice.category)}`}>
                  {notice.category}
                </span>
                <span>
                  {notice.code ? `${notice.code} : ` : ''}{notice.title}
                </span>
                <span className="text-emerald-400 font-bold">•</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
