import React, { useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import {
  Search,
  Zap,
  Database,
  CheckCircle,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  Sparkles,
  Award,
} from 'lucide-react';

export const HighTrafficResultView: React.FC = () => {
  const [className, setClassName] = useState('১০ম শ্রেণি');
  const [roll, setRoll] = useState('1');
  const [examName, setExamName] = useState('বার্ষিক পরীক্ষা');
  const [year, setYear] = useState('2026');

  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [queryMeta, setQueryMeta] = useState<{
    source: 'REDIS_CACHE' | 'DATABASE';
    latencyMs: number;
    cacheHit: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll || !className) return;

    setLoading(true);
    setError(null);
    setResultData(null);
    setQueryMeta(null);

    try {
      const query = new URLSearchParams({
        class_name: className,
        roll: roll,
        exam_name: examName,
        year: year,
      });

      const res = await apiRequest(`/api/v1/results/query?${query.toString()}`);
      setResultData(res.data);
      setQueryMeta({
        source: res.source,
        latencyMs: res.latencyMs,
        cacheHit: res.cacheHit,
      });
    } catch (err: any) {
      setError(err.message || 'Result not found');
      if (err.data) {
        setQueryMeta({
          source: err.data.source || 'DATABASE',
          latencyMs: err.data.latencyMs || 0,
          cacheHit: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>High-Traffic Redis Result Engine</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              অনলাইন পরীক্ষার ফলাফল অনুসন্ধান
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              রেডিজ মেমোরি ক্যাশ-ফার্স্ট আর্কিটেকচার • পিক-আওয়ারে সর্বোচ্চ ট্রাফিকে নিরবচ্ছিন্ন সেবা
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Search Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">শ্রেণি:</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
                <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">রোল নম্বর:</label>
              <input
                type="number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="যেমন: ১"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">পরীক্ষা:</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                <option value="অর্ধ-বার্ষিক পরীক্ষা">অর্ধ-বার্ষিক পরীক্ষা</option>
                <option value="প্রাক-নির্বাচনী">প্রাক-নির্বাচনী</option>
                <option value="নির্বাচনী পরীক্ষা">নির্বাচনী পরীক্ষা</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">শিক্ষাবর্ষ:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'অনুসন্ধান...' : 'ফলাফল দেখুন'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Rolls */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            <span className="font-semibold">টেস্ট রোল:</span>
            <button
              onClick={() => { setClassName('১০ম শ্রেণি'); setRoll('1'); }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-purple-700 font-mono cursor-pointer"
            >
              ১০ম শ্রেণি, রোল ১ (বিজ্ঞান)
            </button>
            <button
              onClick={() => { setClassName('১০ম শ্রেণি'); setRoll('2'); }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-purple-700 font-mono cursor-pointer"
            >
              ১০ম শ্রেণি, রোল ২ (বিজ্ঞান)
            </button>
          </div>
        </div>

        {/* Real-time Cache Latency & Source Indicator */}
        {queryMeta && (
          <div
            className={`p-4 rounded-2xl border transition-all animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
              queryMeta.cacheHit
                ? 'bg-emerald-950 text-white border-emerald-600 shadow-md'
                : 'bg-amber-950 text-white border-amber-600 shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  queryMeta.cacheHit ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {queryMeta.cacheHit ? <Zap className="w-5 h-5 fill-white" /> : <Database className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold uppercase tracking-wider text-sm">
                    {queryMeta.cacheHit ? '⚡ REDIS CACHE HIT' : '💾 DATABASE FALLBACK (CACHE MISS)'}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      queryMeta.cacheHit ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-700 text-amber-100'
                    }`}
                  >
                    X-Cache: {queryMeta.cacheHit ? 'HIT' : 'MISS'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {queryMeta.cacheHit
                    ? 'ডাটাবেজ স্পর্শ না করেই রেডিজ মেমোরি থেকে দ্রুততম সময়ে ফলাফল পরিবেশিত হয়েছে।'
                    : 'ডাটাবেজ কোয়েরি সম্পন্ন হয়েছে এবং ভবিষ্যতের ট্রাফিকের জন্য ফলাফল রেডিজে ক্যাশ করা হয়েছে।'}
                </p>
              </div>
            </div>

            <div className="font-mono text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
              <span>রেসপন্স টাইম: </span>
              <span className={`font-bold ${queryMeta.cacheHit ? 'text-emerald-400' : 'text-amber-400'}`}>
                {queryMeta.latencyMs} ms
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Sheet View */}
        {resultData && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-5 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                দাদরা উচ্চ বিদ্যালয়, জয়পুরহাট
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                অফিসিয়াল একাডেমিক মার্কশিট ও গ্রেড বিবরণী • {resultData.year}
              </p>
              <div className="inline-block mt-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-bold text-xs">
                {resultData.exam_name}
              </div>
            </div>

            {/* Student Meta Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400">শিক্ষার্থীর নাম:</span>
                <p className="font-bold text-slate-900 text-sm">{resultData.student_name}</p>
              </div>
              <div>
                <span className="text-slate-400">Student ID:</span>
                <p className="font-mono font-bold text-purple-700">{resultData.student_id}</p>
              </div>
              <div>
                <span className="text-slate-400">শ্রেণি ও শাখা:</span>
                <p className="font-bold text-slate-900">{resultData.class_name} ({resultData.section})</p>
              </div>
              <div>
                <span className="text-slate-400">রোল নম্বর:</span>
                <p className="font-mono font-bold text-slate-900 text-sm">{resultData.roll_number}</p>
              </div>
            </div>

            {/* GPA Summary Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Award className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-semibold">ফলাফলের অবস্থা</p>
                  <h3 className="text-2xl font-black">{resultData.status === 'PASSED' ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ (FAILED)'}</h3>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-right">
                <div>
                  <span className="text-xs text-emerald-200">মোট প্রাপ্ত নম্বর</span>
                  <p className="text-2xl font-black">{resultData.total_marks}</p>
                </div>
                <div>
                  <span className="text-xs text-emerald-200">গ্রেড পয়েন্ট (GPA)</span>
                  <p className="text-3xl font-black text-amber-300">{resultData.gpa}</p>
                </div>
                <div>
                  <span className="text-xs text-emerald-200">লেটার গ্রেড</span>
                  <p className="text-3xl font-black">{resultData.letter_grade}</p>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">বিষয়</th>
                    <th className="py-2.5 px-3 text-center">পূর্ণমান</th>
                    <th className="py-2.5 px-3 text-center">প্রাপ্ত নম্বর</th>
                    <th className="py-2.5 px-3 text-center">সর্বোচ্চ নম্বর</th>
                    <th className="py-2.5 px-3 text-center">গ্রেড</th>
                    <th className="py-2.5 px-3 text-center">পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultData.subjects.map((sub: any) => (
                    <tr key={sub.subject_name} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{sub.subject_name}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{sub.full_marks}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{sub.obtained_marks}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{sub.highest_marks}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          sub.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                          sub.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                          sub.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{sub.grade_point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print Button */}
            <div className="flex justify-end pt-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>মার্কশিট প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
