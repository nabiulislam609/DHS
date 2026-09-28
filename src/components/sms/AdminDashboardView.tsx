import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiRequest } from '../../lib/apiClient';
import { Forbidden403 } from '../rbac/Forbidden403';
import {
  Users,
  UserCheck,
  GraduationCap,
  Activity,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Undo2,
  Clock,
  Database,
  Zap,
  Key,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user, setRoleQuick } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'students' | 'admissions' | 'cache' | 'overview'>('students');

  // RBAC Guard
  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Forbidden403
          requiredRoles={['ADMIN']}
          currentRole={user?.role}
          onSwitchRole={() => setRoleQuick('ADMIN')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Admin Console
              </span>
              <span className="text-xs text-slate-500 font-mono">RBAC: ADMIN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              স্কুল ম্যানেজমেন্ট সিস্টেম • অ্যাডমিন ড্যাশবোর্ড
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              ডিজিটাল ভর্তি অনুমোদন, পেজিনেটেড শিক্ষার্থী ডাটা টেবিল, সফট ডিলিট এবং রেডিজ ক্যাশিং মনিটর
            </p>
          </div>

          {/* Quick Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>শিক্ষার্থী তালিকা (Data Table)</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'admissions'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>ভর্তি অনুমোদন (Admissions)</span>
            </button>

            <button
              onClick={() => setActiveTab('cache')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cache'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>রেডিজ ক্যাশ মনিটর (Redis)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'students' && <StudentsDataTableSection />}
        {activeTab === 'admissions' && <AdmissionsWorkflowSection />}
        {activeTab === 'cache' && <RedisCacheMonitorSection />}
      </div>
    </div>
  );
};

/* =========================================================================
   1. SERVER-SIDE PAGINATED STUDENT DATA TABLE WITH SOFT DELETE
   ========================================================================= */
const StudentsDataTableSection: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ total: 0, page: 1, limit: 10, totalPages: 1, activeCount: 0, inactiveCount: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE'
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        limit: '6',
        search,
        class_name: selectedClass,
        status: selectedStatus,
      });

      const res = await apiRequest(`/api/v1/students?${query.toString()}`);
      setStudents(res.data || []);
      setMeta(res.meta || {});
    } catch (err: any) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, selectedClass, selectedStatus]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Soft Delete Toggle Handler
  const handleToggleSoftDelete = async (studentId: string, currentStatus: boolean, studentName: string) => {
    try {
      const res = await apiRequest(`/api/v1/students/${studentId}/toggle-active`, {
        method: 'PATCH',
      });
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
      fetchStudents();
    } catch (err: any) {
      console.error('Error toggling soft delete:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">মোট শিক্ষার্থী</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{meta.total}</h3>
          <span className="text-[11px] text-slate-400 font-mono">ডাটাবেজ রেকর্ড</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <p className="text-xs text-emerald-800 font-medium">সক্রিয় শিক্ষার্থী (ACTIVE)</p>
          <h3 className="text-2xl font-black text-emerald-950 mt-1">{meta.activeCount}</h3>
          <span className="text-[11px] text-emerald-700 font-medium">নিবন্ধিত ও সক্রিয়</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <p className="text-xs text-amber-800 font-medium">সফট ডিলিটেড (INACTIVE)</p>
          <h3 className="text-2xl font-black text-amber-950 mt-1">{meta.inactiveCount}</h3>
          <span className="text-[11px] text-amber-700 font-medium">রেকর্ড সংরক্ষিত</span>
        </div>

        <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 shadow-xs">
          <p className="text-xs text-purple-800 font-medium">সার্ভার পেজ</p>
          <h3 className="text-2xl font-black text-purple-950 mt-1">
            {meta.page} / {meta.totalPages || 1}
          </h3>
          <span className="text-[11px] text-purple-700 font-medium">প্রতি পেজে ৬ জন</span>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="নাম, Student ID, রোল বা মোবাইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">সকল শ্রেণি</option>
            <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
            <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
            <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
            <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
            <option value="১০ম শ্রেণি">১০ম শ্রেণি</option>
          </select>

          {/* Status Filter (Soft Delete Viewer) */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="ACTIVE">সক্রিয় (Active)</option>
            <option value="INACTIVE">সফট ডিলিটেড (Inactive)</option>
          </select>

          <button
            onClick={fetchStudents}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">নাম ও পিতা-মাতা</th>
                <th className="py-3 px-4">শ্রেণি ও শাখা</th>
                <th className="py-3 px-4">বিভাগ (Group)</th>
                <th className="py-3 px-4 text-center">রোল</th>
                <th className="py-3 px-4">মোবাইল</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস (Soft Delete)</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>সার্ভার থেকে শিক্ষার্থী তথ্য লোড হচ্ছে...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    কোন শিক্ষার্থী তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition ${
                      !student.is_active ? 'bg-red-50/30 text-slate-400' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {student.student_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-500">পিতা: {student.father_name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{student.class_name}</span>
                      <span className="text-[11px] text-slate-500 block">শাখা: {student.section}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {student.group || 'সাধারণ'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">
                      {student.roll_number}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {student.phone}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {student.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          নিষ্ক্রিয় (Soft Deleted)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {student.is_active ? (
                        <button
                          onClick={() => handleToggleSoftDelete(student.id, student.is_active, student.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                          title="সফট ডিলিট করুন (Toggle is_active: false)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>সফট ডিলিট</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleSoftDelete(student.id, student.is_active, student.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition cursor-pointer"
                          title="পুনরুদ্ধার করুন (Restore is_active: true)"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>রিস্টোর</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            মোট <span className="font-bold text-slate-900">{meta.total}</span> জনের মধ্যে দেখাচ্ছে পেজ{' '}
            <span className="font-bold text-slate-900">{meta.page}</span> (মোট{' '}
            <span className="font-bold text-slate-900">{meta.totalPages || 1}</span> পেজ)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="পূর্বের পেজ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-bold font-mono text-purple-700">
              {currentPage}
            </span>

            <button
              disabled={currentPage >= meta.totalPages || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="পরবর্তী পেজ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. DIGITAL ADMISSION APPROVAL WORKFLOW
   ========================================================================= */
const AdmissionsWorkflowSection: React.FC = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [approvedDetails, setApprovedDetails] = useState<any | null>(null);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/api/v1/admissions?status=${statusFilter}&limit=20`);
      setAdmissions(res.data || []);
    } catch (err: any) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const handleApprove = async (admissionId: string) => {
    try {
      const res = await apiRequest(`/api/v1/admissions/${admissionId}/approve`, {
        method: 'POST',
      });
      setApprovedDetails(res);
      fetchAdmissions();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (admissionId: string) => {
    const reason = prompt('প্রত্যাখ্যানের কারণ লিখুন:');
    if (reason === null) return;
    try {
      await apiRequest(`/api/v1/admissions/${admissionId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      fetchAdmissions();
    } catch (err: any) {
      alert(err.message || 'Reject failed');
    }
  };

  return (
    <div className="space-y-5">
      {/* Workflow Explanation Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold text-sm text-amber-950 mb-0.5">ডিজিটাল ভর্তি প্রক্রিয়াকরণ নীতি (Business Logic):</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li>পাবলিক ফর্ম থেকে সাবমিট হওয়া সকল আবেদন <b>PENDING</b> স্ট্যাটাসে থাকে।</li>
            <li>অ্যাডমিন <b>&lsquo;Approve&rsquo;</b> বাটনে ক্লিক করলে ব্যাকএন্ড ইউনিক <b>student_id</b> (যেমন: STU-2026-XXXX) তৈরি করবে।</li>
            <li>স্বয়ংক্রিয়ভাবে <b>User অ্যাকাউন্ট</b> তৈরি হবে ডিফল্ট পাসওয়ার্ড <code>student123</code> সহ।</li>
            <li>স্ট্যাটাস <b>ACTIVE</b> হবে এবং এসএমএস/নোটিফিকেশন ব্যাকগ্রাউন্ড কিউতে যুক্ত হবে।</li>
          </ul>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {st === 'PENDING' ? 'অপেক্ষমান (PENDING)' : st === 'APPROVED' ? 'অনুমোদিত (APPROVED)' : st === 'REJECTED' ? 'প্রত্যাখ্যাত' : 'সকল'}
            </button>
          ))}
        </div>

        <button
          onClick={fetchAdmissions}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Admissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
            <span>ভর্তি আবেদন লোড হচ্ছে...</span>
          </div>
        ) : admissions.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            কোন ভর্তি আবেদন পাওয়া যায়নি।
          </div>
        ) : (
          admissions.map((adm) => (
            <div
              key={adm.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {adm.id}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{adm.applicant_name}</h3>
                  <p className="text-xs text-slate-500">পিতা: {adm.father_name} • মাতা: {adm.mother_name}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    adm.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : adm.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {adm.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400">শ্রেণি:</span>{' '}
                  <span className="font-bold text-slate-800">{adm.applying_class}</span>
                </div>
                <div>
                  <span className="text-slate-400">গ্রুপ:</span>{' '}
                  <span className="font-bold text-slate-800">{adm.group || 'সাধারণ'}</span>
                </div>
                <div>
                  <span className="text-slate-400">মোবাইল:</span>{' '}
                  <span className="font-mono text-slate-800">{adm.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">পূর্বের GPA:</span>{' '}
                  <span className="font-bold text-slate-800">{adm.gpa_or_grade}</span>
                </div>
              </div>

              {adm.student_id && (
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span>অ্যাসাইনকৃত Student ID:</span>
                  <span className="font-mono font-bold">{adm.student_id}</span>
                </div>
              )}

              {/* Action Buttons for PENDING */}
              {adm.status === 'PENDING' && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleApprove(adm.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Create Account</span>
                  </button>

                  <button
                    onClick={() => handleReject(adm.id)}
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Success Modal upon Approval */}
      {approvedDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">ভর্তি সফলভাবে অনুমোদিত!</h3>
              <p className="text-xs text-slate-500">
                স্বয়ংক্রিয়ভাবে ইউনিক Student ID এবং ইউজার অ্যাকাউন্ট তৈরি হয়েছে।
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-slate-900">{approvedDetails.student?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">জেনারেটেড Student ID:</span>
                <span className="font-bold text-emerald-700">{approvedDetails.account?.student_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">লগইন ইউজারনেম:</span>
                <span className="font-bold text-purple-700">{approvedDetails.account?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ডিফল্ট পাসওয়ার্ড:</span>
                <span className="font-bold text-amber-700">{approvedDetails.account?.defaultPassword}</span>
              </div>
            </div>

            <button
              onClick={() => setApprovedDetails(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. REDIS HIGH-TRAFFIC CACHE MONITOR
   ========================================================================= */
const RedisCacheMonitorSection: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activeKeys, setActiveKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [flushMsg, setFlushMsg] = useState<string | null>(null);

  const fetchCacheStats = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/results/cache-stats');
      setStats(res.stats);
      setActiveKeys(res.activeKeys || []);
    } catch (err: any) {
      console.error('Error fetching cache stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheStats();
    const interval = setInterval(fetchCacheStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFlushCache = async () => {
    try {
      const res = await apiRequest('/api/v1/results/cache-clear', { method: 'POST' });
      setFlushMsg(res.message);
      setTimeout(() => setFlushMsg(null), 3000);
      fetchCacheStats();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* High-Traffic Explanation */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>High-Traffic Result Processing & Caching Layer</span>
          </div>
          <h2 className="text-xl font-black mt-1">রেডিজ-কম্প্যাটিবল ইন-মেমোরি ক্যাশ</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            রেজাল্ট ঘোষণার সময় হাজার হাজার শিক্ষার্থী একসাথে সার্চ করলে ডাটাবেজের ওপর চাপ কমাতে রেজাল্ট সরাসরি মেমোরি থেকে &lt;২ মিলি-সেকেন্ডে পরিবেশন করা হয়।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchCacheStats}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleFlushCache}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Flush Cache (খালি করুন)
          </button>
        </div>
      </div>

      {flushMsg && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{flushMsg}</span>
        </div>
      )}

      {/* Cache Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Cache Hit Ratio</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-emerald-600">{stats?.hitRatio || 0}%</h3>
          </div>
          <span className="text-[11px] text-slate-400">ক্যাশ থেকে পরিবেশিত ট্রাফিকের হার</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ক্যাশ হিট (Hits)</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.hits || 0}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">&lt; 2ms দ্রুত রেসপন্স</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">ক্যাশ মিস (Misses)</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.misses || 0}</h3>
          <span className="text-[11px] text-slate-400">ডাটাবেজ ফলব্যাক</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Active Cache Keys</p>
          <h3 className="text-3xl font-black text-purple-600 mt-1">{stats?.keysCount || 0}</h3>
          <span className="text-[11px] text-slate-400">TTL সহ মেমোরিতে সংরক্ষিত</span>
        </div>
      </div>

      {/* Active Keys Inspector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900">সক্রিয় ক্যাশ কি-সমূহ (Active Redis Keys):</h4>
          <span className="text-xs text-slate-500 font-mono">লাইভ পুলিং (প্রতি ৩ সেকেন্ড)</span>
        </div>

        {activeKeys.length === 0 ? (
          <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
            বর্তমানে কোনো ক্যাশ কি সংরক্ষিত নেই। শিক্ষক রেজাল্ট পাবলিশ করলে বা শিক্ষার্থী রেজাল্ট সার্চ করলে এখানে কি দেখতে পাবেন।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto font-mono text-xs">
            {activeKeys.map((item) => (
              <div key={item.key} className="py-2.5 flex items-center justify-between">
                <span className="text-purple-700 font-semibold">{item.key}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600">
                  TTL: {item.ttlRemainingSec !== null ? `${item.ttlRemainingSec}s` : 'Persistent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
