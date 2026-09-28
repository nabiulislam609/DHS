import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiRequest } from '../../lib/apiClient';
import { Forbidden403 } from '../rbac/Forbidden403';
import {
  UserCheck,
  Zap,
  CheckCircle,
  Calculator,
  Save,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TeacherMarksView: React.FC = () => {
  const { user, setRoleQuick } = useAuthStore();

  // Role check: Only TEACHER or ADMIN can enter marks
  if (user?.role !== 'TEACHER' && user?.role !== 'ADMIN') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Forbidden403
          requiredRoles={['TEACHER', 'ADMIN']}
          currentRole={user?.role}
          onSwitchRole={() => setRoleQuick('TEACHER')}
        />
      </div>
    );
  }

  // Teacher input form states
  const [className, setClassName] = useState('১০ম শ্রেণি');
  const [section, setSection] = useState('ক (পদ্মা)');
  const [group, setGroup] = useState('বিজ্ঞান');
  const [examName, setExamName] = useState<'অর্ধ-বার্ষিক পরীক্ষা' | 'বার্ষিক পরীক্ষা' | 'প্রাক-নির্বাচনী' | 'নির্বাচনী পরীক্ষা'>('বার্ষিক পরীক্ষা');
  const [year, setYear] = useState(2026);
  const [studentId, setStudentId] = useState('STU-2026-1001');
  const [studentName, setStudentName] = useState('তানভীর আহমেদ');
  const [rollNumber, setRollNumber] = useState(1);

  // Subject marks
  const [subjects, setSubjects] = useState([
    { subject_name: 'বাংলা ১ম পত্র', full_marks: 100, obtained_marks: 85 },
    { subject_name: 'বাংলা ২য় পত্র', full_marks: 100, obtained_marks: 80 },
    { subject_name: 'ইংরেজি ১ম পত্র', full_marks: 100, obtained_marks: 82 },
    { subject_name: 'ইংরেজি ২য় পত্র', full_marks: 100, obtained_marks: 78 },
    { subject_name: 'সাধারণ গণিত', full_marks: 100, obtained_marks: 95 },
    { subject_name: 'পদার্থবিজ্ঞান', full_marks: 100, obtained_marks: 90 },
    { subject_name: 'রসায়ন', full_marks: 100, obtained_marks: 88 },
    { subject_name: 'জীববিজ্ঞান', full_marks: 100, obtained_marks: 84 },
    { subject_name: 'উচ্চতর গণিত (৪র্থ)', full_marks: 100, obtained_marks: 92 },
  ]);

  const [saving, setSaving] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMarkChange = (index: number, value: string) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setSubjects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], obtained_marks: num };
      return copy;
    });
  };

  // Live calculation of GPA
  let totalMarks = 0;
  let totalPoints = 0;
  let hasFailed = false;

  subjects.forEach((s) => {
    totalMarks += s.obtained_marks;
    if (s.obtained_marks >= 80) totalPoints += 5;
    else if (s.obtained_marks >= 70) totalPoints += 4;
    else if (s.obtained_marks >= 60) totalPoints += 3.5;
    else if (s.obtained_marks >= 50) totalPoints += 3.0;
    else if (s.obtained_marks >= 40) totalPoints += 2.0;
    else if (s.obtained_marks >= 33) totalPoints += 1.0;
    else { totalPoints += 0; hasFailed = true; }
  });

  const calculatedGpa = hasFailed ? 0.0 : Number((totalPoints / subjects.length).toFixed(2));

  // Submit and Warm Redis Cache
  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const payload = {
        student_id: studentId,
        student_name: studentName,
        class_name: className,
        roll_number: rollNumber,
        section,
        group,
        exam_name: examName,
        year,
        subjects,
      };

      const res = await apiRequest('/api/v1/results/publish', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessInfo(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to publish marks');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Teacher Module
              </span>
              <span className="text-xs text-slate-500 font-mono">RBAC: TEACHER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              নম্বর এন্ট্রি ও রেজাল্ট প্রসেসিং
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              শ্রেণিভিত্তিক নম্বর প্রদান এবং সরাসরি হাই-স্পিড রেডিজ ক্যাশে লাইভ পাবলিশ
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-blue-950">{user?.name}</p>
              <p className="text-blue-700 font-mono text-[11px]">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner: High traffic caching note */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
          <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <p className="font-bold text-sm text-emerald-950 mb-0.5">স্বয়ংক্রিয় রেডিজ ক্যাশ ওয়ার্মিং (Proactive Cache Invalidation & Warming):</p>
            <p>
              আপনি যখন এখানে &lsquo;পাবলিশ করুন&rsquo; বাটনে ক্লিক করবেন, ফলাফল ডাটাবেজে সেভ হওয়ার সাথে সাথেই ব্যাকএন্ডে <b>Redis key</b> তৈরি হয়ে ক্যাশ হয়ে যাবে। পরবর্তীতে শিক্ষার্থী রেজাল্ট পেজে সার্চ দিলে মাত্র <b>১-২ মিলিসেকেন্ডে</b> ক্যাশ থেকে ফলাফল প্রদর্শিত হবে।
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {successInfo && (
          <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-lg space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>{successInfo.message}</span>
            </div>
            <div className="font-mono text-xs bg-emerald-700/60 p-3 rounded-xl border border-emerald-500">
              <p>ক্যাশ কী: <span className="text-amber-200">{successInfo.cacheKey}</span></p>
              <p>শিক্ষার্থী: {successInfo.result?.student_name} (রোল: {successInfo.result?.roll_number})</p>
              <p>মোট নম্বর: {successInfo.result?.total_marks} | GPA: {successInfo.result?.gpa} ({successInfo.result?.letter_grade})</p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handlePublishResult} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>শ্রেণি, পরীক্ষা ও শিক্ষার্থীর তথ্য</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">শ্রেণি নির্বাচন:</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
                <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">শাখা:</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">বিভাগ (Group):</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="বিজ্ঞান">বিজ্ঞান</option>
                <option value="মানবিক">মানবিক</option>
                <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
                <option value="সাধারণ">সাধারণ</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">পরীক্ষার নাম:</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                <option value="অর্ধ-বার্ষিক পরীক্ষা">অর্ধ-বার্ষিক পরীক্ষা</option>
                <option value="প্রাক-নির্বাচনী">প্রাক-নির্বাচনী</option>
                <option value="নির্বাচনী পরীক্ষা">নির্বাচনী পরীক্ষা</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Student ID:</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">শিক্ষার্থীর নাম:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">রোল নম্বর:</label>
              <input
                type="number"
                value={rollNumber}
                onChange={(e) => setRollNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">শিক্ষাবর্ষ:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
              />
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>বিষয়ভিত্তিক প্রাপ্ত নম্বর ইনপুট:</span>
              <span className="text-xs text-slate-500 font-normal">পূর্ণমান: ১০০</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map((sub, idx) => (
                <div
                  key={sub.subject_name}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-slate-800">{sub.subject_name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={sub.obtained_marks}
                      onChange={(e) => handleMarkChange(idx, e.target.value)}
                      className="w-16 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold text-right text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-[11px] text-slate-400">/ 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Calculated Scorecard */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-slate-400">লাইভ জিপিএ ও মোট নম্বর:</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-black text-amber-400">GPA {calculatedGpa}</span>
                  <span className="text-slate-400">| মোট নম্বর: {totalMarks}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{saving ? 'পাবলিশ হচ্ছে...' : 'পাবলিশ ও রেডিজে ক্যাশ করুন (Publish & Cache)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
