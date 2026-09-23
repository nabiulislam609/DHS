import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Save, CheckCircle } from 'lucide-react';

export const ManageSiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useSchool();
  const [form, setForm] = useState({ ...siteSettings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">সাইট সেটিংস</h1>
        <p className="text-xs text-gray-500">বিদ্যালয়ের নাম, ঠিকানা, যোগাযোগ ও পরিসংখ্যান তথ্য সম্পাদনা</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>সাইট সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6 text-xs">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            মৌলিক পরিচিতি
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">বিদ্যালয়ের নাম (বাংলা)</label>
              <input
                type="text"
                value={form.schoolNameBangla}
                onChange={(e) => setForm({ ...form, schoolNameBangla: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">বিদ্যালয়ের নাম (English)</label>
              <input
                type="text"
                value={form.schoolNameEnglish}
                onChange={(e) => setForm({ ...form, schoolNameEnglish: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">মূল নীতিবাক্য (Motto / Tagline)</label>
              <input
                type="text"
                value={form.motto}
                onChange={(e) => setForm({ ...form, motto: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            যোগাযোগ ও অবস্থান
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">ফোন নম্বর ১</label>
              <input
                type="text"
                value={form.phone1}
                onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ফোন নম্বর ২</label>
              <input
                type="text"
                value={form.phone2}
                onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">অফিস সময়</label>
              <input
                type="text"
                value={form.officeHours}
                onChange={(e) => setForm({ ...form, officeHours: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Counter Statistics */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            হোমপেজ পরিসংখ্যান কাউন্টার
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">মোট শিক্ষার্থী</label>
              <input
                type="text"
                value={form.totalStudents}
                onChange={(e) => setForm({ ...form, totalStudents: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">শিক্ষক সংখ্যা</label>
              <input
                type="text"
                value={form.totalTeachers}
                onChange={(e) => setForm({ ...form, totalTeachers: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">পাশের হার</label>
              <input
                type="text"
                value={form.passRate}
                onChange={(e) => setForm({ ...form, passRate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">জিপিএ-৫ সংখ্যা</label>
              <input
                type="text"
                value={form.gpa5Count}
                onChange={(e) => setForm({ ...form, gpa5Count: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ক্লাসরুম ও ল্যাব</label>
              <input
                type="text"
                value={form.totalClassrooms}
                onChange={(e) => setForm({ ...form, totalClassrooms: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">অর্জিত পুরষ্কার</label>
              <input
                type="text"
                value={form.totalAwards}
                onChange={(e) => setForm({ ...form, totalAwards: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
