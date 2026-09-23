import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Trophy, Medal, Star, Cpu } from 'lucide-react';
import { AchievementItem } from '../../types';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useSchool();

  const getAchievementIcon = (type: AchievementItem['iconType']) => {
    switch (type) {
      case 'olympiad':
        return { icon: Medal, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'sports':
        return { icon: Trophy, color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'scholarship':
        return { icon: Star, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'tech':
        return { icon: Cpu, color: 'bg-teal-50 text-teal-700 border-teal-200' };
      default:
        return { icon: Award, color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  return (
    <section id="achievements" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
          অর্জন
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          আমাদের গর্ব
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          মেধা ও ঐতিহ্যে বিদ্যালয়ের অর্জনের কিছু দৃষ্টান্ত
        </p>
      </div>

      {/* 5 Cards Row/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {achievements.map((item) => {
          const { icon: Icon, color } = getAchievementIcon(item.iconType);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">
                    {item.year}
                  </span>
                </div>

                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 block mb-1">
                  {item.category}
                </span>

                <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {item.subtitle}
                </p>
              </div>

              {item.authorOrTeam && (
                <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-400 truncate">
                  {item.authorOrTeam}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
