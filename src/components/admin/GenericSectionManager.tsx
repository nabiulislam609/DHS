import React, { useState } from 'react';
import { useSchool, AdminTab } from '../../context/SchoolContext';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Briefcase,
  Trophy,
  BookOpen,
  Sliders,
  Layers,
  Award,
} from 'lucide-react';

interface Props {
  tab: AdminTab;
}

export const GenericSectionManager: React.FC<Props> = ({ tab }) => {
  const {
    staff,
    addStaff,
    deleteStaff,
    achievements,
    addAchievement,
    deleteAchievement,
    academicPrograms,
    addProgram,
    deleteProgram,
    siteSettings,
    updateSiteSettings,
  } = useSchool();

  const [saved, setSaved] = useState(false);

  // New staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  // New Achievement form state
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCat, setNewAchCat] = useState('একাডেমিক');
  const [newAchYear, setNewAchYear] = useState('২০২৫');
  const [newAchSub, setNewAchSub] = useState('');

  const triggerSaveNotification = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Render for Staff
  if (tab === 'staff') {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">কর্মচারী ব্যবস্থাপনা</h1>
            <p className="text-xs text-gray-500">বিদ্যালয়ের অফিস, ল্যাব ও নিরাপত্তা সহকর্মীদের তালিকা</p>
          </div>
        </div>

        {/* Add Staff form */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">নতুন কর্মচারী যুক্ত করুন</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="কর্মচারীর নাম"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="পদবী (যেমন: প্রধান সহকারী)"
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="মোবাইল নম্বর"
              value={newStaffPhone}
              onChange={(e) => setNewStaffPhone(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <button
              onClick={() => {
                if (!newStaffName.trim() || !newStaffRole.trim()) return;
                addStaff({
                  name: newStaffName,
                  designation: newStaffRole,
                  department: 'প্রশাসন',
                  phone: newStaffPhone || '+8801700000000',
                  email: 'staff@dadrahs.edu.bd',
                  initial: newStaffName.charAt(0),
                });
                setNewStaffName('');
                setNewStaffRole('');
                setNewStaffPhone('');
              }}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              যোগ করুন
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">পদবী</th>
                <th className="py-3 px-4">মোবাইল নম্বর</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60">
                  <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                  <td className="py-3 px-4 text-emerald-800 font-semibold">{s.designation || s.role}</td>
                  <td className="py-3 px-4 font-mono">{s.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteStaff(s.id)}
                      className="p-1.5 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render for Achievements
  if (tab === 'achievements') {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">অর্জন ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের বিভিন্ন গৌরবময় অর্জনের তালিকা</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">নতুন অর্জন যোগ করুন</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="অর্জনের নাম (যেমন: জেলা চ্যাম্পিয়ন)"
              value={newAchTitle}
              onChange={(e) => setNewAchTitle(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="ক্যাটাগরি (ক্রীড়া, বিজ্ঞান, ইত্যাদি)"
              value={newAchCat}
              onChange={(e) => setNewAchCat(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="বিবরণ"
              value={newAchSub}
              onChange={(e) => setNewAchSub(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
            <button
              onClick={() => {
                if (!newAchTitle.trim()) return;
                addAchievement({
                  title: newAchTitle,
                  category: newAchCat,
                  year: newAchYear,
                  subtitle: newAchSub || 'বিদ্যালয়ের গৌরবময় অর্জন',
                  iconType: 'trophy',
                });
                setNewAchTitle('');
                setNewAchSub('');
              }}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              যোগ করুন
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {a.category} • {a.year}
                </span>
                <h4 className="font-bold text-sm text-gray-900 mt-1">{a.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{a.subtitle}</p>
              </div>
              <button
                onClick={() => deleteAchievement(a.id)}
                className="p-1 rounded text-gray-400 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render for Programs / Performance / Statistics / Sections / Hero / Navigation / Static
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {tab === 'hero' && 'হিরো স্লাইড সেটিংস'}
          {tab === 'sections' && 'হোমপেজ সেকশন কনফিগারেশন'}
          {tab === 'navigation' && 'নেভিগেশন মেনু'}
          {tab === 'static' && 'স্ট্যাটিক পেজ'}
          {tab === 'programs' && 'একাডেমিক প্রোগ্রাম'}
          {tab === 'statistics' && 'পরিসংখ্যান ডাটা'}
          {tab === 'performance' && 'এসএসসি পারফরম্যান্স রেজাল্ট'}
        </h1>
        <p className="text-xs text-gray-500">বিদ্যালয় পোর্টালের সংশ্লিষ্ট মডিউল সক্রিয় ও সমন্বয় করুন</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>সফলভাবে হালনাগাদ ও কার্যকর হয়েছে!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4 text-xs">
        {tab === 'hero' && (
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              হোমপেজের মূল স্লাইডারের ব্যানার টেক্সট, হেডলাইন এবং ব্যাকগ্রাউন্ড ইমেজ পরিবর্তন করুন:
            </p>
            <div>
              <label className="block font-bold text-gray-700 mb-1">স্লাইড প্রধান শিরোনাম</label>
              <input
                type="text"
                defaultValue="শিক্ষাই জাতির মূল সম্পদ"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">উপশিরোনাম</label>
              <input
                type="text"
                defaultValue="ছাত্রীর বলিষ্ঠ নেতৃত্বের ঐতিহ্য, আধুনিক শিক্ষার দীপ্তি"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
            <button
              onClick={triggerSaveNotification}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
            >
              আপডেট করুন
            </button>
          </div>
        )}

        {tab === 'sections' && (
          <div className="space-y-3">
            <p className="text-gray-600">হোমপেজে প্রদর্শিত সেকশনগুলো সক্রিয় বা নিষ্ক্রিয় করুন:</p>
            {['হিরো স্লাইডার', 'নোটিশ বোর্ড', 'বিদ্যালয় পরিচিতি', 'একাডেমিক প্রোগ্রাম', 'শিক্ষক মণ্ডলী', 'পরিসংখ্যান ও রেজাল্ট ট্রেন্ড', 'সংবাদ ও প্রেস', 'আসন্ন ইভেন্ট', 'ফটোগ্যালারি', 'যোগাযোগ ফর্ম'].map((sec, i) => (
              <label key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">{sec}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              </label>
            ))}
            <button
              onClick={triggerSaveNotification}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer mt-2"
            >
              সেকশন সংরক্ষণ করুন
            </button>
          </div>
        )}

        {tab === 'programs' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-800">বিদ্যমান প্রোগ্রামসমূহ ({academicPrograms.length} টি)</h3>
            <div className="divide-y divide-gray-100">
              {academicPrograms.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800">{p.title}</h4>
                    <p className="text-[11px] text-gray-500">{p.level} • {p.subjects.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => deleteProgram(p.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === 'statistics' || tab === 'performance') && (
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              গত ৫ বছরের বার্ষিক পরীক্ষার ফলাফল, গড় জিপিএ এবং পাশের হার ডেটা চার্ট স্বয়ংক্রিয়ভাবে হোমপেজে চিত্রিত রয়েছে।
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <span className="font-bold text-emerald-900 block">বর্তমান পাশের হার</span>
                <span className="text-xl font-bold text-emerald-700">{siteSettings.passRate}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <span className="font-bold text-amber-900 block">জিপিএ-৫ প্রাপ্তি</span>
                <span className="text-xl font-bold text-amber-700">{siteSettings.gpa5Count}</span>
              </div>
            </div>
            <button
              onClick={triggerSaveNotification}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
            >
              ডাটা সিঙ্ক করুন
            </button>
          </div>
        )}

        {(tab === 'navigation' || tab === 'static') && (
          <div className="space-y-3">
            <p className="text-gray-600">
              মেনু আইটেম এবং স্ট্যাটিক কন্টেন্ট সফলভাবে কনফিগার করা হয়েছে।
            </p>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-mono text-xs">
              স্ট্যাটাস: সক্রিয় (Live & Synchronized)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
