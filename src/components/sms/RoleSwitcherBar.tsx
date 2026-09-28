import React, { useState } from 'react';
import { useAuthStore, UserRole } from '../../store/useAuthStore';
import { Shield, GraduationCap, UserCheck, KeyRound, CheckCircle2, ChevronDown, Activity, Sparkles } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentModule: 'portal' | 'admin' | 'teacher' | 'results' | 'admission';
  onSelectModule: (module: 'portal' | 'admin' | 'teacher' | 'results' | 'admission') => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentModule,
  onSelectModule,
}) => {
  const { user, token, setRoleQuick } = useAuthStore();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    setSwitching(true);
    await setRoleQuick(role);
    setSwitching(false);

    // Auto navigate to corresponding workspace
    if (role === 'ADMIN') onSelectModule('admin');
    else if (role === 'TEACHER') onSelectModule('teacher');
    else if (role === 'STUDENT') onSelectModule('results');
  };

  const currentRole = user?.role || 'GUEST';

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white text-xs sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Brand & RBAC Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[13px]">SMS Decoupled API</span>
            </div>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
              <span>RBAC Role:</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                    : currentRole === 'TEACHER'
                    ? 'bg-blue-900/80 text-blue-300 border border-blue-700'
                    : currentRole === 'STUDENT'
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {currentRole}
              </span>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-0.5" aria-label="Modules">
            <button
              onClick={() => onSelectModule('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                currentModule === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>এডমিন প্যানেল</span>
            </button>

            <button
              onClick={() => onSelectModule('teacher')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                currentModule === 'teacher'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>শিক্ষক (Marks Entry)</span>
            </button>

            <button
              onClick={() => onSelectModule('results')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                currentModule === 'results'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>রেজাল্ট (Redis Cache)</span>
            </button>

            <button
              onClick={() => onSelectModule('admission')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                currentModule === 'admission'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ডিজিটাল ভর্তি</span>
            </button>

            <button
              onClick={() => onSelectModule('portal')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                currentModule === 'portal'
                  ? 'bg-slate-700 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>ওয়েবসাইট</span>
            </button>
          </nav>

          {/* Quick Role Switcher for Testing */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden lg:inline">লগইন রোল:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                disabled={switching}
                onClick={() => handleRoleChange('ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Admin role"
              >
                Admin
              </button>
              <button
                disabled={switching}
                onClick={() => handleRoleChange('TEACHER')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  currentRole === 'TEACHER'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Teacher role"
              >
                Teacher
              </button>
              <button
                disabled={switching}
                onClick={() => handleRoleChange('STUDENT')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  currentRole === 'STUDENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Student role"
              >
                Student
              </button>
            </div>

            {/* Token Viewer Modal Button */}
            {token && (
              <button
                onClick={() => setShowTokenModal(true)}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition cursor-pointer"
                title="View active JWT Token & Claims"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* JWT Token & Claims Inspector Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>JWT Authentication Details</span>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Active User Profile:</label>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300">
                  <p>Name: {user?.name}</p>
                  <p>Username: {user?.username}</p>
                  <p>Role: {user?.role}</p>
                  <p>Email: {user?.email}</p>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Bearer Token (Header Authorization):</label>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-300 break-all select-all max-h-24 overflow-y-auto">
                  {token}
                </div>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-800 p-2.5 rounded-xl text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All API requests automatically transmit Bearer JWT token to protected endpoints.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
