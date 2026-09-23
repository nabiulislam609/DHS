import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Edit2, Trash2, X, GraduationCap, Mail, Phone, BookOpen } from 'lucide-react';
import { Teacher } from '../../types';

export const ManageTeachers: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [form, setForm] = useState({
    name: '',
    designation: '',
    subject: '',
    email: '',
    phone: '',
    initial: '',
  });

  const openAddModal = () => {
    setEditingTeacher(null);
    setForm({
      name: '',
      designation: 'সহকারী শিক্ষক',
      subject: '',
      email: '',
      phone: '',
      initial: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setForm({
      name: t.name,
      designation: t.designation,
      subject: t.subject,
      email: t.email,
      phone: t.phone,
      initial: t.initial || t.name.charAt(0),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const initial = form.initial || form.name.trim().charAt(0);

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        ...form,
        initial,
      });
    } else {
      addTeacher({
        ...form,
        initial,
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">শিক্ষক ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের সকল শিক্ষকের তালিকা ও তথ্য নিয়ন্ত্রণ</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষক যোগ করুন</span>
        </button>
      </div>

      {/* Teachers Table / Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">শিক্ষক</th>
                <th className="py-3.5 px-4">পদবী</th>
                <th className="py-3.5 px-4">বিষয়</th>
                <th className="py-3.5 px-4">যোগাযোগ</th>
                <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                        {t.initial || t.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{t.name}</span>
                        <span className="text-[10px] text-gray-400">ID: {t.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{t.designation}</td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{t.subject}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>{t.email}</div>
                    <div className="text-gray-400 text-[11px]">{t.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${t.name}" কে মুছে ফেলতে চান?`)) {
                            deleteTeacher(t.id);
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingTeacher ? 'শিক্ষকের তথ্য পরিবর্তন করুন' : 'নতুন শিক্ষক যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">শিক্ষকের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ আবদুল করিম"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">পদবী *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রধান শিক্ষক, সিনিয়র শিক্ষক"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">পাঠদানের বিষয় *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গণিত, বাংলা, পদার্থবিজ্ঞান"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ইমেইল</label>
                  <input
                    type="email"
                    placeholder="email@dadrahs.edu.bd"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    placeholder="+88017..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">অবতার আদ্যক্ষর (Initial)</label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="যেমন: ম, শ, র"
                  value={form.initial}
                  onChange={(e) => setForm({ ...form, initial: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
