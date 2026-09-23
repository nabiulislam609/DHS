import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Pin, Calendar, Tag, ArrowRight, Eye, X } from 'lucide-react';
import { Notice } from '../../types';

export const NoticeBoard: React.FC = () => {
  const { notices, setCurrentFrontendPage } = useSchool();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const pinnedNotice = notices.find((n) => n.pinned) || notices[0];
  const regularNotices = notices;

  const parseDate = (dateStr: string) => {
    // Expected format like "22 Sep 2026" or "2026-09-22"
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      return { day: parts[0], month: parts[1] };
    }
    return { day: '০১', month: 'নোটিশ' };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'জরুরি':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'ভর্তি':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'পরীক্ষা':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ক্রীড়া':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'অনুষ্ঠান':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section id="notices" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
          নোটিশ বোর্ড
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          সর্বশেষ নোটিশ
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          বিদ্যালয়ের সকল গুরুত্বপূর্ণ নোটিশ ও বিজ্ঞপ্তির একনজরে
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pinned Notice Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Dark green header bar */}
            <div className="bg-[#0f5338] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Pin className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>পিন করা নোটিশ</span>
              </div>
              <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {pinnedNotice?.category || 'জরুরি'}
              </span>
            </div>

            {/* Pinned Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{pinnedNotice?.date}</span>
                  <span>•</span>
                  <Tag className="w-3.5 h-3.5" />
                  <span>গুরুত্বপূর্ণ</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-emerald-700 transition">
                  {pinnedNotice?.code ? `${pinnedNotice.code} ` : ''}{pinnedNotice?.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {pinnedNotice?.content}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setSelectedNotice(pinnedNotice)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold py-2.5 rounded-lg transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>বিস্তারিত পড়ুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Notices List (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">সাম্প্রতিক নোটিশ</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                (মোট: {regularNotices.length} টি)
              </span>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
              {regularNotices.slice(0, 5).map((item) => {
                const { day, month } = parseDate(item.date);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNotice(item)}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/80 px-2 rounded-lg transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <span className="text-sm font-bold text-emerald-900 group-hover:text-white leading-none">
                          {day}
                        </span>
                        <span className="text-[10px] text-emerald-700 group-hover:text-emerald-100 uppercase mt-0.5">
                          {month}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                          {item.pinned && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                              <Pin className="w-2.5 h-2.5 fill-amber-500" />
                              পিন্ড
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Bottom View All Button */}
            <div className="text-center pt-4 mt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setCurrentFrontendPage('notices');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl border border-emerald-600/30 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition cursor-pointer shadow-2xs group"
              >
                <span>সব নোটিশ দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span>{selectedNotice.date}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryColor(selectedNotice.category)}`}>
                {selectedNotice.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedNotice.code ? `${selectedNotice.code}: ` : ''}{selectedNotice.title}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
              {selectedNotice.content}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
