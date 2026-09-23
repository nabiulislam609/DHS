import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Mail, Phone, BookOpen } from 'lucide-react';

export const TeachersSection: React.FC = () => {
  const { teachers } = useSchool();

  return (
    <section id="teachers" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
          শিক্ষক মণ্ডলী
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          আমাদের শিক্ষক ও কর্মকর্তা
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          অভিজ্ঞ ও দক্ষ শিক্ষক দ্বারা শিক্ষার্থীদের গড়ে তোলা
        </p>
      </div>

      {/* Teachers Grid (4 cols on lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition text-center flex flex-col items-center justify-between group"
          >
            <div>
              {/* Avatar Initial Circle */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 text-emerald-800 font-bold text-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                {teacher.initial || teacher.name.charAt(0)}
              </div>

              {/* Name & Designation */}
              <h4 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                {teacher.name}
              </h4>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                {teacher.designation}
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-2">
                <BookOpen className="w-3 h-3 text-gray-400" />
                <span>{teacher.subject}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="w-full pt-4 mt-4 border-t border-gray-100 space-y-1.5 text-left text-xs text-gray-500">
              <div className="flex items-center gap-2 truncate hover:text-emerald-700">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 hover:text-emerald-700">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
