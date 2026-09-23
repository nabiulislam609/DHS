import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CheckCircle, Bookmark, Compass, Target, Clock, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { setIsAdmissionModalOpen } = useSchool();

  return (
    <section id="about" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
          পরিচিতি
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          বিদ্যালয় পরিচিতি
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          ঐতিহ্য বেশি বছরের ঐতিহ্য, মানসম্মত শিক্ষা ও আধুনিক সুবিধা
        </p>
      </div>

      {/* Grid: 2 cols on left (Introduction, Mission, Vision, Objective) + 1 column on right (Why Choose Us) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: 4 Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: ভূমিকা */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                <Bookmark className="w-4 h-4" />
                <h3 className="text-base text-gray-900">ভূমিকা</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                ১৯৮০ সালে প্রতিষ্ঠিত দাদরা উচ্চ বিদ্যালয় অত্র অঞ্চলের মেধার বিকাশ ও শৃঙ্খলাবোধের প্রাণকেন্দ্র। দক্ষ শিক্ষকমণ্ডলীর নিবিড় তত্ত্বাবধানে ছাত্র-ছাত্রীরা সুশিক্ষা গ্রহণ করে জীবনের বিভিন্ন ক্ষেত্রে গৌরবময় অবদান রাখছে।
              </p>
            </div>
          </div>

          {/* Card 2: উদ্দেশ্য */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                <Target className="w-4 h-4" />
                <h3 className="text-base text-gray-900">উদ্দেশ্য</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                মানসম্মত সাধারণ শিক্ষার সমন্বয়, নৈতিক মূল্যবোধ ও অনুশাসন শিক্ষা দেওয়া, বিজ্ঞান ও প্রযুক্তিগত জ্ঞানের বিকাশ এবং সহশিক্ষা কার্যক্রমে সুযোগ সৃষ্টি করে সার্বিক মেধার স্ফুরণ ঘটানো।
              </p>
            </div>
          </div>

          {/* Card 3: লক্ষ্য */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                <Compass className="w-4 h-4" />
                <h3 className="text-base text-gray-900">লক্ষ্য</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                গুণগত, মানবিক ও আধুনিক শিক্ষার মাধ্যমে শিক্ষার্থীদের সুশৃঙ্খল, সৃজনশীল ও দেশপ্রেমিক নাগরিক হিসেবে গড়ে তোলা। বিদ্যালয়কে ডিজিটাল ও আধুনিক রূপান্তর ঘটিয়ে নতুন প্রজন্মের উপযোগী করে তোলা।
              </p>
            </div>
          </div>

          {/* Card 4: দৃষ্টি */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                <Bookmark className="w-4 h-4" />
                <h3 className="text-base text-gray-900">দৃষ্টি</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                একটি আধুনিক প্রযুক্তিভিত্তিক ও মানবিক শিক্ষা ব্যবস্থা গড়ে তোলা, যেখানে শিক্ষার্থীরা মেধার পূর্ণ বিকাশ ঘটিয়ে সমৃদ্ধ জাতি ও সুন্দর সমাজ গঠনে নেতৃত্ব দিতে পারে।
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Why Choose Us (Dark Green Banner) */}
        <div className="lg:col-span-4 bg-[#0f5338] text-white p-6 sm:p-7 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wider">সুবিধা</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">
              কেন আমাদের বেছে নিবেন
            </h3>

            <ul className="space-y-2.5 text-xs text-emerald-100">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>অভিজ্ঞ ও গুণগত শিক্ষক দল</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>নৈতিক মূল্যবোধ ও প্রাগ্রসর চিন্তা</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>বিজ্ঞান ও প্রযুক্তি নির্ভর ল্যাব</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>আধুনিক পাঠ্যক্রম ও পাঠ্যবিষয়ক সুবিধা</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>পাঠ্য ও ক্রীড়া কার্যক্রমে শতভাগ সফলতা</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>সম্পূর্ণ সিসিটিভি যুক্ত নিরাপদ ক্যাম্পাস</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="w-full bg-white text-emerald-900 hover:bg-amber-300 font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>ভর্তি আবেদন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Full-Width Card: ইতিহাস */}
        <div className="lg:col-span-12 bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
            <Clock className="w-4 h-4" />
            <h3 className="text-base text-gray-900">ইতিহাস</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            ১৯৮০ সালে তৎকালীন সমাজসেবী ও শিক্ষানুরাগী ব্যক্তিবর্গের ঐকান্তিক প্রচেষ্টায় অত্র অঞ্চলের জন্য দাদরা উচ্চ বিদ্যালয় প্রতিষ্ঠিত হয়। প্রথম দিকে মাত্র কয়েকজন শিক্ষক ও অল্পসংখ্যক শিক্ষার্থী নিয়ে যাত্রা শুরু হলেও আজ এটি ১,২০০+ শিক্ষার্থীর একটি পূর্ণাঙ্গ উচ্চ মাধ্যমিক শিক্ষাপ্রতিষ্ঠান। ১৯৭১ সালের মুক্তিযুদ্ধের এই অঞ্চলের বীর মুক্তিযোদ্ধাদের স্মৃতিবিজড়িত বিদ্যালয়ের প্রতিটি প্রাঙ্গণ আজ নতুন প্রজন্মের স্বপ্ন ও জ্ঞানের তীর্থস্থান।
          </p>
        </div>
      </div>
    </section>
  );
};
