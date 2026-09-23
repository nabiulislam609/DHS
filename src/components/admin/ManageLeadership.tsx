import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Save, CheckCircle, User } from 'lucide-react';

export const ManageLeadership: React.FC = () => {
  const { leadership, updateLeadership } = useSchool();
  const [items, setItems] = useState([...leadership]);
  const [saved, setSaved] = useState(false);

  const handleSave = (id: string, updated: any) => {
    updateLeadership(id, updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">নেতৃত্বের বার্তা সম্পাদনা</h1>
        <p className="text-xs text-gray-500">প্রধান শিক্ষক ও সভাপতি মহোদয়ের বাণী ও পরিচয় তথ্য</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>বার্তা সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((leader, idx) => (
          <div key={leader.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center">
                {leader.initial}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{leader.role}</h3>
                <p className="text-xs text-gray-400">ব্যক্তিত্ব {idx + 1}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">নাম</label>
                <input
                  type="text"
                  value={leader.name}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].name = e.target.value;
                    setItems(next);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">পদবী / পরিচয়</label>
                <input
                  type="text"
                  value={leader.role}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].role = e.target.value;
                    setItems(next);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">শিক্ষাগত যোগ্যতা / পদমর্যাদা</label>
                <input
                  type="text"
                  value={leader.credentials}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].credentials = e.target.value;
                    setItems(next);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">বাণী / বক্তব্য</label>
                <textarea
                  rows={4}
                  value={leader.message}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].message = e.target.value;
                    setItems(next);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave(leader.id, leader)}
                className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
