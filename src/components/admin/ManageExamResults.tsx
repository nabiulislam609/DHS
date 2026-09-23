import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Bookmark,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle,
  Eye,
  Award,
  BookOpen,
  PlusCircle,
} from 'lucide-react';
import { ExamResult, SubjectMark } from '../../types';

export const AVAILABLE_CLASSES = [
  'Class 10 (১০ম শ্রেণি - বিজ্ঞান)',
  'Class 10 (১০ম শ্রেণি - মানবিক)',
  'Class 10 (১০ম শ্রেণি - ব্যবসায় শিক্ষা)',
  'Class 9 (৯ম শ্রেণি - বিজ্ঞান)',
  'Class 9 (৯ম শ্রেণি - মানবিক)',
  'Class 9 (৯ম শ্রেণি - ব্যবসায় শিক্ষা)',
  'Class 8 (৮ম শ্রেণি)',
  'Class 7 (৭ম শ্রেণি)',
  'Class 6 (৬ষ্ঠ শ্রেণি)',
  'Class 10',
  'Class 9',
  'Class 8',
  'Class 7',
  'Class 6',
];

export const AVAILABLE_EXAM_TERMS = [
  'Pre-Test Examination (2026)',
  'Test Examination / নির্বাচনী পরীক্ষা (2026)',
  '1st Term Examination / ১ম সাময়িক পরীক্ষা (2026)',
  '2nd Term Examination / ২য় সাময়িক পরীক্ষা (2026)',
  'Annual Examination / বার্ষিক পরীক্ষা (2026)',
  'Half-Yearly Examination / অর্ধবার্ষিক পরীক্ষা (2026)',
  'Model Test Examination (2026)',
  'Monthly Class Test / মাসিক পরীক্ষা (2026)',
  'Special Assessment / বিশেষ মূল্যায়ন (2026)',
];

export const PRESET_SUBJECTS = [
  'Bangla (1st & 2nd)',
  'English (1st & 2nd)',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Higher Mathematics',
  'Information & Communication Technology (ICT)',
  'Bangladesh & Global Studies',
  'Islam & Moral Education',
  'Hindu Religion & Moral Education',
  'General Science',
  'Accounting',
  'Business Entrepreneurship',
  'Finance & Banking',
  'Agriculture Studies',
  'Home Science',
  'Physical Education & Health',
  'Art & Craft',
  'Career Education',
];

export const ManageExamResults: React.FC = () => {
  const { examResults, addExamResult, deleteExamResult, updateExamResult } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);

  // Form State
  const [form, setForm] = useState({
    studentName: '',
    studentId: '',
    roll: '',
    studentClass: AVAILABLE_CLASSES[0],
    section: 'A',
    examTerm: AVAILABLE_EXAM_TERMS[0],
    customTerm: '',
    isCustomTerm: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT',
  });

  const [subjects, setSubjects] = useState<SubjectMark[]>([
    { subject: 'Bangla (1st & 2nd)', marks: 160, gradePoint: 5.0, grade: 'A+' },
    { subject: 'English (1st & 2nd)', marks: 155, gradePoint: 4.0, grade: 'A' },
    { subject: 'Mathematics', marks: 90, gradePoint: 5.0, grade: 'A+' },
    { subject: 'Physics', marks: 85, gradePoint: 5.0, grade: 'A+' },
    { subject: 'Chemistry', marks: 82, gradePoint: 5.0, grade: 'A+' },
    { subject: 'Biology', marks: 80, gradePoint: 5.0, grade: 'A+' },
  ]);

  // New Subject creation state
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectMarks, setNewSubjectMarks] = useState(80);
  const [showAddSubjectRow, setShowAddSubjectRow] = useState(false);

  const calculateGrade = (marks: number) => {
    if (marks >= 80) return { gp: 5.0, grade: 'A+' };
    if (marks >= 70) return { gp: 4.0, grade: 'A' };
    if (marks >= 60) return { gp: 3.5, grade: 'A-' };
    if (marks >= 50) return { gp: 3.0, grade: 'B' };
    if (marks >= 40) return { gp: 2.0, grade: 'C' };
    if (marks >= 33) return { gp: 1.0, grade: 'D' };
    return { gp: 0.0, grade: 'F' };
  };

  const handleSubjectMarkChange = (index: number, newMarks: number) => {
    const next = [...subjects];
    const { gp, grade } = calculateGrade(newMarks);
    next[index] = {
      ...next[index],
      marks: newMarks,
      gradePoint: gp,
      grade,
    };
    setSubjects(next);
  };

  const handleSubjectNameChange = (index: number, newName: string) => {
    const next = [...subjects];
    next[index] = {
      ...next[index],
      subject: newName,
    };
    setSubjects(next);
  };

  const removeSubject = (index: number) => {
    if (subjects.length <= 1) {
      alert('কমপক্ষে একটি বিষয় রাখা আবশ্যক।');
      return;
    }
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNewSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;

    const { gp, grade } = calculateGrade(newSubjectMarks);
    setSubjects((prev) => [
      ...prev,
      {
        subject: name,
        marks: newSubjectMarks,
        gradePoint: gp,
        grade,
      },
    ]);
    setNewSubjectName('');
    setNewSubjectMarks(80);
    setShowAddSubjectRow(false);
  };

  const openAddModal = () => {
    const nextNum = 1000 + examResults.length + 1;
    setForm({
      studentName: '',
      studentId: `DHS-2026-${nextNum}`,
      roll: `${examResults.length + 1}`,
      studentClass: AVAILABLE_CLASSES[0],
      section: 'A',
      examTerm: AVAILABLE_EXAM_TERMS[0],
      customTerm: '',
      isCustomTerm: false,
      status: 'PUBLISHED',
    });
    setSubjects([
      { subject: 'Bangla (1st & 2nd)', marks: 170, gradePoint: 5.0, grade: 'A+' },
      { subject: 'English (1st & 2nd)', marks: 160, gradePoint: 5.0, grade: 'A+' },
      { subject: 'Mathematics', marks: 95, gradePoint: 5.0, grade: 'A+' },
      { subject: 'Physics', marks: 88, gradePoint: 5.0, grade: 'A+' },
      { subject: 'Chemistry', marks: 86, gradePoint: 5.0, grade: 'A+' },
      { subject: 'Biology', marks: 82, gradePoint: 5.0, grade: 'A+' },
    ]);
    setShowAddSubjectRow(false);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.roll.trim() || !form.studentClass.trim()) {
      alert('শিক্ষার্থীর নাম, রোল এবং শ্রেণি পূরণ করা বাধ্যতামূলক।');
      return;
    }

    const termToUse = form.isCustomTerm
      ? form.customTerm.trim() || form.examTerm
      : form.examTerm;

    const totalMarks = subjects.reduce((sum, s) => sum + Number(s.marks || 0), 0);
    const hasFailed = subjects.some((s) => s.grade === 'F');
    const avgGp = hasFailed
      ? 0.0
      : Number((subjects.reduce((sum, s) => sum + s.gradePoint, 0) / subjects.length).toFixed(2));

    let overallGrade = 'F';
    if (avgGp >= 5.0) overallGrade = 'A+';
    else if (avgGp >= 4.0) overallGrade = 'A';
    else if (avgGp >= 3.5) overallGrade = 'A-';
    else if (avgGp >= 3.0) overallGrade = 'B';
    else if (avgGp >= 2.0) overallGrade = 'C';
    else if (avgGp >= 1.0) overallGrade = 'D';

    addExamResult({
      studentName: form.studentName.trim(),
      studentId: form.studentId.trim() || `DHS-2026-${Date.now()}`,
      roll: form.roll.trim(),
      studentClass: form.studentClass,
      section: form.section,
      examTerm: termToUse,
      totalMarks,
      gpa: avgGp,
      grade: overallGrade,
      status: form.status,
      subjects,
      publishedDate: new Date().toISOString().split('T')[0],
    });

    setModalOpen(false);
  };

  const filteredResults = examResults.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.studentId.toLowerCase().includes(q) ||
      r.roll.includes(q) ||
      r.studentClass.toLowerCase().includes(q) ||
      r.examTerm.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header - Exactly matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-emerald-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Examination Results & Marks Register
            </h1>
          </div>
          <p className="text-xs text-gray-500">
            Input student subject scores, compute GPA, and make results instantly verifiable on the public portal.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student Result</span>
        </button>
      </div>

      {/* Search Bar - Exactly matching Image 2 */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-emerald-600 shadow-2xs transition"
        />
      </div>

      {/* Results Table - Exactly matching Image 2 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Class & Roll</th>
                <th className="py-3.5 px-4">Examination</th>
                <th className="py-3.5 px-4">Total Marks</th>
                <th className="py-3.5 px-4">GPA</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    কোনো পরীক্ষার ফলাফল পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-gray-900 block">{result.studentName}</span>
                        <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                          {result.studentId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      {result.studentClass} (Roll: {result.roll})
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">{result.examTerm}</td>

                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono text-sm">
                      {result.totalMarks}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono text-sm">
                      {result.gpa.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-bold text-[11px] ${
                          result.grade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : result.grade === 'A'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {result.grade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800">
                        {result.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingResult(result)}
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer"
                          title="মার্কশীট দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${result.studentName}'s result?`)) {
                              deleteExamResult(result.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Result Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Add Student Examination Result</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sadia Jahan"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHS-2026-1001"
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1"
                    value={form.roll}
                    onChange={(e) => setForm({ ...form, roll: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Class * <span className="text-emerald-700 font-semibold">(বাধ্যতামূলক শ্রেণি নির্বাচন করুন)</span>
                  </label>
                  <select
                    required
                    value={form.studentClass}
                    onChange={(e) => setForm({ ...form, studentClass: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-800"
                  >
                    <option value="" disabled>-- শ্রেণি নির্বাচন করুন --</option>
                    {AVAILABLE_CLASSES.map((cls, idx) => (
                      <option key={idx} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Examination Term * <span className="text-emerald-700 font-semibold">(টার্ম নির্বাচন করুন)</span>
                  </label>
                  <select
                    required
                    value={form.isCustomTerm ? '__custom__' : form.examTerm}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setForm({ ...form, isCustomTerm: true });
                      } else {
                        setForm({ ...form, isCustomTerm: false, examTerm: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-800"
                  >
                    {AVAILABLE_EXAM_TERMS.map((term, idx) => (
                      <option key={idx} value={term}>
                        {term}
                      </option>
                    ))}
                    <option value="__custom__">➕ অন্যান্য / Custom Term লিখুন...</option>
                  </select>

                  {form.isCustomTerm && (
                    <input
                      type="text"
                      required
                      placeholder="কাস্টম পরীক্ষার নাম লিখুন..."
                      value={form.customTerm}
                      onChange={(e) => setForm({ ...form, customTerm: e.target.value })}
                      className="mt-1.5 w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="PUBLISHED">PUBLISHED (প্রকাশিত)</option>
                    <option value="DRAFT">DRAFT (খসড়া)</option>
                  </select>
                </div>
              </div>

              {/* Subject Marks Inputs with Add and Delete */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-gray-800 text-xs">
                      Subject Marks Breakdown ({subjects.length} Subjects)
                    </label>
                    <span className="text-[11px] text-gray-400">
                      যে কোনো বিষয় ডিলিট করতে পারেন অথবা নতুন বিষয় যুক্ত করতে পারেন
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddSubjectRow((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ নতুন বিষয় যুক্ত করুন</span>
                  </button>
                </div>

                {/* Inline Add Subject Form */}
                {showAddSubjectRow && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">নতুন বিষয় ও প্রাপ্ত নম্বর</span>
                      <button
                        type="button"
                        onClick={() => setShowAddSubjectRow(false)}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-7">
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">বিষয়ের নাম নির্বাচন বা লিখুন</label>
                        <div className="space-y-1">
                          <select
                            value={PRESET_SUBJECTS.includes(newSubjectName) ? newSubjectName : '__custom__'}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setNewSubjectName('');
                              } else {
                                setNewSubjectName(e.target.value);
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                          >
                            <option value="">-- তালিকা থেকে বিষয় বাছুন --</option>
                            {PRESET_SUBJECTS.map((s, idx) => (
                              <option key={idx} value={s}>
                                {s}
                              </option>
                            ))}
                            <option value="__custom__">অন্যান্য (নিজে টাইপ করুন)</option>
                          </select>
                          {(!PRESET_SUBJECTS.includes(newSubjectName) || newSubjectName === '') && (
                            <input
                              type="text"
                              placeholder="বিষয়ের নাম লিখুন (যেমন: চারু ও কারুকলা)"
                              value={newSubjectName}
                              onChange={(e) => setNewSubjectName(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                            />
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">নম্বর (০-২০০)</label>
                        <input
                          type="number"
                          min={0}
                          max={200}
                          value={newSubjectMarks}
                          onChange={(e) => setNewSubjectMarks(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-4 sm:pt-3">
                        <button
                          type="button"
                          onClick={handleAddNewSubject}
                          disabled={!newSubjectName.trim()}
                          className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          যোগ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject rows with Delete Action */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/80 p-2 rounded-xl border border-gray-100 transition group"
                    >
                      <span className="w-5 text-gray-400 font-mono text-[11px] text-center">{idx + 1}.</span>
                      
                      <input
                        type="text"
                        value={sub.subject}
                        onChange={(e) => handleSubjectNameChange(idx, e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                        placeholder="Subject name"
                      />

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400">নম্বর:</span>
                          <input
                            type="number"
                            min={0}
                            max={200}
                            value={sub.marks}
                            onChange={(e) => handleSubjectMarkChange(idx, Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                            placeholder="Marks"
                          />
                        </div>

                        <span className="w-10 text-center font-bold text-emerald-800 text-xs">
                          {sub.grade}
                        </span>
                        <span className="w-12 text-center text-gray-500 font-mono text-[11px]">
                          {sub.gradePoint.toFixed(1)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeSubject(idx)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                          title="এই বিষয় ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save & Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick View Marksheet Modal */}
      {viewingResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 space-y-4">
            <button
              onClick={() => setViewingResult(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                {viewingResult.status}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{viewingResult.studentName}</h3>
              <p className="text-xs text-gray-500 font-mono">
                {viewingResult.studentId} • Roll: {viewingResult.roll} • {viewingResult.examTerm}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-emerald-50/60 p-3 rounded-xl text-center text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">GPA</span>
                <span className="text-xl font-bold text-emerald-800 font-mono">
                  {viewingResult.gpa.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Grade</span>
                <span className="text-xl font-bold text-emerald-800">{viewingResult.grade}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Total Marks</span>
                <span className="text-xl font-bold text-emerald-800 font-mono">
                  {viewingResult.totalMarks}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
              {viewingResult.subjects.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-700">{s.subject}</span>
                  <div className="flex gap-2">
                    <span className="font-mono font-bold text-gray-900">{s.marks}</span>
                    <span className="font-bold text-emerald-700 font-mono">({s.grade})</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingResult(null)}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
