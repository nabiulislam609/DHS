import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Edit2, Trash2, X, Users, Award } from 'lucide-react';
import { Student } from '../../types';

export const ManageStudents: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStu, setEditingStu] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: '',
    roll: '',
    class: '১০ম শ্রেণি',
    section: 'A',
    group: 'বিজ্ঞান',
    guardianPhone: '',
  });

  const openAddModal = () => {
    setEditingStu(null);
    setForm({
      name: '',
      roll: `${students.length + 1}`,
      class: '১০ম শ্রেণি',
      section: 'A',
      group: 'বিজ্ঞান',
      guardianPhone: '+8801700000000',
    });
    setModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStu(s);
    setForm({
      name: s.name,
      roll: s.roll,
      class: s.class || s.studentClass,
      section: s.section,
      group: s.group || 'বিজ্ঞান',
      guardianPhone: s.guardianPhone || s.phone || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const studentPayload: Omit<Student, 'id'> = {
      name: form.name,
      roll: form.roll,
      studentClass: form.class,
      section: form.section,
      guardianName: 'অভিভাবক',
      phone: form.guardianPhone || '+8801700000000',
      class: form.class,
      group: form.group,
      guardianPhone: form.guardianPhone,
    };

    if (editingStu) {
      updateStudent(editingStu.id, studentPayload);
    } else {
      addStudent(studentPayload);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">শিক্ষার্থী ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের রেজিস্টার্ড শিক্ষার্থীদের ডাটাবেস</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষার্থী যুক্ত করুন</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">রোল</th>
                <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3.5 px-4">শ্রেণি ও শাখা</th>
                <th className="py-3.5 px-4">বিভাগ</th>
                <th className="py-3.5 px-4">অভিভাবক ফোন</th>
                <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">{s.roll}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      {s.class || s.studentClass} ({s.section})
                    </span>
                  </td>
                  <td className="py-3 px-4">{s.group || '-'}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{s.guardianPhone || s.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-emerald-700 transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${s.name}" এর তথ্য মুছে ফেলতে চান?`)) {
                            deleteStudent(s.id);
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
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
              {editingStu ? 'শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী যুক্ত করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">শিক্ষার্থীর নাম *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">রোল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={form.roll}
                    onChange={(e) => setForm({ ...form, roll: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">শ্রেণি *</label>
                  <select
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                    <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                    <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                    <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                    <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">শাখা</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">বিভাগ</label>
                  <input
                    type="text"
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">অভিভাবকের মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={form.guardianPhone}
                  onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
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
