import React, { useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import {
  GraduationCap,
  CheckCircle,
  FileCheck,
  Send,
  AlertCircle,
  Clock,
  Printer,
  Copy,
  User,
  Phone,
  Mail,
  School,
} from 'lucide-react';

export const PublicAdmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applying_class: '৬ষ্ঠ শ্রেণি',
    group: 'সাধারণ',
    section: 'ক',
    additional_subject: '',
    father_name: '',
    mother_name: '',
    date_of_birth: '',
    gender: 'ছাত্র' as 'ছাত্র' | 'ছাত্রী',
    phone: '',
    email: '',
    previous_school: '',
    gpa_or_grade: '',
    present_address: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest('/api/v1/admissions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSubmittedData(res);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const isClass910 = formData.applying_class === '৯ম শ্রেণি' || formData.applying_class === '১০ম শ্রেণি';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Digital Admission Portal
            </span>
            <span className="text-xs text-slate-500">শিক্ষাবর্ষ: ২০২৬</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            দাদরা উচ্চ বিদ্যালয় • অনলাইন ভর্তি আবেদন
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            শিক্ষার্থী ও অভিভাবকদের জন্য উন্মুক্ত ডিজিটাল ভর্তি আবেদন ফরম
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {submittedData ? (
          /* Submission Receipt */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full uppercase tracking-wider border border-amber-200">
                স্ট্যাটাস: {submittedData.admission?.status} (অপেক্ষমান)
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনার আবেদনটি এখন অ্যাডমিন মূল্যায়নের জন্য <b>PENDING</b> অবস্থায় রয়েছে। অ্যাডমিন অনুমোদন করলে স্বয়ংক্রিয়ভাবে Student ID ও ইউজার অ্যাকাউন্ট সক্রিয় হবে।
              </p>
            </div>

            {/* Tracking ID Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 text-xs">আবেদন ট্র্যাকিং নম্বর (Application ID):</p>
                <h3 className="text-2xl font-mono font-black text-amber-400">{submittedData.tracking_id}</h3>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(submittedData.tracking_id);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'কপি হয়েছে!' : 'আইডি কপি করুন'}</span>
              </button>
            </div>

            {/* Application Overview */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">আবেদনপত্রের মূল বিবরণ:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-400">নাম:</span> <span className="font-bold">{submittedData.admission?.applicant_name}</span></div>
                <div><span className="text-slate-400">শ্রেণি:</span> <span className="font-bold">{submittedData.admission?.applying_class}</span></div>
                <div><span className="text-slate-400">পিতা:</span> <span>{submittedData.admission?.father_name}</span></div>
                <div><span className="text-slate-400">মোবাইল:</span> <span className="font-mono">{submittedData.admission?.phone}</span></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setSubmittedData(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                নতুন আবেদন করুন
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>আবেদনপত্র প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <span>ভর্তি ফরম পূরণ করুন</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">* চিহ্নিত ঘরগুলো আবশ্যক</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">লিঙ্গ *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                >
                  <option value="ছাত্র">ছাত্র</option>
                  <option value="ছাত্রী">ছাত্রী</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">আবেদনের শ্রেণি *</label>
                <select
                  value={formData.applying_class}
                  onChange={(e) => setFormData({ ...formData, applying_class: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                >
                  <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                  <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                  <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                  <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                  <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">বিভাগ (Group)</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                >
                  <option value="সাধারণ">সাধারণ</option>
                  <option value="বিজ্ঞান">বিজ্ঞান</option>
                  <option value="মানবিক">মানবিক</option>
                  <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">শাখা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="যেমন: ক / খ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">পিতার নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মাতার নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">জন্ম তারিখ *</label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ইমেইল (যদি থাকে)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">পূর্বের বিদ্যালয়</label>
                <input
                  type="text"
                  value={formData.previous_school}
                  onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                  placeholder="পূর্ববর্তী প্রতিষ্ঠানের নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">পূর্বের GPA / গ্রেড</label>
                <input
                  type="text"
                  value={formData.gpa_or_grade}
                  onChange={(e) => setFormData({ ...formData, gpa_or_grade: e.target.value })}
                  placeholder="যেমন: 5.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-bold mb-1">বর্তমান ঠিকানা</label>
                <input
                  type="text"
                  value={formData.present_address}
                  onChange={(e) => setFormData({ ...formData, present_address: e.target.value })}
                  placeholder="গ্রাম, ডাকঘর, থানা, জেলা"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'জমা দেওয়া হচ্ছে...' : 'আবেদনপত্র জমা দিন (Submit Application)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
